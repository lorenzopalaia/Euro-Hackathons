import { BaseParser, ParsedHackathon } from "@/lib/parsers/base-parser";
import { europeanCountries } from "@/lib/european-countries";

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

      // Crea le note con informazioni aggiuntive
      const notes = this.createNotes(event);

      // Prova a estrarre location dal nome o descrizione se disponibile
      // Lablab non fornisce dati di location strutturati, quindi cerchiamo pattern
      const locationData = this.extractLocationFromText(
        event.name,
        event.description
      );

      // Filtra solo hackathon europei - se abbiamo un country_code, deve essere europeo
      if (
        locationData.country_code &&
        !europeanCountries.isValidEuropeanCountry(locationData.country_code)
      ) {
        return null;
      }

      return {
        name: event.name.replace(/\|/g, "-").trim(),
        city: locationData.city,
        country_code: locationData.country_code,
        date_start: dates.start,
        date_end: dates.end,
        topics: this.extractTopics(event.name, event.description),
        notes,
        url: `${this.baseUrl}/event/${event.slug}`,
        source: "lablab",
      };
    } catch (error) {
      console.error(`Error mapping event ${event.name}:`, error);
      return null;
    }
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

  private extractLocationFromText(
    name: string,
    description: string
  ): { city?: string; country_code?: string } {
    const combinedText = `${name} ${description}`.toLowerCase();

    // Pattern comuni per trovare location in testi
    const locationPatterns = [
      // Pattern come "in Berlin", "in London", "in Paris"
      /\bin\s+([a-z\s]+?)(?:\s|,|$)/gi,
      // Pattern come "@ Berlin", "@ London"
      /@\s*([a-z\s]+?)(?:\s|,|$)/gi,
      // Pattern come "Berlin Hackathon", "London Event"
      /([a-z\s]+?)\s+(?:hackathon|event|summit|conference)/gi,
      // Pattern come "Hackathon Berlin", "Event London"
      /(?:hackathon|event|summit|conference)\s+([a-z\s]+?)(?:\s|,|$)/gi,
    ];

    const foundLocations: string[] = [];

    for (const pattern of locationPatterns) {
      const matches = combinedText.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          foundLocations.push(match[1].trim());
        }
      }
    }

    // Prova a mappare le location trovate
    for (const location of foundLocations) {
      // Prima prova come paese
      const country = europeanCountries.normalizeCountry(location);
      if (country) {
        return { country_code: country };
      }

      // Poi prova come città conosciuta + deduzione paese
      const city = europeanCountries.normalizeCity(location);
      if (city) {
        // Usa il mapping città-paese del sistema unificato
        const detectedCountry = europeanCountries.inferCountryFromCity(city);
        if (detectedCountry) {
          return { city, country_code: detectedCountry };
        }

        // Se non riusciamo a dedurre il paese, restituiamo solo la città
        return { city };
      }
    }

    return {};
  }
}
