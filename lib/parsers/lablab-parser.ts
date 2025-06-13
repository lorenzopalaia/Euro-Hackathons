import { BaseParser, ParsedHackathon } from "@/lib/parsers/base-parser";

interface LablabEvent {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  slug: string;
  type: string;
  active: boolean;
  signupActive: boolean;
  toBeAnnounced: boolean;
  _count: {
    participants: number;
  };
}

interface LablabApiResponse {
  pageProps: {
    sortedEvents: LablabEvent[];
  };
}

export class LablabParser extends BaseParser {
  private readonly baseUrl = "https://lablab.ai";
  private readonly eventsPath = "/event.json";

  async parse(): Promise<ParsedHackathon[]> {
    try {
      // 1. Ottieni il build ID dalla homepage
      const buildId = await this.getBuildId();
      console.log(`Found Lablab build ID: ${buildId}`);

      // 2. Costruisci l'URL per il JSON degli eventi
      const eventsUrl = `${this.baseUrl}/_next/data/${buildId}${this.eventsPath}`;

      // 3. Fetch dei dati degli eventi
      const events = await this.fetchEvents(eventsUrl);

      // 4. Filtra e mappa gli hackathon
      const hackathons = this.filterAndMapHackathons(events);

      console.log(`Lablab parser found ${hackathons.length} hackathons`);
      return hackathons;
    } catch (error) {
      console.error("Error in Lablab parser:", error);
      return [];
    }
  }

  private async getBuildId(): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch homepage: ${response.status}`);
      }

      const html = await response.text();

      // Cerca il build ID nel HTML - pattern comune di Next.js
      const buildIdMatch = html.match(/"buildId":"([^"]+)"/);
      if (buildIdMatch && buildIdMatch[1]) {
        return buildIdMatch[1];
      }

      // Fallback: cerca nel tag script con _next/static
      const scriptMatch = html.match(
        /_next\/static\/([^\/]+)\/_buildManifest\.js/
      );
      if (scriptMatch && scriptMatch[1]) {
        return scriptMatch[1];
      }

      // Altro fallback: cerca pattern nel JSON embedded
      const jsonMatch = html.match(/\/_next\/data\/([^\/]+)\//);
      if (jsonMatch && jsonMatch[1]) {
        return jsonMatch[1];
      }

      throw new Error("Could not extract build ID from homepage");
    } catch (error) {
      console.error("Error getting build ID:", error);
      throw error;
    }
  }

  private async fetchEvents(url: string): Promise<LablabEvent[]> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data: LablabApiResponse = await response.json();

      if (!data.pageProps || !data.pageProps.sortedEvents) {
        throw new Error("Invalid API response structure");
      }

      return data.pageProps.sortedEvents;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  private filterAndMapHackathons(events: LablabEvent[]): ParsedHackathon[] {
    return events
      .filter((event) => this.isValidHackathon(event))
      .map((event) => this.mapEventToHackathon(event))
      .filter((hackathon): hackathon is ParsedHackathon => hackathon !== null);
  }

  private isValidHackathon(event: LablabEvent): boolean {
    // Filtra solo hackathon attivi, non annunciati e futuri
    if (!event.active || event.toBeAnnounced || event.type !== "HACKATHON") {
      return false;
    }

    // Verifica che abbia date valide
    if (!event.startAt || !event.endAt) {
      return false;
    }

    // Filtra solo eventi futuri
    const startDate = new Date(event.startAt);
    const now = new Date();

    return startDate >= now;
  }

  private mapEventToHackathon(event: LablabEvent): ParsedHackathon | null {
    try {
      const dates = this.formatDate(event.startAt, event.endAt);

      // Estrai i topic dalla descrizione e nome
      const topics = this.extractTopics(event.name, event.description);

      // Crea le note con informazioni aggiuntive
      const notes = this.createNotes(event);

      return {
        name: event.name.replace(/\|/g, "-").trim(),
        location: "Remote",
        city: undefined,
        country_code: undefined,
        date_start: dates.start,
        date_end: dates.end,
        topics,
        notes,
        url: `${this.baseUrl}/event/${event.slug}`,
        source: "lablab",
      };
    } catch (error) {
      console.error(`Error mapping event ${event.name}:`, error);
      return null;
    }
  }

  private extractTopics(name: string, description: string): string[] {
    const topics: string[] = [];
    const text = `${name} ${description}`.toLowerCase();

    // AI/ML topics
    if (
      text.includes("ai") ||
      text.includes("artificial intelligence") ||
      text.includes("machine learning") ||
      text.includes("ml") ||
      text.includes("neural") ||
      text.includes("deep learning")
    ) {
      topics.push("AI");
    }

    // Blockchain/Crypto topics
    if (
      text.includes("blockchain") ||
      text.includes("crypto") ||
      text.includes("bitcoin") ||
      text.includes("ethereum") ||
      text.includes("defi") ||
      text.includes("nft")
    ) {
      topics.push("Crypto");
    }

    // Web3 topics
    if (
      text.includes("web3") ||
      text.includes("dapp") ||
      text.includes("decentralized")
    ) {
      topics.push("Web3");
    }

    // Fintech topics
    if (
      text.includes("fintech") ||
      text.includes("finance") ||
      text.includes("banking") ||
      text.includes("payment")
    ) {
      topics.push("Fintech");
    }

    // Healthcare topics
    if (
      text.includes("health") ||
      text.includes("medical") ||
      text.includes("healthcare") ||
      text.includes("biotech")
    ) {
      topics.push("Healthcare");
    }

    // Sustainability topics
    if (
      text.includes("climate") ||
      text.includes("sustainability") ||
      text.includes("green") ||
      text.includes("environment")
    ) {
      topics.push("Sustainability");
    }

    // Gaming topics
    if (
      text.includes("game") ||
      text.includes("gaming") ||
      text.includes("unity") ||
      text.includes("gamedev")
    ) {
      topics.push("Gaming");
    }

    return topics;
  }

  private createNotes(event: LablabEvent): string {
    const notes: string[] = [];

    // Aggiungi informazioni sui partecipanti
    if (event._count.participants > 0) {
      notes.push(`${event._count.participants} participants`);
    }

    // Aggiungi informazioni sul signup
    if (event.signupActive) {
      notes.push("Registration open");
    }

    // Estrai premi dalla descrizione
    const prizeMatch = event.description.match(/\$[\d,]+/g);
    if (prizeMatch && prizeMatch.length > 0) {
      const prizes = prizeMatch.join(", ");
      notes.push(`Prizes: ${prizes}`);
    }

    return notes.join(" • ");
  }
}
