export interface ParsedHackathon {
  name: string;
  location: string;
  city?: string;
  country_code?: string;
  date_start: Date;
  date_end?: Date;
  topics?: string[];
  notes?: string;
  url: string;
  source: string;
}

export abstract class BaseParser {
  abstract parse(): Promise<ParsedHackathon[]>;

  protected formatDate(
    start_date_str: string,
    end_date_str?: string
  ): { start: Date; end?: Date } {
    try {
      if (start_date_str === "N/A") throw new Error("Invalid start date");

      const start = new Date(start_date_str.replace("Z", "+00:00"));
      const end =
        end_date_str && end_date_str !== "N/A"
          ? new Date(end_date_str.replace("Z", "+00:00"))
          : undefined;

      return { start, end };
    } catch (error) {
      console.error(
        `Error parsing dates: ${start_date_str}, ${end_date_str}`,
        error
      );
      throw new Error(
        `Error parsing dates: ${start_date_str}, ${end_date_str}`
      );
    }
  }
}
