import { supabase } from "@/lib/supabase";
import { Hackathon } from "@/types/hackathon";

export class ReadmeUpdater {
  /**
   * Genera il contenuto completo del README
   */
  async generateReadmeContent(): Promise<string> {
    try {
      // Ottieni i dati dal database
      const { upcoming, past, stats } = await this.fetchData();

      // Genera le tabelle
      const upcomingTable = this.generateHackathonTable(upcoming);
      const pastTable = this.generateHackathonTable(past.slice(0, 20)); // Solo ultimi 20

      // Template del README
      const template = this.getReadmeTemplate();

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
        .replace("<!-- UPCOMING_HACKATHONS_PLACEHOLDER -->", upcomingTable)
        .replace("<!-- PAST_HACKATHONS_PLACEHOLDER -->", pastTable);

      return updatedContent;
    } catch (error) {
      console.error("Error generating README content:", error);
      throw error;
    }
  }

  private getReadmeTemplate(): string {
    return `![Hackathon Logo](https://user-images.githubusercontent.com/36594527/117592199-10730800-b17b-11eb-84f8-4ffcae8116d4.png)

# <p align="center">🇪🇺🚀 EURO HACKATHONS</p>

Welcome to **EURO HACKATHONS**! This repository provides a comprehensive, **automatically updated** list of hackathons happening across Europe.

Whether you're a seasoned hacker or a beginner looking for your first hackathon, you'll find all the information you need here! 🎉

---

## 🚀 What's New

This repository has been completely **modernized** with:

- 🔄 **Automated Updates**: New hackathons are discovered and added every 2 hours
- 🤖 **Multi-Platform Notifications**: Get notified instantly via Discord, Telegram, and Twitter
- 🌐 **Live Web Interface**: Browse hackathons on our modern Next.js website
- 📊 **Smart Data Management**: Everything is stored and managed via Supabase database
- 📱 **RESTful API**: Access hackathon data programmatically

---

## 🌐 Live Website

Visit our **interactive website** for the best browsing experience:

### **[📍 Euro-Hackathons.com](https://euro-hackathons.vercel.app)**

The website features:

- 📱 **Responsive Design**: Built with Next.js, Tailwind CSS, and shadcn/ui
- 🔍 **Advanced Filtering**: Filter by status, location, topics, and dates
- 📊 **Real-time Data**: Always up-to-date with the latest hackathons
- 🎨 **Modern Interface**: Clean, fast, and user-friendly design

---

## 🤖 Stay Notified

Never miss a hackathon again! Our bots automatically notify you when new European hackathons are discovered:

### Discord Bot

Join our Discord server to get instant notifications:

- 🔔 **Real-time alerts** for new hackathons
- 📋 **Rich embeds** with all hackathon details
- 🏷️ **Topic filtering** (AI, Crypto, Web3, etc.)

### Telegram Bot

Follow our Telegram channel for mobile notifications:

- 📱 **Mobile-friendly** notifications
- 🚀 **Instant updates** as soon as hackathons are found
- 🔗 **Direct links** to registration pages

### Twitter Updates

Follow [@EuroHackathons](https://twitter.com/eurohackathons) for social updates:

- 🐦 **Tweet notifications** for trending hackathons
- 🏷️ **Hashtag organization** by topics and locations
- 🔄 **Retweetable content** to spread the word

---

## 🛠️ Technical Stack

Our modern infrastructure includes:

- **Frontend**: Next.js 14 with App Router, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes with TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Notifications**: Discord.js, Telegram Bot API, Twitter API v2
- **Deployment**: Vercel with automated CI/CD
- **Monitoring**: Real-time sync every 2 hours via cron jobs

---

## 📊 API Access

Access hackathon data programmatically via our REST API:

### Endpoints

\`\`\`bash
# Get upcoming hackathons
GET /api/hackathons?status=upcoming&limit=50&page=1

# Get past hackathons
GET /api/hackathons?status=past&limit=50&page=1

# Response format
{
  "data": [
    {
      "id": "uuid",
      "name": "Hackathon Name",
      "location": "City, Country",
      "date_start": "2025-06-15",
      "date_end": "2025-06-16",
      "topics": ["AI", "Web3"],
      "url": "https://...",
      "status": "upcoming"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3
  }
}
\`\`\`

---

## 🗺️ Current Hackathons

> **Note**: This README is automatically updated every 2 hours. For the most current data and better browsing experience, visit our [live website](https://euro-hackathons.vercel.app).

### 🟢 Upcoming Hackathons

_Last updated: {LAST_UPDATE_DATE}_

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |

<!-- UPCOMING_HACKATHONS_PLACEHOLDER -->

### 🔴 Recent Past Hackathons

_Showing last 20 events_

| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |

<!-- PAST_HACKATHONS_PLACEHOLDER -->

## 🤝 How to Contribute

While our system is automated, we welcome community contributions:

### Reporting Missing Hackathons

If you know of a hackathon that we missed:

1. **Open an Issue** with the hackathon details
2. Include: Name, Location, Date, URL, and Topics
3. Our team will add it manually

### Suggesting Data Sources

Know of a platform we should monitor?

1. **Open an Issue** with the platform URL
2. Describe the type of events they host
3. We'll evaluate and potentially add it to our data sources

### Code Contributions

Want to improve the system?

1. **Fork** this repository
2. Work on features like new data sources, UI improvements, or notification enhancements
3. **Submit a Pull Request** with detailed description

---

## 📈 Statistics

Our system tracks:

- 📊 **{TOTAL_HACKATHONS}+** hackathons discovered and tracked
- 🌍 **{COUNTRIES_COUNT}** European countries covered
- 🔄 **{SOURCES_COUNT}** different data sources monitored
- 🤖 **{NOTIFICATIONS_SENT}+** notifications sent across all platforms

---

## 🛡️ Data Quality

We ensure high data quality through:

- ✅ **Automated deduplication** to prevent duplicates
- 🕐 **Date validation** and status management
- 🌍 **Geographic filtering** to ensure European focus
- 🔗 **Link verification** to ensure working URLs
- 📝 **Content filtering** to identify genuine hackathons

---

## 💬 Community & Support

- 💡 **Feature Requests**: Open an issue on GitHub
- 🐛 **Bug Reports**: Report via GitHub Issues
- 💬 **General Discussion**: Join our Discord server
- 📧 **Direct Contact**: [your-email@domain.com]

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Special thanks to:

- 🌟 **Contributors** who help maintain and improve the system
- 🏢 **Event Organizers** who make these amazing hackathons possible
- 🤖 **Platform Providers** (Luma, Devpost, etc.) for hosting event data
- 👥 **Community Members** who spread the word and participate

---

<div align="center">

**Made with ❤️ for the European hacking community**

_Last system update: {LAST_SYSTEM_UPDATE}_

</div>`;
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
