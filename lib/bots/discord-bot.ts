import { Hackathon } from "@/types/hackathon";
import { europeanCountries } from "@/lib/european-countries";

export class DiscordBot {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL!;
  }

  async notifyNewHackathons(hackathons: Hackathon[]) {
    if (hackathons.length === 0) return;

    for (const hackathon of hackathons) {
      try {
        const embed = {
          title: `🚀 New Hackathon!

${hackathon.name}`,
          color: 0x00ae86,
          fields: [
            {
              name: "📍 Location",
              value:
                europeanCountries.formatLocation(
                  hackathon.city,
                  hackathon.country_code,
                ) || "TBD",
              inline: true,
            },
            {
              name: "📅 Date",
              value: this.formatDate(hackathon),
              inline: true,
            },
            {
              name: "🔗 Join",
              value: `[Register here](${hackathon.url})`,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        };

        if (hackathon.topics && hackathon.topics.length > 0) {
          embed.fields.push({
            name: "🏷️ Topics",
            value: hackathon.topics.join(", "),
            inline: true,
          });
        }

        await fetch(this.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [embed],
          }),
        });

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error sending Discord notification:", error);
      }
    }
  }

  private formatDate(hackathon: Hackathon): string {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-GB");
    }

    return `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString(
      "en-GB",
    )}`;
  }
}
