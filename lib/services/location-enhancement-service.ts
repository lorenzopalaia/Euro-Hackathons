import { GeocodingService } from "./geocoding-service";
import { europeanCountries } from "@/lib/european-countries";
import type { ParsedHackathon } from "@/lib/parsers/base-parser";
import type { SupabaseClient } from "@supabase/supabase-js";

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
    const enhancedHackathons: ParsedHackathon[] = [];

    for (const hackathon of hackathons) {
      // Applica geocoding solo se:
      // 1. L'hackathon non esiste già nel database (URL non presente)
      // 2. Ha una città ma non un country code
      // 3. Non abbiamo superato il limite API
      const shouldGeocode =
        !existingUrls.has(hackathon.url) &&
        hackathon.city &&
        !hackathon.country_code;

      if (shouldGeocode) {
        try {
          const geocodedCountry = await GeocodingService.getCountryCodeFromCity(
            hackathon.city!,
          );

          if (geocodedCountry) {
            // Verifica che sia europeo (dovrebbe già essere filtrato dal service, ma double check)
            if (europeanCountries.isValidEuropeanCountry(geocodedCountry)) {
              const enhancedHackathon = {
                ...hackathon,
                country_code: geocodedCountry,
              };
              enhancedHackathons.push(enhancedHackathon);
              console.log(
                `Enhanced location: ${hackathon.city} -> ${geocodedCountry}`,
              );
            } else {
              // Se il geocoding rivela che non è europeo, skippiamo l'hackathon
              console.log(
                `Skipping non-European hackathon: ${hackathon.city} -> ${geocodedCountry}`,
              );
              continue;
            }
          } else {
            // Se non riusciamo a geocodificare, includiamo comunque l'hackathon
            enhancedHackathons.push(hackathon);
          }
        } catch (error) {
          console.error(
            `Error enhancing location for ${hackathon.name}:`,
            error,
          );
          // In caso di errore, continuiamo senza country code
          enhancedHackathons.push(hackathon);
        }
      } else {
        // Se non dobbiamo fare geocoding, includiamo l'hackathon come è
        enhancedHackathons.push(hackathon);
      }
    }

    return enhancedHackathons;
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
