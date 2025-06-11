import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { supabase } from "@/lib/supabase";
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

    console.log("Starting hackathon sync...");

    // 1. Parsing dei nuovi hackathons
    const parser = new LumaParser();
    const parsedHackathons = await parser.parse();
    console.log(`Parsed ${parsedHackathons.length} hackathons`);

    // 2. Inserimento nel database
    const newHackathons: Hackathon[] = [];

    for (const hackathon of parsedHackathons) {
      try {
        const { data: existing } = await supabase
          .from("hackathons")
          .select("id")
          .eq("url", hackathon.url)
          .single();

        if (!existing) {
          const { data: inserted, error } = await supabase
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
          }
        }
      } catch (error) {
        console.error("Error processing hackathon:", hackathon.name, error);
      }
    }

    console.log(`Inserted ${newHackathons.length} new hackathons`);

    // 3. Aggiorna stati degli hackathons (da upcoming a past)
    try {
      await supabase.rpc("update_hackathon_statuses");
    } catch (error) {
      console.error("Error updating hackathon statuses:", error);
    }

    // 4. Invia notifiche per i nuovi hackathons
    const notificationErrors: string[] = [];
    if (newHackathons.length > 0) {
      console.log(
        `Sending notifications for ${newHackathons.length} new hackathons...`,
      );

      const discordBot = new DiscordBot();
      const telegramBot = new TelegramBot();
      const twitterBot = new TwitterBot();

      const notifications = await Promise.allSettled([
        discordBot
          .initialize()
          .then(() => discordBot.notifyNewHackathons(newHackathons))
          .finally(() => discordBot.destroy()),
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
          await supabase
            .from("hackathons")
            .update({ notified: true })
            .in(
              "id",
              newHackathons.map((h) => h.id),
            );
          console.log("Hackathons marked as notified");
        } catch (error) {
          console.error("Error updating notification status:", error);
        }
      }
    }

    // 5. Aggiorna il README via GitHub API
    let readmeUpdated = false;
    let readmeError: string | null = null;

    try {
      console.log("Updating README via GitHub API...");

      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      const owner = process.env.GITHUB_REPO_OWNER || "lorenzopalaia";
      const repo = process.env.GITHUB_REPO_NAME || "Euro-Hackathons";
      const branch = process.env.GITHUB_BRANCH || "v2";

      // Genera il nuovo contenuto del README
      const readmeUpdater = new ReadmeUpdater();
      const newReadmeContent = await readmeUpdater.generateReadmeContent();

      // Ottieni il file corrente
      const { data: currentFile } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: "README.md",
        ref: branch,
      });

      if ("content" in currentFile) {
        const currentContent = Buffer.from(
          currentFile.content,
          "base64",
        ).toString("utf-8");

        // Solo se il contenuto è diverso, aggiorna
        if (currentContent !== newReadmeContent) {
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: "README.md",
            message: "🔄 Auto-update README with latest hackathons [Automated]",
            content: Buffer.from(newReadmeContent).toString("base64"),
            sha: currentFile.sha,
            branch,
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

    return NextResponse.json({
      success: true,
      parsed: parsedHackathons.length,
      inserted: newHackathons.length,
      readmeUpdated,
      readmeError,
      notificationErrors:
        notificationErrors.length > 0 ? notificationErrors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
