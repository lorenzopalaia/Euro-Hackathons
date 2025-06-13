import { supabase } from "@/lib/supabase";
import { Hackathon } from "@/types/hackathon";
import { MarkdownFormatter } from "@/lib/markdown-formatter";
import { europeanCountries } from "@/lib/european-countries";
import fs from "fs";
import path from "path";

export class ReadmeUpdater {
  /**
   * Genera il contenuto completo del README
   */
  async generateReadmeContent(): Promise<string> {
    try {
      // Ottieni i dati dal database
      const { upcoming, past } = await this.fetchData();

      // Genera le tabelle complete con header
      const upcomingTableContent =
        upcoming.length > 0
          ? `| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
${this.generateHackathonTable(upcoming)}`
          : `| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |`;

      const pastTableContent =
        past.length > 0
          ? `| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
${this.generateHackathonTable(past.slice(0, 20))}`
          : `| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |`;

      // Leggi il template dal README.md esistente
      const template = await this.getTemplateFromReadme();

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
        .replace(
          /<!-- UPCOMING_TABLE_START -->[\s\S]*?<!-- UPCOMING_TABLE_END -->/,
          `<!-- UPCOMING_TABLE_START -->

${upcomingTableContent}

<!-- UPCOMING_TABLE_END -->`
        )
        .replace(
          /<!-- PAST_TABLE_START -->[\s\S]*?<!-- PAST_TABLE_END -->/,
          `<!-- PAST_TABLE_START -->

${pastTableContent}

<!-- PAST_TABLE_END -->`
        );

      const formattedContent =
        await MarkdownFormatter.formatMarkdown(updatedContent);

      return formattedContent;
    } catch (error) {
      console.error("Error generating README content:", error);
      throw error;
    }
  }

  /**
   * Legge il README.md esistente e crea un template pulito
   */
  private async getTemplateFromReadme(): Promise<string> {
    const readmePath = path.join(process.cwd(), "README.md");
    const readmeContent = fs.readFileSync(readmePath, "utf-8");

    // Pulisci le tabelle esistenti mantenendo solo l'header e i delimitatori
    const template = readmeContent
      .replace(
        /<!-- UPCOMING_TABLE_START -->[\s\S]*?<!-- UPCOMING_TABLE_END -->/,
        `<!-- UPCOMING_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{UPCOMING_PLACEHOLDER}

<!-- UPCOMING_TABLE_END -->`
      )
      .replace(
        /<!-- PAST_TABLE_START -->[\s\S]*?<!-- PAST_TABLE_END -->/,
        `<!-- PAST_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{PAST_PLACEHOLDER}

<!-- PAST_TABLE_END -->`
      )
      // Sostituisci i valori hardcoded con placeholder dinamici
      .replace(/_Last updated: [^_]*_/, "_Last updated: {LAST_UPDATE_DATE}_");

    console.log("Template created from existing README.md");
    return template;
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

    return {
      upcoming: upcoming || [],
      past: past || [],
    };
  }

  private generateHackathonTable(hackathons: Hackathon[]): string {
    if (hackathons.length === 0) {
      return "*No hackathons found*";
    }

    return hackathons
      .map((hackathon) => {
        const name = hackathon.name.replace(/\|/g, "\\|");
        const location = (
          europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code
          ) || "TBD"
        ).replace(/\|/g, "\\|");
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
