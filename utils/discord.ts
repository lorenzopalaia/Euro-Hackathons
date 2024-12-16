import { REST } from "@discordjs/rest";
import {
  RESTPostAPIChannelMessageResult,
  Routes,
  APIEmbed,
} from "discord-api-types/v10";

export class DiscordClient {
  private rest: REST;
  private DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID ?? "";

  constructor() {
    this.rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN ?? "",
    );
  }

  async sendEmbed(embed: APIEmbed) {
    const channel = { id: this.DISCORD_CHANNEL_ID };

    const res = this.rest.post(Routes.channelMessages(channel.id), {
      body: { embeds: [embed] },
    });

    return res as Promise<RESTPostAPIChannelMessageResult>;
  }
}
