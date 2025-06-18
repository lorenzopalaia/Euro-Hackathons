/**
 * Unified European countries utility with normalization, validation, and emoji flags
 * This replaces both location-normalizer.ts and emoji-flag.ts
 */

export interface EuropeanCountry {
  code: string; // ISO 3166-1 alpha-2 code
  name: string;
  emoji: string;
  aliases: string[];
}

// Complete list of European countries with emoji flags and aliases
export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  {
    code: "AD",
    name: "Andorra",
    emoji: "🇦🇩",
    aliases: ["andorra", "ad", "and"],
  },
  {
    code: "AL",
    name: "Albania",
    emoji: "🇦🇱",
    aliases: ["albania", "shqipëria", "shqiperia", "al", "alb"],
  },
  {
    code: "AT",
    name: "Austria",
    emoji: "🇦🇹",
    aliases: ["austria", "österreich", "osterreich", "at", "aut"],
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    emoji: "🇧🇦",
    aliases: [
      "bosnia",
      "bosnia and herzegovina",
      "bosna i hercegovina",
      "ba",
      "bih",
    ],
  },
  {
    code: "BE",
    name: "Belgium",
    emoji: "🇧🇪",
    aliases: ["belgium", "belgique", "belgië", "be", "bel"],
  },
  {
    code: "BG",
    name: "Bulgaria",
    emoji: "🇧🇬",
    aliases: ["bulgaria", "българия", "bg", "bgr"],
  },
  {
    code: "BY",
    name: "Belarus",
    emoji: "🇧🇾",
    aliases: ["belarus", "беларусь", "belarus", "by", "blr"],
  },
  {
    code: "CH",
    name: "Switzerland",
    emoji: "🇨🇭",
    aliases: ["switzerland", "schweiz", "suisse", "svizzera", "ch", "che"],
  },
  {
    code: "CY",
    name: "Cyprus",
    emoji: "🇨🇾",
    aliases: ["cyprus", "κύπρος", "kypros", "cy", "cyp"],
  },
  {
    code: "CZ",
    name: "Czech Republic",
    emoji: "🇨🇿",
    aliases: [
      "czech republic",
      "czechia",
      "česká republika",
      "ceska republika",
      "cz",
      "cze",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    emoji: "🇩🇪",
    aliases: ["germany", "deutschland", "de", "ger"],
  },
  {
    code: "DK",
    name: "Denmark",
    emoji: "🇩🇰",
    aliases: ["denmark", "danmark", "dk", "dnk"],
  },
  {
    code: "EE",
    name: "Estonia",
    emoji: "🇪🇪",
    aliases: ["estonia", "eesti", "ee", "est"],
  },
  {
    code: "ES",
    name: "Spain",
    emoji: "🇪🇸",
    aliases: ["spain", "españa", "espana", "es", "esp"],
  },
  {
    code: "FI",
    name: "Finland",
    emoji: "🇫🇮",
    aliases: ["finland", "suomi", "fi", "fin"],
  },
  {
    code: "FR",
    name: "France",
    emoji: "🇫🇷",
    aliases: ["france", "fr", "fra"],
  },
  {
    code: "GB",
    name: "UK",
    emoji: "🇬🇧",
    aliases: [
      "uk",
      "united kingdom",
      "england",
      "scotland",
      "wales",
      "northern ireland",
      "britain",
      "great britain",
    ],
  },
  {
    code: "GR",
    name: "Greece",
    emoji: "🇬🇷",
    aliases: ["greece", "ελλάδα", "ellada", "gr", "grc"],
  },
  {
    code: "HR",
    name: "Croatia",
    emoji: "🇭🇷",
    aliases: ["croatia", "hrvatska", "hr", "hrv"],
  },
  {
    code: "HU",
    name: "Hungary",
    emoji: "🇭🇺",
    aliases: ["hungary", "magyarország", "magyarorszag", "hu", "hun"],
  },
  {
    code: "IE",
    name: "Ireland",
    emoji: "🇮🇪",
    aliases: ["ireland", "éire", "eire", "ie", "irl"],
  },
  {
    code: "IS",
    name: "Iceland",
    emoji: "🇮🇸",
    aliases: ["iceland", "ísland", "island", "is", "isl"],
  },
  {
    code: "IT",
    name: "Italy",
    emoji: "🇮🇹",
    aliases: ["italy", "italia", "it", "ita"],
  },
  {
    code: "LI",
    name: "Liechtenstein",
    emoji: "🇱🇮",
    aliases: ["liechtenstein", "li", "lie"],
  },
  {
    code: "LT",
    name: "Lithuania",
    emoji: "🇱🇹",
    aliases: ["lithuania", "lietuva", "lt", "ltu"],
  },
  {
    code: "LU",
    name: "Luxembourg",
    emoji: "🇱🇺",
    aliases: ["luxembourg", "lëtzebuerg", "letzebuerg", "lu", "lux"],
  },
  {
    code: "LV",
    name: "Latvia",
    emoji: "🇱🇻",
    aliases: ["latvia", "latvija", "lv", "lva"],
  },
  {
    code: "MC",
    name: "Monaco",
    emoji: "🇲🇨",
    aliases: ["monaco", "mc", "mco"],
  },
  {
    code: "MD",
    name: "Moldova",
    emoji: "🇲🇩",
    aliases: ["moldova", "md", "mda"],
  },
  {
    code: "ME",
    name: "Montenegro",
    emoji: "🇲🇪",
    aliases: ["montenegro", "crna gora", "me", "mne"],
  },
  {
    code: "MK",
    name: "North Macedonia",
    emoji: "🇲🇰",
    aliases: ["macedonia", "north macedonia", "makedonija", "mk", "mkd"],
  },
  {
    code: "MT",
    name: "Malta",
    emoji: "🇲🇹",
    aliases: ["malta", "mt", "mlt"],
  },
  {
    code: "NL",
    name: "Netherlands",
    emoji: "🇳🇱",
    aliases: ["netherlands", "holland", "nl", "nld", "the netherlands"],
  },
  {
    code: "NO",
    name: "Norway",
    emoji: "🇳🇴",
    aliases: ["norway", "norge", "no", "nor"],
  },
  {
    code: "PL",
    name: "Poland",
    emoji: "🇵🇱",
    aliases: ["poland", "polska", "pl", "pol"],
  },
  {
    code: "PT",
    name: "Portugal",
    emoji: "🇵🇹",
    aliases: ["portugal", "pt", "prt"],
  },
  {
    code: "RO",
    name: "Romania",
    emoji: "🇷🇴",
    aliases: ["romania", "românia", "ro", "rou"],
  },
  {
    code: "RS",
    name: "Serbia",
    emoji: "🇷🇸",
    aliases: ["serbia", "србија", "srbija", "rs", "srb"],
  },
  {
    code: "SE",
    name: "Sweden",
    emoji: "🇸🇪",
    aliases: ["sweden", "sverige", "se", "swe"],
  },
  {
    code: "SI",
    name: "Slovenia",
    emoji: "🇸🇮",
    aliases: ["slovenia", "slovenija", "si", "svn"],
  },
  {
    code: "SK",
    name: "Slovakia",
    emoji: "🇸🇰",
    aliases: ["slovakia", "slovensko", "sk", "svk"],
  },
  {
    code: "SM",
    name: "San Marino",
    emoji: "🇸🇲",
    aliases: ["san marino", "sm", "smr"],
  },
  {
    code: "TR",
    name: "Turkey",
    emoji: "🇹🇷",
    aliases: ["turkey", "türkiye", "turkiye", "tr", "tur"],
  },
  {
    code: "UA",
    name: "Ukraine",
    emoji: "🇺🇦",
    aliases: ["ukraine", "україна", "ukraina", "ua", "ukr"],
  },
  {
    code: "VA",
    name: "Vatican City",
    emoji: "🇻🇦",
    aliases: ["vatican", "vatican city", "va", "vat"],
  },
  {
    code: "XK",
    name: "Kosovo",
    emoji: "🇽🇰",
    aliases: ["kosovo", "xk", "kos"],
  },
];

// City to country mapping for major European cities
export const EUROPEAN_CITY_TO_COUNTRY: Record<string, string> = {
  // UK
  london: "GB",
  manchester: "GB",
  edinburgh: "GB",
  birmingham: "GB",
  glasgow: "GB",
  liverpool: "GB",
  bristol: "GB",
  leeds: "GB",
  sheffield: "GB",
  cardiff: "GB",
  belfast: "GB",

  // Germany
  berlin: "DE",
  munich: "DE",
  hamburg: "DE",
  cologne: "DE",
  frankfurt: "DE",
  stuttgart: "DE",
  düsseldorf: "DE",
  dortmund: "DE",
  essen: "DE",
  leipzig: "DE",
  bremen: "DE",
  dresden: "DE",
  hannover: "DE",
  nuremberg: "DE",

  // France
  paris: "FR",
  lyon: "FR",
  marseille: "FR",
  toulouse: "FR",
  nice: "FR",
  nantes: "FR",
  strasbourg: "FR",
  montpellier: "FR",
  bordeaux: "FR",
  lille: "FR",
  rennes: "FR",
  reims: "FR",

  // Spain
  madrid: "ES",
  barcelona: "ES",
  valencia: "ES",
  seville: "ES",
  zaragoza: "ES",
  málaga: "ES",
  malaga: "ES",
  murcia: "ES",
  palma: "ES",
  bilbao: "ES",
  alicante: "ES",
  córdoba: "ES",
  cordoba: "ES",

  // Italy
  rome: "IT",
  milan: "IT",
  naples: "IT",
  turin: "IT",
  palermo: "IT",
  genoa: "IT",
  bologna: "IT",
  florence: "IT",
  bari: "IT",
  catania: "IT",
  venice: "IT",
  verona: "IT",

  // Netherlands
  amsterdam: "NL",
  rotterdam: "NL",
  utrecht: "NL",
  eindhoven: "NL",
  tilburg: "NL",
  groningen: "NL",
  almere: "NL",
  breda: "NL",
  nijmegen: "NL",

  // Belgium
  brussels: "BE",
  antwerp: "BE",
  ghent: "BE",
  charleroi: "BE",
  liège: "BE",
  liege: "BE",
  bruges: "BE",
  namur: "BE",
  leuven: "BE",

  // Switzerland
  zurich: "CH",
  geneva: "CH",
  basel: "CH",
  lausanne: "CH",
  bern: "CH",
  winterthur: "CH",
  lucerne: "CH",

  // Austria
  vienna: "AT",
  salzburg: "AT",
  innsbruck: "AT",
  graz: "AT",
  linz: "AT",

  // Sweden
  stockholm: "SE",
  gothenburg: "SE",
  malmö: "SE",
  malmo: "SE",
  uppsala: "SE",
  västerås: "SE",
  vasteras: "SE",
  örebro: "SE",
  orebro: "SE",

  // Norway
  oslo: "NO",
  bergen: "NO",
  trondheim: "NO",
  stavanger: "NO",
  drammen: "NO",

  // Denmark
  copenhagen: "DK",
  aarhus: "DK",
  odense: "DK",
  aalborg: "DK",
  esbjerg: "DK",

  // Finland
  helsinki: "FI",
  espoo: "FI",
  tampere: "FI",
  vantaa: "FI",
  turku: "FI",
  oulu: "FI",

  // Poland
  warsaw: "PL",
  krakow: "PL",
  łódź: "PL",
  lodz: "PL",
  wrocław: "PL",
  wroclaw: "PL",
  poznań: "PL",
  poznan: "PL",
  gdańsk: "PL",
  gdansk: "PL",
  szczecin: "PL",
  bydgoszcz: "PL",
  lublin: "PL",
  katowice: "PL",

  // Czech Republic
  prague: "CZ",
  brno: "CZ",
  ostrava: "CZ",
  plzen: "CZ",
  liberec: "CZ",

  // Portugal
  lisbon: "PT",
  porto: "PT",
  amadora: "PT",
  braga: "PT",
  setúbal: "PT",
  setubal: "PT",
  coimbra: "PT",

  // Ireland
  dublin: "IE",
  cork: "IE",
  limerick: "IE",
  galway: "IE",
  waterford: "IE",

  // Greece
  athens: "GR",
  thessaloniki: "GR",
  patras: "GR",
  heraklion: "GR",
  larissa: "GR",

  // Hungary
  budapest: "HU",
  debrecen: "HU",
  szeged: "HU",
  miskolc: "HU",
  pécs: "HU",
  pecs: "HU",

  // Romania
  bucharest: "RO",
  cluj: "RO",
  timișoara: "RO",
  timisoara: "RO",
  iași: "RO",
  iasi: "RO",
  constanța: "RO",
  constanta: "RO",
  craiova: "RO",
  brașov: "RO",
  brasov: "RO",

  // Bulgaria
  sofia: "BG",
  plovdiv: "BG",
  varna: "BG",
  burgas: "BG",
  ruse: "BG",

  // Croatia
  zagreb: "HR",
  split: "HR",
  rijeka: "HR",
  osijek: "HR",
  zadar: "HR",

  // Slovenia
  ljubljana: "SI",
  maribor: "SI",
  celje: "SI",
  kranj: "SI",

  // Slovakia
  bratislava: "SK",
  košice: "SK",
  kosice: "SK",
  prešov: "SK",
  presov: "SK",
  žilina: "SK",
  zilina: "SK",

  // Estonia
  tallinn: "EE",
  tartu: "EE",
  narva: "EE",

  // Latvia
  riga: "LV",
  daugavpils: "LV",
  liepāja: "LV",
  liepaja: "LV",

  // Lithuania
  vilnius: "LT",
  kaunas: "LT",
  klaipėda: "LT",
  klaipeda: "LT",

  // Luxembourg
  luxembourg: "LU",

  // Malta
  valletta: "MT",

  // Cyprus
  nicosia: "CY",
  limassol: "CY",
  larnaca: "CY",

  // Ukraine
  kiev: "UA",
  kyiv: "UA",
  kharkiv: "UA",
  odessa: "UA",
  dnipro: "UA",
  lviv: "UA",

  // Turkey
  istanbul: "TR",
  ankara: "TR",
  izmir: "TR",
  bursa: "TR",
  adana: "TR",
  gaziantep: "TR",

  // Serbia
  belgrade: "RS",
  "novi sad": "RS",
  niš: "RS",
  nis: "RS",

  // Iceland
  reykjavik: "IS",

  // Albania
  tirana: "AL",
  durrës: "AL",
  durres: "AL",

  // Bosnia and Herzegovina
  sarajevo: "BA",
  banja: "BA", // Banja Luka
  tuzla: "BA",
  zenica: "BA",

  // Montenegro
  podgorica: "ME",
  nikšić: "ME",
  niksic: "ME",

  // North Macedonia
  skopje: "MK",
  bitola: "MK",

  // Moldova
  chisinau: "MD",

  // Belarus
  minsk: "BY",
  gomel: "BY",
  vitebsk: "BY",
};

export class EuropeanCountriesUtil {
  private countryMap: Map<string, string>;
  private countryCodeSet: Set<string>;

  constructor() {
    this.countryMap = new Map();
    this.countryCodeSet = new Set();
    this.buildMaps();
  }

  private buildMaps(): void {
    for (const country of EUROPEAN_COUNTRIES) {
      // Add country code to set for validation
      this.countryCodeSet.add(country.code);

      // Add the code itself
      this.countryMap.set(country.code.toLowerCase(), country.code);

      // Add all aliases
      for (const alias of country.aliases) {
        this.countryMap.set(alias.toLowerCase(), country.code);
      }
    }
  }

  /**
   * Normalize a country code or name to ISO 3166-1 alpha-2 code
   * Only returns codes for European countries
   */
  normalizeCountry(input: string | undefined | null): string | undefined {
    if (!input || typeof input !== "string") {
      return undefined;
    }

    const normalized = input.trim().toLowerCase();

    // If it's already a valid 2-letter code, return it
    if (normalized.length === 2 && this.countryMap.has(normalized)) {
      return this.countryMap.get(normalized);
    }

    // Search in aliases
    return this.countryMap.get(normalized);
  }

  /**
   * Normalize a city name - capitalize first letter of each word
   * Preserves Unicode characters (accents, umlauts, etc.)
   */
  normalizeCity(input: string | undefined | null): string | undefined {
    if (!input || typeof input !== "string") {
      return undefined;
    }

    return (
      input
        .trim()
        // Remove only specific problematic characters, preserve Unicode letters
        .replace(/[^\p{L}\p{N}\s\-'.,]/gu, "") // Preserve all Unicode letters and numbers
        .replace(/\s+/g, " ") // Normalize spaces
        .trim()
        .toLowerCase()
        // Use Unicode-aware word boundary for proper capitalization
        .replace(/(?:^|\s)\p{L}/gu, (char) => char.toUpperCase())
    );
  }

  /**
   * Check if a country code is a valid European country
   */
  isValidEuropeanCountry(code: string): boolean {
    return this.countryCodeSet.has(code.toUpperCase());
  }

  /**
   * Get country emoji flag
   */
  getCountryEmoji(code: string, fallback: string = "🏳"): string {
    const country = EUROPEAN_COUNTRIES.find(
      (c) => c.code === code.toUpperCase()
    );
    return country?.emoji || fallback;
  }

  /**
   * Get country name from code
   */
  getCountryName(code: string): string | undefined {
    const country = EUROPEAN_COUNTRIES.find(
      (c) => c.code === code.toUpperCase()
    );
    return country?.name;
  }

  /**
   * Extract location from complex strings like "City, Country" or "City, State, Country"
   */
  parseLocationString(locationString: string): {
    city?: string;
    country_code?: string;
  } {
    if (!locationString) {
      return {};
    }

    const parts = locationString.split(",").map((part) => part.trim());

    if (parts.length === 0) {
      return {};
    }

    // If there's only one part, try to determine if it's a city or country
    if (parts.length === 1) {
      const normalized = this.normalizeCountry(parts[0]);
      if (normalized) {
        return { country_code: normalized };
      } else {
        return { city: this.normalizeCity(parts[0]) };
      }
    }

    // If there are two parts: "City, Country"
    if (parts.length === 2) {
      const [cityPart, countryPart] = parts;
      return {
        city: this.normalizeCity(cityPart),
        country_code: this.normalizeCountry(countryPart),
      };
    }

    // If there are three or more parts: "City, State, Country" - take first and last
    if (parts.length >= 3) {
      const cityPart = parts[0];
      const countryPart = parts[parts.length - 1];
      return {
        city: this.normalizeCity(cityPart),
        country_code: this.normalizeCountry(countryPart),
      };
    }

    return {};
  }

  /**
   * Try to infer country from city name using known city mappings
   */
  inferCountryFromCity(city: string): string | undefined {
    const normalizedCity = city.toLowerCase();
    return EUROPEAN_CITY_TO_COUNTRY[normalizedCity];
  }

  /**
   * Format location for display
   */
  formatLocation(
    city?: string | null,
    country_code?: string | null
  ): string | undefined {
    const parts: string[] = [];

    if (city) {
      parts.push(city);
    }

    if (country_code) {
      const countryName = this.getCountryName(country_code);
      if (countryName) {
        parts.push(countryName);
      } else {
        parts.push(country_code);
      }
    }

    return parts.length > 0 ? parts.join(", ") : undefined;
  }

  /**
   * Get all European country codes
   */
  getAllCountryCodes(): string[] {
    return EUROPEAN_COUNTRIES.map((country) => country.code);
  }

  /**
   * Get all European countries with their info
   */
  getAllCountries(): EuropeanCountry[] {
    return [...EUROPEAN_COUNTRIES];
  }
}

// Singleton instance for common use
export const europeanCountries = new EuropeanCountriesUtil();

// Legacy compatibility functions
export function emojiFlag(
  countryCode: string,
  fallback: string = "🏳"
): string {
  return europeanCountries.getCountryEmoji(countryCode, fallback);
}
