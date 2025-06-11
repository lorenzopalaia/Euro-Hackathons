import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { Hackathon } from "@/types/hackathon";

export class DiscordBot {
  private client: Client;
  private channelId: string;
  private isInitialized: boolean = false;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });
    this.channelId = process.env.DISCORD_CHANNEL_ID!;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN!);
      this.isInitialized = true;

      // Wait for client to be ready
      await new Promise((resolve) => {
        this.client.once("ready", resolve);
      });
    } catch (error) {
      console.error("Error initializing Discord bot:", error);
      throw error;
    }
  }

  async notifyNewHackathons(hackathons: Hackathon[]) {
    if (hackathons.length === 0) return;

    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const channel = await this.client.channels.fetch(this.channelId);
      if (!channel?.isTextBased() || !("send" in channel)) {
        console.error("Discord channel not found or not text-based");
        return;
      }

      for (const hackathon of hackathons) {
        const embed = new EmbedBuilder()
          .setTitle(`🚀 New Hackathon: ${hackathon.name}`)
          .setColor(0x00ae86)
          .addFields(
            { name: "📍 Location", value: hackathon.location, inline: true },
            {
              name: "📅 Date",
              value: this.formatDate(hackathon),
              inline: true,
            },
            {
              name: "🔗 URL",
              value: `[Join here](${hackathon.url})`,
              inline: false,
            }
          )
          .setTimestamp();

        if (hackathon.topics && hackathon.topics.length > 0) {
          embed.addFields({
            name: "🏷️ Topics",
            value: hackathon.topics.join(", "),
            inline: true,
          });
        }

        await channel.send({ embeds: [embed] });

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error sending Discord notifications:", error);
    }
  }

  private formatDate(hackathon: Hackathon): string {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-GB");
    }

    return `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString(
      "en-GB"
    )}`;
  }

  async destroy() {
    if (this.isInitialized) {
      await this.client.destroy();
      this.isInitialized = false;
    }
  }
}
