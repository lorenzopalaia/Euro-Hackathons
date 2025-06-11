import { BaseScraper, ScrapedHackathon } from "./base-scraper";

interface LumaGeoInfo {
  city?: string;
  country_code?: string;
}

interface LumaEvent {
  name: string;
  start_at: string;
  end_at: string;
  url: string;
  geo_address_info?: LumaGeoInfo;
}

interface LumaEventEntry {
  event: LumaEvent;
}

interface LumaApiResponse {
  entries: LumaEventEntry[];
  has_more: boolean;
  next_cursor?: string;
}

export class LumaScraper extends BaseScraper {
  private readonly slugs = ["ai", "crypto", "hackathon"];
  private readonly bounds = {
    south: 34.800556,
    north: 81.806667,
    west: -31.275,
    east: 69.033333,
  };

  async scrape(): Promise<ScrapedHackathon[]> {
    const allHackathons: ScrapedHackathon[] = [];

    for (const slug of this.slugs) {
      try {
        const events = await this.fetchEventsForSlug(slug);
        const hackathons = this.filterHackathons(events);
        allHackathons.push(...hackathons);
      } catch (error) {
        console.error(`Error scraping slug ${slug}:`, error);
      }
    }

    return this.deduplicateHackathons(allHackathons);
  }

  private async fetchEventsForSlug(slug: string): Promise<LumaEventEntry[]> {
    const allEvents: LumaEventEntry[] = [];
    let cursor: string | null = null;

    while (true) {
      const params = new URLSearchParams({
        slug,
        south: this.bounds.south.toString(),
        north: this.bounds.north.toString(),
        west: this.bounds.west.toString(),
        east: this.bounds.east.toString(),
        ...(cursor && { pagination_cursor: cursor }),
      });

      const response = await fetch(
        `https://api.lu.ma/discover/category/get-events?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LumaApiResponse = await response.json();
      const events = data.entries || [];
      allEvents.push(...events);

      if (!data.has_more || !data.next_cursor) break;
      cursor = data.next_cursor;
    }

    return allEvents;
  }

  private filterHackathons(events: LumaEventEntry[]): ScrapedHackathon[] {
    return events
      .filter((entry) => {
        const name = entry.event?.name?.toLowerCase() || "";
        return (
          name.includes("hackathon") ||
          name.includes("hack day") ||
          name.includes("coding")
        );
      })
      .map((entry) => this.mapEventToHackathon(entry))
      .filter((hackathon) => hackathon !== null) as ScrapedHackathon[];
  }

  private mapEventToHackathon(entry: LumaEventEntry): ScrapedHackathon | null {
    try {
      const event = entry.event;
      const geo = event.geo_address_info || {};

      const dates = this.formatDate(event.start_at, event.end_at);

      // Filtra solo eventi futuri o recenti (massimo 30 giorni nel passato)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      if (dates.start < thirtyDaysAgo) return null;

      return {
        name: event.name.replace(/\|/g, "-"),
        location: `${geo.city || "N/A"}, ${geo.country_code || "N/A"}`,
        city: geo.city,
        country_code: geo.country_code,
        date_start: dates.start,
        date_end: dates.end,
        topics: this.extractTopics(event.name),
        url: `https://lu.ma/${event.url}`,
        source: "luma",
      };
    } catch (error) {
      console.error("Error mapping event:", error);
      return null;
    }
  }

  private extractTopics(name: string): string[] {
    const topics: string[] = [];
    const lowerName = name.toLowerCase();

    if (lowerName.includes("ai") || lowerName.includes("artificial"))
      topics.push("AI");
    if (lowerName.includes("crypto") || lowerName.includes("blockchain"))
      topics.push("Crypto");
    if (lowerName.includes("web3")) topics.push("Web3");
    if (lowerName.includes("defence") || lowerName.includes("defense"))
      topics.push("Defense");

    return topics;
  }

  private deduplicateHackathons(
    hackathons: ScrapedHackathon[]
  ): ScrapedHackathon[] {
    const seen = new Set<string>();
    return hackathons.filter((hackathon) => {
      const key = `${hackathon.name}-${hackathon.date_start.toISOString()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
