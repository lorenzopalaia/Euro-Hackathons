import { BaseParser, ParsedHackathon } from "@/lib/parsers/base-parser";
import { europeanCountries } from "@/lib/european-countries";

interface LumaGeoInfo {
  city?: string;
  country_code?: string;
  // Fallback
  city_state?: string; // Comma separated city and state
  region?: string; // Region or state
}

interface LumaEvent {
  name: string;
  start_at: string;
  end_at: string;
  url: string;
  description?: string; // Add description field for topic extraction
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

export class LumaParser extends BaseParser {
  private readonly slugs = ["ai", "crypto", "hackathon"];
  private readonly bounds = {
    south: 34.800556,
    north: 81.806667,
    west: -31.275,
    east: 69.033333,
  };

  async parse(): Promise<ParsedHackathon[]> {
    const allHackathons: ParsedHackathon[] = [];

    for (const slug of this.slugs) {
      try {
        const events = await this.fetchEventsForSlug(slug);
        const hackathons = this.filterHackathons(events);
        allHackathons.push(...hackathons);
      } catch (error) {
        console.error(`Error parsing slug ${slug}:`, error);
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
        `https://api.lu.ma/discover/category/get-events?${params}`,
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

  private filterHackathons(events: LumaEventEntry[]): ParsedHackathon[] {
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
      .filter((hackathon) => hackathon !== null) as ParsedHackathon[];
  }

  private mapEventToHackathon(entry: LumaEventEntry): ParsedHackathon | null {
    try {
      const event = entry.event;
      const geo = event.geo_address_info || {};

      const dates = this.formatDate(event.start_at, event.end_at);

      // Filtra solo eventi futuri
      const now = new Date();
      if (dates.start < now) return null;

      // Estrai i dati di location usando il normalizer
      let city = europeanCountries.normalizeCity(geo.city);
      let country_code = europeanCountries.normalizeCountry(geo.country_code);

      // Fallback per dati incompleti
      if (!city && geo.city_state) {
        const parts = geo.city_state.split(",").map((p) => p.trim());
        if (parts.length >= 1) {
          city = europeanCountries.normalizeCity(parts[0]);
        }
      }

      if (!country_code) {
        // Prova con region come fallback
        country_code = europeanCountries.normalizeCountry(geo.region);

        // Se ancora non abbiamo il paese, prova a estrarre dall'ultima parte di city_state
        if (!country_code && geo.city_state) {
          const parts = geo.city_state.split(",").map((p) => p.trim());
          if (parts.length >= 2) {
            country_code = europeanCountries.normalizeCountry(
              parts[parts.length - 1],
            );
          }
        }
      }

      // Se abbiamo un country_code determinato, verifica che sia europeo
      // Altrimenti lascia che il geocoding lo determini in seguito
      if (
        country_code &&
        !europeanCountries.isValidEuropeanCountry(country_code)
      ) {
        return null;
      }

      return {
        name: event.name.replace(/\|/g, "-"),
        city,
        country_code,
        date_start: dates.start,
        date_end: dates.end,
        topics: this.extractTopics(event.name, event.description),
        url: `https://lu.ma/${event.url}`,
        source: "luma",
      };
    } catch (error) {
      console.error("Error mapping event:", error);
      return null;
    }
  }

  private deduplicateHackathons(
    hackathons: ParsedHackathon[],
  ): ParsedHackathon[] {
    const seen = new Set<string>();
    return hackathons.filter((hackathon) => {
      const key = `${hackathon.name}-${hackathon.date_start.toISOString()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
