/**
 * Test per verificare la normalizzazione Unicode delle città
 */

import { europeanCountries } from "@/lib/european-countries";

export function testUnicodeCityNormalization() {
  console.log("🧪 Testing Unicode city normalization...\n");

  const testCities = [
    "Zürich",
    "München",
    "Málaga",
    "São Paulo",
    "København",
    "Göteborg",
    "Łódź",
    "Bürgenstock",
    "Düsseldorf",
    "Kraków",
    "Lisabôa",
    "Vilnius",
    "Brașov",
    "Nicosia",
    "regular city",
    "LONDON",
    "new york",
    "saint-étienne",
    "san josé",
  ];

  const results: { input: string; output: string | undefined }[] = [];

  testCities.forEach((city) => {
    const normalized = europeanCountries.normalizeCity(city);
    results.push({ input: city, output: normalized });
    console.log(`"${city}" → "${normalized}"`);
  });

  console.log("\n✅ Unicode city normalization test completed");
  return results;
}
