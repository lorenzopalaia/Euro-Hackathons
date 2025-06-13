import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { supabaseAdmin } from "@/lib/supabase";
import { LumaParser } from "@/lib/parsers/luma-parser";
import { LablabParser } from "@/lib/parsers/lablab-parser";
import { ParsedHackathon } from "@/lib/parsers/base-parser";
import { DiscordBot } from "@/lib/bots/discord-bot";
import { TelegramBot } from "@/lib/bots/telegram-bot";
import { TwitterBot } from "@/lib/bots/twitter-bot";
import { ReadmeUpdater } from "@/lib/services/readme-updater";
import { Hackathon } from "@/types/hackathon";

export async function POST(request: Request) {
  try {
    // Verifica autenticazione
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Controlla se è una richiesta di test (solo database, senza notifiche)
    const testMode = request.headers.get("x-test-mode") === "true";

    console.log(
      `Starting hackathon update${testMode ? " (TEST MODE - no notifications)" : ""}...`
    );

    // 1. Parsing dei nuovi hackathons da entrambe le fonti
    const lumaParser = new LumaParser();
    const lablabParser = new LablabParser();

    const [lumaHackathons, lablabHackathons] = await Promise.allSettled([
      lumaParser.parse(),
      lablabParser.parse(),
    ]);

    const parsedHackathons: ParsedHackathon[] = [];

    if (lumaHackathons.status === "fulfilled") {
      parsedHackathons.push(...lumaHackathons.value);
      console.log(`Parsed ${lumaHackathons.value.length} hackathons from Luma`);
    } else {
      console.error("Luma parser failed:", lumaHackathons.reason);
    }

    if (lablabHackathons.status === "fulfilled") {
      parsedHackathons.push(...lablabHackathons.value);
      console.log(
        `Parsed ${lablabHackathons.value.length} hackathons from Lablab`
      );
    } else {
      console.error("Lablab parser failed:", lablabHackathons.reason);
    }

    console.log(`Total parsed ${parsedHackathons.length} hackathons`);

    // Deduplicazione degli hackathons basata su nome e data
    const deduplicatedHackathons = parsedHackathons.filter(
      (hackathon, index, array) => {
        const key = `${hackathon.name.toLowerCase()}-${hackathon.date_start.toISOString().split("T")[0]}`;
        return (
          array.findIndex(
            (h) =>
              `${h.name.toLowerCase()}-${h.date_start.toISOString().split("T")[0]}` ===
              key
          ) === index
        );
      }
    );

    console.log(
      `After deduplication: ${deduplicatedHackathons.length} hackathons`
    );

    // 2. Inserimento nel database
    const newHackathons: Hackathon[] = [];
    let insertionError: string | null = null;

    try {
      for (const hackathon of deduplicatedHackathons) {
        try {
          const { data: existing } = await supabaseAdmin
            .from("hackathons")
            .select("id")
            .eq("url", hackathon.url)
            .single();

          if (!existing) {
            const { data: inserted, error } = await supabaseAdmin
              .from("hackathons")
              .insert({
                name: hackathon.name,
                location: hackathon.location,
                city: hackathon.city,
                country_code: hackathon.country_code,
                date_start: hackathon.date_start.toISOString().split("T")[0],
                date_end: hackathon.date_end?.toISOString().split("T")[0],
                topics: hackathon.topics,
                notes: hackathon.notes,
                url: hackathon.url,
                source: hackathon.source,
                notified: testMode ? true : false, // In test mode, marca come già notificato
              })
              .select()
              .single();

            if (inserted && !error) {
              newHackathons.push(inserted);
            } else if (error) {
              console.error("Error inserting hackathon:", error);
              throw error;
            }
          }
        } catch (error) {
          console.error("Error processing hackathon:", hackathon.name, error);
          throw error;
        }
      }
      console.log(`Inserted ${newHackathons.length} new hackathons`);
    } catch (error) {
      insertionError =
        error instanceof Error ? error.message : "Database insertion failed";
      console.error("Database insertion failed:", error);
    }

    // 3. Aggiorna stati degli hackathons (da upcoming a past)
    let statusUpdateError: string | null = null;
    let statusesUpdated = false;

    try {
      await supabaseAdmin.rpc("update_hackathon_statuses");
      statusesUpdated = true;
      console.log("Hackathon statuses updated successfully");
    } catch (error) {
      statusUpdateError =
        error instanceof Error ? error.message : "Status update failed";
      console.error("Error updating hackathon statuses:", error);
    }

    // Determina se c'è stata qualche modifica ai dati
    const dataChanged = newHackathons.length > 0 || statusesUpdated;

    // 4. Invia notifiche SOLO se ci sono nuovi hackathons E non è in test mode
    const notificationErrors: string[] = [];
    let notificationsSent = false;

    if (newHackathons.length > 0 && !insertionError && !testMode) {
      console.log(
        `Sending notifications for ${newHackathons.length} new hackathons...`
      );

      const discordBot = new DiscordBot();
      const telegramBot = new TelegramBot();
      const twitterBot = new TwitterBot();

      const notifications = await Promise.allSettled([
        discordBot.notifyNewHackathons(newHackathons),
        telegramBot.notifyNewHackathons(newHackathons),
        twitterBot.notifyNewHackathons(newHackathons),
      ]);

      notifications.forEach((result, index) => {
        if (result.status === "rejected") {
          const platform = ["Discord", "Telegram", "Twitter"][index];
          console.error(`${platform} notification failed:`, result.reason);
          notificationErrors.push(platform);
        }
      });

      // Marca come notificati solo se almeno una notifica è andata a buon fine
      if (notificationErrors.length < 3) {
        try {
          await supabaseAdmin
            .from("hackathons")
            .update({ notified: true })
            .in(
              "id",
              newHackathons.map((h) => h.id)
            );
          notificationsSent = true;
          console.log("Hackathons marked as notified");
        } catch (error) {
          console.error("Error updating notification status:", error);
        }
      }
    } else if (newHackathons.length > 0 && insertionError) {
      console.log("Skipping notifications due to database insertion errors");
    } else if (testMode && newHackathons.length > 0) {
      console.log("Test mode: notifications skipped");
    } else {
      console.log("No new hackathons to notify");
    }

    // 5. Aggiorna il README SOLO se i dati sono cambiati E non è in test mode
    let readmeUpdated = false;
    let readmeError: string | null = null;

    if (dataChanged && !testMode) {
      try {
        console.log("Data changed, updating README via GitHub API...");

        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN,
        });

        // Genera il nuovo contenuto del README
        const readmeUpdater = new ReadmeUpdater();
        const newReadmeContent = await readmeUpdater.generateReadmeContent();

        // Ottieni il file corrente
        const { data: currentFile } = await octokit.rest.repos.getContent({
          owner: "lorenzopalaia",
          repo: "Euro-Hackathons",
          path: "README.md",
        });

        if ("content" in currentFile) {
          const currentContent = Buffer.from(
            currentFile.content,
            "base64"
          ).toString("utf-8");

          // Solo se il contenuto è diverso, aggiorna
          if (currentContent !== newReadmeContent) {
            await octokit.rest.repos.createOrUpdateFileContents({
              owner: "lorenzopalaia",
              repo: "Euro-Hackathons",
              path: "README.md",
              message:
                "🔄 Auto-update README with latest hackathons [Automated]",
              content: Buffer.from(newReadmeContent).toString("base64"),
              sha: currentFile.sha,
            });

            readmeUpdated = true;
            console.log("README updated successfully via GitHub API");
          } else {
            console.log("README content unchanged, skipping update");
          }
        }
      } catch (error) {
        console.error("Error updating README:", error);
        readmeError = error instanceof Error ? error.message : "Unknown error";
      }
    } else if (testMode) {
      console.log("Test mode: README update skipped");
    } else {
      console.log("No data changes detected, skipping README update");
    }

    // Determina lo stato di successo generale
    const hasErrors =
      insertionError ||
      statusUpdateError ||
      readmeError ||
      notificationErrors.length > 0;

    return NextResponse.json({
      success: !hasErrors,
      testMode,
      parsed: parsedHackathons.length,
      inserted: newHackathons.length,
      dataChanged,
      insertionError,
      statusUpdateError,
      statusesUpdated,
      notificationsSent,
      readmeUpdated,
      readmeError,
      notificationErrors:
        notificationErrors.length > 0 ? notificationErrors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
