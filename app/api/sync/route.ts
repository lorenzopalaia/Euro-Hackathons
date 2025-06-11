import { NextResponse } from "next/server";
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

    // Parsing
    const parser = new LumaParser();
    const parsedHackathons = await parser.parse();

    console.log(`Parsed ${parsedHackathons.length} hackathons`);

    // Inserimento nel database
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

    // Aggiorna stati degli hackathons (da upcoming a past)
    try {
      await supabase.rpc("update_hackathon_statuses");
    } catch (error) {
      console.error("Error updating hackathon statuses:", error);
    }

    // Notifiche
    const notificationErrors: string[] = [];
    if (newHackathons.length > 0) {
      const discordBot = new DiscordBot();
      const telegramBot = new TelegramBot();
      const twitterBot = new TwitterBot();

      // Invia notifiche con gestione errori individuale
      const notifications = await Promise.allSettled([
        discordBot
          .initialize()
          .then(() => discordBot.notifyNewHackathons(newHackathons)),
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

      // Cleanup Discord bot
      try {
        await discordBot.destroy();
      } catch (error) {
        console.error("Error destroying Discord bot:", error);
      }

      // Marca come notificati solo se almeno una notifica è andata a buon fine
      if (notificationErrors.length < 3) {
        try {
          await supabase
            .from("hackathons")
            .update({ notified: true })
            .in(
              "id",
              newHackathons.map((h) => h.id)
            );
        } catch (error) {
          console.error("Error updating notification status:", error);
        }
      }
    }

    // Aggiorna il README
    let readmeUpdated = false;
    try {
      const readmeUpdater = new ReadmeUpdater();
      await readmeUpdater.updateReadme();
      readmeUpdated = true;
      console.log("README updated successfully");
    } catch (error) {
      console.error("Error updating README:", error);
    }

    return NextResponse.json({
      success: true,
      parsed: parsedHackathons.length,
      inserted: newHackathons.length,
      readmeUpdated,
      notificationErrors:
        notificationErrors.length > 0 ? notificationErrors : undefined,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
