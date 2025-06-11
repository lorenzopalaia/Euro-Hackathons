![Hackathon Logo](https://user-images.githubusercontent.com/36594527/117592199-10730800-b17b-11eb-84f8-4ffcae8116d4.png)

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

```bash
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
```

---

## 🗺️ Current Hackathons

> **Note**: This README is automatically updated every 2 hours. For the most current data and better browsing experience, visit our [live website](https://euro-hackathons.vercel.app).

### 🟢 Upcoming Hackathons

<!-- UPCOMING_TABLE_START -->
| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
| Hackathon 1 | Location 1 | Date 1 | Topics 1 | Link 1 |
| Hackathon 2 | Location 2 | Date 2 | Topics 2 | Link 2 |
<!-- UPCOMING_TABLE_END -->

### 🔴 Recent Past Hackathons

<!-- PAST_TABLE_START -->
| Hackathon Name | Location | Date | Topics | URL |
| -------------- | -------- | ---- | ------ | --- |
| Hackathon 1 | Location 1 | Date 1 | Topics 1 | Link 1 |
| Hackathon 2 | Location 2 | Date 2 | Topics 2 | Link 2 |
<!-- PAST_TABLE_END -->

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

- 📊 **33+** hackathons discovered and tracked
- 🌍 **11** European countries covered
- 🔄 **4** different data sources monitored
- 🤖 **99+** notifications sent across all platforms

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

_Last system update: 2025-06-11T16:03:25.862Z_

</div>