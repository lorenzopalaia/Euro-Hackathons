import { Hackathon } from "@/types/hackathon";

export class TelegramBot {
  private token: string;
  private channelId: string; // Rinominato da chatId per chiarezza

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN!;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID!; // ID del canale (negativo)
  }

  async notifyNewHackathons(hackathons: Hackathon[]) {
    if (hackathons.length === 0) return;

    for (const hackathon of hackathons) {
      try {
        const message = this.formatMessage(hackathon);
        await this.sendMessage(message);

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error sending Telegram notification:", error);
      }
    }
  }

  private formatMessage(hackathon: Hackathon): string {
    const date = this.formatDate(hackathon);
    const topics = hackathon.topics?.length
      ? `\n🏷️ *Topics:* ${hackathon.topics.join(", ")}`
      : "";

    return `🚀 *New European Hackathon!*

📝 *Name:* ${hackathon.name.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&")}
📍 *Location:* ${hackathon.location.replace(
      /[_*[\]()~`>#+\-=|{}.!\\]/g,
      "\\$&",
    )}
📅 *Date:* ${date}${topics}

🔗 [Join here](${hackathon.url})`;
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

  private async sendMessage(text: string) {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: this.channelId, // Usa l'ID del canale
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error: ${error}`);
    }
  }
}
