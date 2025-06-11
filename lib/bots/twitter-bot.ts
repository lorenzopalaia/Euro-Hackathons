import { TwitterApi } from "twitter-api-v2";
import { Hackathon } from "@/types/hackathon";

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

    for (const [index, hackathon] of hackathons.entries()) {
      const tweet = this.formatTweet(hackathon);

      try {
        await this.client.v2.tweet(tweet);

        // Rate limiting - aspetta tra i tweet
        if (index < hackathons.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: unknown) {
        const errorObj = error as {
          message?: string;
          code?: number;
          type?: string;
          data?: {
            errors?: unknown[];
          };
        };
        console.error(`❌ Error posting tweet for ${hackathon.name}:`, {
          message: errorObj?.message,
          code: errorObj?.code,
          type: errorObj?.type,
          data: errorObj?.data,
        });

        if (errorObj?.data?.errors) {
          console.error("📋 Twitter API Error Details:", errorObj.data.errors);
        }
      }
    }
  }

  private formatTweet(hackathon: Hackathon): string {
    const date = this.formatDate(hackathon);

    // Limita i topics per evitare tweet troppo lunghi
    const topics = hackathon.topics?.length
      ? ` #${hackathon.topics.slice(0, 3).join(" #")}`
      : "";

    const location = hackathon.city
      ? `in ${hackathon.city}`
      : hackathon.location || "";

    let tweet = `🚀 New Hackathon!

${hackathon.name} ${location}
📅 ${date}

Join: ${hackathon.url}

#Hackathon #Europe${topics} #Coding #Tech`;

    // Verifica lunghezza e tronca se necessario
    if (tweet.length > 280) {
      const excess = tweet.length - 280;
      const maxNameLength = hackathon.name.length - excess - 3; // -3 per "..."

      if (maxNameLength > 10) {
        // Mantieni almeno 10 caratteri del nome
        const truncatedName =
          hackathon.name.substring(0, maxNameLength) + "...";
        tweet = tweet.replace(hackathon.name, truncatedName);
      } else {
        // Se il nome è troppo corto, rimuovi alcuni topic
        const shorterTopics = hackathon.topics?.length
          ? ` #${hackathon.topics.slice(0, 1).join(" #")}`
          : "";

        tweet = `🚀 New Hackathon!

${hackathon.name} ${location}
📅 ${date}

Join: ${hackathon.url}

#Hackathon #Europe${shorterTopics}`;
      }
    }

    return tweet;
  }

  private formatDate(hackathon: Hackathon): string {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-GB");
    }

    return `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;
  }
}
