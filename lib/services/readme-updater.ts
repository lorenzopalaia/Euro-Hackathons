import { supabase } from "@/lib/supabase";
import { Hackathon } from "@/types/hackathon";
import { MarkdownFormatter } from "../markdown-formatter";
import fs from "fs";
import path from "path";

export class ReadmeUpdater {
  /**
   * Genera il contenuto completo del README
   */
  async generateReadmeContent(): Promise<string> {
    try {
      // Ottieni i dati dal database
      const { upcoming, past, stats } = await this.fetchData();

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

      // 🎯 LEGGI IL TEMPLATE DAL README.md ESISTENTE
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
          }),
        )
        .replace("{TOTAL_HACKATHONS}", stats.total.toString())
        .replace("{COUNTRIES_COUNT}", stats.countries.toString())
        .replace("{SOURCES_COUNT}", stats.sources.toString())
        .replace("{NOTIFICATIONS_SENT}", stats.notifications.toString())
        .replace("{LAST_SYSTEM_UPDATE}", new Date().toISOString())
        .replace(
          /<!-- UPCOMING_TABLE_START -->[\s\S]*?<!-- UPCOMING_TABLE_END -->/,
          `<!-- UPCOMING_TABLE_START -->

${upcomingTableContent}

<!-- UPCOMING_TABLE_END -->`,
        )
        .replace(
          /<!-- PAST_TABLE_START -->[\s\S]*?<!-- PAST_TABLE_END -->/,
          `<!-- PAST_TABLE_START -->

${pastTableContent}

<!-- PAST_TABLE_END -->`,
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
    try {
      const readmePath = path.join(process.cwd(), "README.md");

      // Verifica se il file esiste
      if (!fs.existsSync(readmePath)) {
        console.warn("README.md not found, using fallback template");
        return this.getFallbackTemplate();
      }

      const readmeContent = fs.readFileSync(readmePath, "utf-8");

      // Pulisci le tabelle esistenti mantenendo solo l'header e i delimitatori
      const template = readmeContent
        .replace(
          /<!-- UPCOMING_TABLE_START -->[\s\S]*?<!-- UPCOMING_TABLE_END -->/,
          `<!-- UPCOMING_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{UPCOMING_PLACEHOLDER}

<!-- UPCOMING_TABLE_END -->`,
        )
        .replace(
          /<!-- PAST_TABLE_START -->[\s\S]*?<!-- PAST_TABLE_END -->/,
          `<!-- PAST_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{PAST_PLACEHOLDER}

<!-- PAST_TABLE_END -->`,
        )
        // Sostituisci i valori hardcoded con placeholder dinamici
        .replace(/_Last updated: [^_]*_/, "_Last updated: {LAST_UPDATE_DATE}_")
        .replace(
          /- 📊 \*\*\d+\+?\*\* hackathons discovered and tracked/,
          "- 📊 **{TOTAL_HACKATHONS}+** hackathons discovered and tracked",
        )
        .replace(
          /- 🌍 \*\*\d+\*\* European countries covered/,
          "- 🌍 **{COUNTRIES_COUNT}** European countries covered",
        )
        .replace(
          /- 🔄 \*\*\d+\*\* different data sources monitored/,
          "- 🔄 **{SOURCES_COUNT}** different data sources monitored",
        )
        .replace(
          /- 🤖 \*\*\d+\+?\*\* notifications sent across all platforms/,
          "- 🤖 **{NOTIFICATIONS_SENT}+** notifications sent across all platforms",
        )
        .replace(
          /_Last system update: [^_]*_/,
          "_Last system update: {LAST_SYSTEM_UPDATE}_",
        );

      console.log("Template created from existing README.md");
      return template;
    } catch (error) {
      console.error("Error reading README.md:", error);
      console.log("Falling back to hardcoded template");
      return this.getFallbackTemplate();
    }
  }

  /**
   * Template di fallback in caso il README.md non sia leggibile
   */
  private getFallbackTemplate(): string {
    return `![Hackathon Logo](https://user-images.githubusercontent.com/36594527/117592199-10730800-b17b-11eb-84f8-4ffcae8116d4.png)

# <p align="center">🇪🇺🚀 EURO HACKATHONS</p>

Welcome to **EURO HACKATHONS**! This repository provides a comprehensive, **automatically updated** list of hackathons happening across Europe.

Whether you're a seasoned hacker or a beginner looking for your first hackathon, you'll find all the information you need here! 🎉

---

## 🗺️ Current Hackathons

> **Note**: This README is automatically updated every 2 hours. For the most current data and better browsing experience, visit our [live website](https://euro-hackathons.vercel.app).

### 🟢 Upcoming Hackathons

_Last updated: {LAST_UPDATE_DATE}_

<!-- UPCOMING_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{UPCOMING_PLACEHOLDER}

<!-- UPCOMING_TABLE_END -->

### 🔴 Recent Past Hackathons

_Showing last 20 events_

<!-- PAST_TABLE_START -->

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
{PAST_PLACEHOLDER}

<!-- PAST_TABLE_END -->

## 📈 Statistics

Our system tracks:

- 📊 **{TOTAL_HACKATHONS}+** hackathons discovered and tracked
- 🌍 **{COUNTRIES_COUNT}** European countries covered
- 🔄 **{SOURCES_COUNT}** different data sources monitored
- 🤖 **{NOTIFICATIONS_SENT}+** notifications sent across all platforms

---

  <div align="center">

**Made with ❤️ for the European hacking community**

_Last system update: {LAST_SYSTEM_UPDATE}_

  </div>`;
  }

  // ...rest of the methods remain the same...
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
      countriesData?.map((h) => h.country_code).filter(Boolean) || [],
    ).size;

    const { data: sourcesData } = await supabase
      .from("hackathons")
      .select("source");

    const uniqueSources = new Set(
      sourcesData?.map((h) => h.source).filter(Boolean) || [],
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
      formatOptions,
    )} - ${end.toLocaleDateString("en-GB", formatOptions)}`;
  }
}
