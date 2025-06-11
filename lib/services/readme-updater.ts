import { supabase } from "@/lib/supabase";
import { Hackathon } from "@/types/hackathon";
import { promises as fs } from "fs";
import { join } from "path";

export class ReadmeUpdater {
  private readmePath: string;

  constructor() {
    this.readmePath = join(process.cwd(), "README.md");
  }

  async updateReadme(): Promise<void> {
    try {
      // Leggi il template del README
      const template = await this.getReadmeTemplate();

      // Ottieni i dati dal database
      const { upcoming, past, stats } = await this.fetchData();

      // Genera le tabelle
      const upcomingTable = this.generateHackathonTable(upcoming);
      const pastTable = this.generateHackathonTable(past.slice(0, 20)); // Solo ultimi 20

      // Sostituisci i placeholder
      const updatedContent = template
        .replace(
          "{LAST_UPDATE_DATE}",
          new Date().toLocaleString("en-GB", {
            timeZone: "Europe/London",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        )
        .replace("{TOTAL_HACKATHONS}", stats.total.toString())
        .replace("{COUNTRIES_COUNT}", stats.countries.toString())
        .replace("{SOURCES_COUNT}", stats.sources.toString())
        .replace("{NOTIFICATIONS_SENT}", stats.notifications.toString())
        .replace("{LAST_SYSTEM_UPDATE}", new Date().toISOString())
        .replace("<!-- UPCOMING_HACKATHONS_PLACEHOLDER -->", upcomingTable)
        .replace("<!-- PAST_HACKATHONS_PLACEHOLDER -->", pastTable);

      // Scrivi il file aggiornato
      await fs.writeFile(this.readmePath, updatedContent, "utf-8");

      console.log("README.md updated successfully");
    } catch (error) {
      console.error("Error updating README:", error);
      throw error;
    }
  }

  private async getReadmeTemplate(): Promise<string> {
    // Se esiste un template, usalo, altrimenti usa il README corrente
    try {
      return await fs.readFile(
        join(process.cwd(), "README.template.md"),
        "utf-8"
      );
    } catch {
      return await fs.readFile(this.readmePath, "utf-8");
    }
  }

  private async fetchData() {
    // Ottieni hackathons upcoming
    const { data: upcoming } = await supabase
      .from("hackathons")
      .select("*")
      .eq("status", "upcoming")
      .order("date_start", { ascending: true });

    // Ottieni hackathons passati
    const { data: past } = await supabase
      .from("hackathons")
      .select("*")
      .eq("status", "past")
      .order("date_start", { ascending: false })
      .limit(50);

    // Calcola statistiche
    const { count: totalCount } = await supabase
      .from("hackathons")
      .select("*", { count: "exact", head: true });

    const { data: countriesData } = await supabase
      .from("hackathons")
      .select("country_code")
      .not("country_code", "is", null);

    const uniqueCountries = new Set(
      countriesData?.map((h) => h.country_code).filter(Boolean) || []
    ).size;

    const { data: sourcesData } = await supabase
      .from("hackathons")
      .select("source");

    const uniqueSources = new Set(
      sourcesData?.map((h) => h.source).filter(Boolean) || []
    ).size;

    const stats = {
      total: totalCount || 0,
      countries: uniqueCountries,
      sources: uniqueSources,
      notifications: (totalCount || 0) * 3, // Stima basata su 3 piattaforme
    };

    return {
      upcoming: upcoming || [],
      past: past || [],
      stats,
    };
  }

  private generateHackathonTable(hackathons: Hackathon[]): string {
    if (hackathons.length === 0) {
      return "*No hackathons found*";
    }

    return hackathons
      .map((hackathon) => {
        const name = hackathon.name.replace(/\|/g, "\\|");
        const location = hackathon.location.replace(/\|/g, "\\|");
        const date = this.formatDate(hackathon);
        const topics = hackathon.topics?.join(", ") || "";
        const url = `[Link](${hackathon.url})`;

        return `| ${name} | ${location} | ${date} | ${topics} | ${url} |`;
      })
      .join("\n");
  }

  private formatDate(hackathon: Hackathon): string {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-GB", formatOptions);
    }

    if (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth()
    ) {
      return `${start.toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      })}-${end.getDate()}, ${start.getFullYear()}`;
    }

    return `${start.toLocaleDateString(
      "en-GB",
      formatOptions
    )} - ${end.toLocaleDateString("en-GB", formatOptions)}`;
  }
}
