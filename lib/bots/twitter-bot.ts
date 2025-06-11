import { TwitterApi } from "twitter-api-v2";
import { Hackathon } from "../database.types";

export class TwitterBot {
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });
  }

  async notifyNewHackathons(hackathons: Hackathon[]) {
    if (hackathons.length === 0) return;

    for (const hackathon of hackathons) {
      const tweet = this.formatTweet(hackathon);

      try {
        await this.client.v2.tweet(tweet);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
      } catch (error) {
        console.error("Error posting tweet:", error);
      }
    }
  }

  private formatTweet(hackathon: Hackathon): string {
    const date = this.formatDate(hackathon);
    const topics = hackathon.topics?.length
      ? ` #${hackathon.topics.join(" #")}`
      : "";
    const location = hackathon.city
      ? `in ${hackathon.city}`
      : hackathon.location;

    return `🚀 Nuovo Hackathon Europeo!

${hackathon.name} ${location}
📅 ${date}

Partecipa: ${hackathon.url}

#Hackathon #Europe${topics} #Coding #Tech`;
  }

  private formatDate(hackathon: Hackathon): string {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("it-IT");
    }

    return `${start.toLocaleDateString("it-IT")} - ${end.toLocaleDateString(
      "it-IT"
    )}`;
  }
}
