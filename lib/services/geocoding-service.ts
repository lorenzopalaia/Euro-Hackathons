import { europeanCountries } from "@/lib/european-countries";

interface GeocodingResponse {
  success: boolean;
  message: string;
  error: string | null;
  element: {
    providedBy: string;
    latitude: number;
    longitude: number;
    bounds: {
      south: number;
      west: number;
      north: number;
      east: number;
    };
    streetNumber: string | null;
    streetName: string | null;
    postalCode: string;
    locality: string;
    subLocality: string | null;
    adminLevels: {
      [key: string]: {
        name: string;
        code: string | null;
        level: number;
      };
    };
    country: string;
    countryCode: string;
    timezone: string | null;
    id: string;
  };
}

export class GeocodingService {
  private static readonly API_URL = "https://geocoding.openapi.it/geocode";

  /**
   * Ottiene il country code da una città usando l'API di geocoding
   * @param city Nome della città
   * @returns Country code ISO 2 lettere o null se non trovato/errore
   */
  static async getCountryCodeFromCity(city: string): Promise<string | null> {
    try {
      const apiKey = process.env.OPENAPI_GEOCODING_KEY;
      if (!apiKey) {
        console.warn(
          "OPENAPI_GEOCODING_KEY not configured. Skipping geocoding.",
        );
        return null;
      }

      console.log(`Geocoding API request for: ${city}`);

      const address = city.trim();

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        console.error(`Authentication failed for city: ${city}`);
        return null;
      }

      const data: GeocodingResponse = await response.json();

      // Controlla la struttura della risposta
      if (!data || !data.element) {
        console.warn(`Invalid geocoding response structure for city: ${city}`);
        return null;
      }

      const countryCode = data.element.countryCode;

      if (!countryCode) {
        console.warn(
          `No country code found in geocoding response for city: ${city}`,
        );
        return null;
      }

      // Normalizza il country code usando il nostro sistema
      const normalizedCountryCode =
        europeanCountries.normalizeCountry(countryCode);

      if (!normalizedCountryCode) {
        console.warn(
          `Could not normalize country code ${countryCode} for city: ${city}`,
        );
        return countryCode;
      }

      // Verifica che sia un paese europeo
      if (!europeanCountries.isValidEuropeanCountry(normalizedCountryCode)) {
        console.log(
          `City ${city} is not in Europe (${normalizedCountryCode}). Filtering out.`,
        );
        return null;
      }

      console.log(`Geocoding success: ${city} -> ${normalizedCountryCode}`);

      return normalizedCountryCode;
    } catch (error) {
      console.error(`Error geocoding city ${city}:`, error);
      return null;
    }
  }
}
