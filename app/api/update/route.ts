import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { supabaseAdmin } from "@/lib/supabase";
import { LumaParser } from "@/lib/parsers/luma-parser";
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

    console.log("Starting hackathon update...");

    // 1. Parsing dei nuovi hackathons
    const parser = new LumaParser();
    const parsedHackathons = await parser.parse();
    console.log(`Parsed ${parsedHackathons.length} hackathons`);

    // 2. Inserimento nel database
    const newHackathons: Hackathon[] = [];
    let insertionError: string | null = null;

    try {
      for (const hackathon of parsedHackathons) {
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
                notified: false,
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

    // 4. Invia notifiche SOLO se ci sono nuovi hackathons
    const notificationErrors: string[] = [];
    let notificationsSent = false;

    if (newHackathons.length > 0 && !insertionError) {
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
    } else {
      console.log("No new hackathons to notify");
    }

    // 5. Aggiorna il README SOLO se i dati sono cambiati
    let readmeUpdated = false;
    let readmeError: string | null = null;

    if (dataChanged) {
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
