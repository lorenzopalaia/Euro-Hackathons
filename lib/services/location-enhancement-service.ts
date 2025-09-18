import { GeocodingService } from "./geocoding-service";
import { europeanCountries } from "@/lib/european-countries";
import type { ParsedHackathon } from "@/lib/parsers/base-parser";
import type { SupabaseClient } from "@supabase/supabase-js";
import pLimit from "p-limit";

/**
 * Servizio per migliorare i dati di location degli hackathon
 * usando il geocoding quando necessario
 */
export class LocationEnhancementService {
  /**
   * Applica il geocoding a hackathon che hanno città ma non country code
   * Solo se l'hackathon sarà effettivamente inserito nel database
   * @param hackathons Lista di hackathon parsed
   * @param existingUrls URLs già presenti nel database per evitare geocoding inutile
   * @returns Lista di hackathon con location enhanced
   */
  static async enhanceLocations(
    hackathons: ParsedHackathon[],
    existingUrls: Set<string>,
  ): Promise<ParsedHackathon[]> {
    console.log(
      `Starting location enhancement for ${hackathons.length} hackathons...`,
    );

    // Limit concurrent geocoding requests to avoid API rate limits
    const limit = pLimit(3);

    // Process hackathons in parallel with concurrency limit
    const enhancedResults = await Promise.all(
      hackathons.map((hackathon) =>
        limit(async () => {
          // Applica geocoding solo se:
          // 1. L'hackathon non esiste già nel database (URL non presente)
          // 2. Ha una città ma non un country code
          const shouldGeocode =
            !existingUrls.has(hackathon.url) &&
            hackathon.city &&
            !hackathon.country_code;

          if (shouldGeocode) {
            try {
              const geocodedCountry =
                await GeocodingService.getCountryCodeFromCity(hackathon.city!);

              if (geocodedCountry && geocodedCountry !== "NON_EU") {
                // Verifica che sia europeo (dovrebbe già essere filtrato dal service, ma double check)
                if (europeanCountries.isValidEuropeanCountry(geocodedCountry)) {
                  const enhancedHackathon = {
                    ...hackathon,
                    country_code: geocodedCountry,
                  };
                  console.log(
                    `Enhanced location: ${hackathon.city} -> ${geocodedCountry}`,
                  );
                  return enhancedHackathon;
                } else {
                  // Se il geocoding rivela che non è europeo, skippiamo l'hackathon
                  console.log(
                    `Skipping non-European hackathon: ${hackathon.city} -> ${geocodedCountry}`,
                  );
                  return null;
                }
              } else if (geocodedCountry === "NON_EU") {
                // Risultato cached che indica non-europeo
                console.log(
                  `Skipping cached non-European hackathon: ${hackathon.city}`,
                );
                return null;
              } else {
                // Se non riusciamo a geocodificare, includiamo comunque l'hackathon
                console.log(
                  `Could not geocode ${hackathon.city}, including anyway`,
                );
                return hackathon;
              }
            } catch (error) {
              console.error(
                `Error enhancing location for ${hackathon.city}:`,
                error,
              );
              // Include hackathon anyway in case of errors
              return hackathon;
            }
          } else {
            // Non serve geocoding, include l'hackathon così com'è
            return hackathon;
          }
        }),
      ),
    );

    // Filter out null results (non-European hackathons)
    const validHackathons = enhancedResults.filter(
      (h) => h !== null,
    ) as ParsedHackathon[];

    console.log(
      `Location enhancement completed: ${validHackathons.length}/${hackathons.length} hackathons kept`,
    );
    return validHackathons;
  }

  /**
   * Ottiene tutti gli URL esistenti nel database per evitare geocoding inutile
   */
  static async getExistingUrls(
    supabaseClient: SupabaseClient,
  ): Promise<Set<string>> {
    try {
      const { data: existing, error } = await supabaseClient
        .from("hackathons")
        .select("url");

      if (error) {
        console.error("Error fetching existing URLs:", error);
        return new Set();
      }

      return new Set(existing?.map((h: { url: string }) => h.url) || []);
    } catch (error) {
      console.error("Error fetching existing URLs:", error);
      return new Set();
    }
  }
}
