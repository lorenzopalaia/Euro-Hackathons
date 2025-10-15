import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Code,
  Database,
  Bot,
  Search,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { FaDiscord, FaTelegram, FaXTwitter, FaGithub } from "react-icons/fa6";

export const metadata = {
  title: "Documentation - Euro Hackathons",
  description: "Complete documentation for Euro Hackathons platform and API",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="mb-0 text-3xl font-bold">Documentation</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Complete guide to using Euro Hackathons platform, API, and services
          </p>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 not-prose mb-8">
            <div className="border rounded-lg p-4">
              <Search className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Browse Hackathons</h3>
              <p className="text-sm text-muted-foreground">
                Discover and filter European hackathons with advanced search
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Code className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">REST API</h3>
              <p className="text-sm text-muted-foreground">
                Access hackathon data programmatically with our API
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <Bot className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified of new hackathons via Discord, Telegram, Twitter
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Search className="h-6 w-6" />
              Getting Started
            </h2>
            <p>
              Euro Hackathons is a comprehensive platform for discovering
              hackathons across Europe. Our system automatically scans and
              aggregates hackathon information, providing you with the most
              up-to-date listings.
            </p>

            <h3 className="mb-2 mt-6 text-xl font-medium">Key Features</h3>
            <ul className="space-y-2">
              <li>
                🔄 <strong>Automated Updates:</strong> New hackathons discovered
                3-4 times daily
              </li>
              <li>
                🔍 <strong>Advanced Filtering:</strong> Search by location,
                topics, dates, and status
              </li>
              <li>
                🤖 <strong>Real-time Notifications:</strong> Discord, Telegram,
                and Twitter bots
              </li>
              <li>
                📊 <strong>RESTful API:</strong> Access data programmatically
              </li>
              <li>
                📱 <strong>Responsive Design:</strong> Works perfectly on all
                devices
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <BookOpen className="h-6 w-6" />
              Internationalization
            </h2>

            <p>
              Euro Hackathons supports multiple interface languages. The main
              application UI loads translations from the <code>i18n/</code>
              directory; documentation pages are currently kept in English.
            </p>

            <h3 className="mb-2 mt-4 text-xl font-medium">
              Available Languages
            </h3>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>English</li>
              <li>Italian</li>
              <li>German</li>
              <li>Spanish</li>
              <li>French</li>
              <li>Dutch</li>
              <li>Portuguese</li>
              <li>Polish</li>
              <li>Romanian</li>
              <li>Swedish</li>
            </ul>

            <p className="mt-4">
              To add or edit translations, update the JSON files in{" "}
              <code>i18n/</code>
              ensuring keys remain consistent across languages. The translation
              context in <code>contexts/translation-context.tsx</code> exposes
              helpers used by the app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Calendar className="h-6 w-6" />
              Using the Platform
            </h2>

            <h3 className="mb-2 mt-4 text-xl font-medium">
              Browsing Hackathons
            </h3>
            <p>
              The main interface displays hackathons in an easy-to-browse card
              format. Each card shows:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                <strong>Event Name:</strong> Full hackathon title
              </li>
              <li>
                <strong>Location:</strong> City and country
              </li>
              <li>
                <strong>Dates:</strong> Start and end dates (if available)
              </li>
              <li>
                <strong>Topics:</strong> Relevant tags (AI, Crypto, Web3, etc.)
              </li>
              <li>
                <strong>Notes:</strong> Additional event details and
                requirements
              </li>
              <li>
                <strong>Registration Link:</strong> Direct link to sign up
              </li>
            </ul>

            <h3 className="mb-2 mt-6 text-xl font-medium">Filtering Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 not-prose">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Search</h4>
                <p className="text-sm text-muted-foreground">
                  Find hackathons by name using the search box
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Status</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle between upcoming and past events
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-muted-foreground">
                  Filter by specific cities or countries
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Topics</h4>
                <p className="text-sm text-muted-foreground">
                  Select multiple topics of interest
                </p>
              </div>
              <div className="border rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold mb-2">Date Range</h4>
                <p className="text-sm text-muted-foreground">
                  Choose specific date ranges for your search
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Code className="h-6 w-6" />
              API Documentation
            </h2>
            <p>
              Our REST API provides programmatic access to hackathon data. The
              API is free to use with reasonable rate limits.
            </p>

            <h3 className="mb-2 mt-6 text-xl font-medium">Base URL</h3>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              https://euro-hackathons.vercel.app/api
            </div>

            <h3 className="mb-2 mt-6 text-xl font-medium">Endpoints</h3>

            <div className="space-y-6 mt-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="bg-green-600">
                    GET
                  </Badge>
                  <code className="text-sm">/hackathons</code>
                </div>
                <p className="text-sm mb-3">
                  Retrieve hackathons with optional filtering
                </p>

                <h4 className="font-semibold mb-2">Query Parameters</h4>
                <ul className="text-sm space-y-1">
                  <li>
                    <code>status</code> - Filter by status (upcoming, past,
                    estimated)
                  </li>
                </ul>

                <h4 className="font-semibold mb-2 mt-4">Example Request</h4>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  GET /api/hackathons?status=upcoming
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Response Format</h4>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  {`{
  "data": [
    {
      "id": "uuid",
      "name": "AI Hackathon Munich",
      "city": "Munich",
      "country_code": "DE",
      "date_start": "2025-06-15T09:00:00+00:00",
      "date_end": "2025-06-16T18:00:00+00:00",
      "topics": ["AI", "Machine Learning"],
      "notes": "Bring your laptop and creativity!",
      "url": "https://example.com/hackathon",
      "status": "upcoming",
      "is_new": true
    },
    ...
  ]
}`}
                </div>
              </div>
            </div>

            <h3 className="mb-2 mt-6 text-xl font-medium">Rate Limiting</h3>
            <p>
              The API implements reasonable rate limiting to ensure fair usage:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                <strong>Free usage:</strong> 100 requests per hour per IP
              </li>
              <li>
                <strong>Burst limit:</strong> 10 requests per minute
              </li>
              <li>
                <strong>Commercial usage:</strong> Contact us for higher limits
              </li>
            </ul>

            <h3 className="mb-2 mt-6 text-xl font-medium">Error Codes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 not-prose">
              <div className="border rounded-lg p-4">
                <Badge variant="destructive" className="mb-2">
                  400
                </Badge>
                <h4 className="font-semibold mb-1">Bad Request</h4>
                <p className="text-sm text-muted-foreground">
                  Invalid query parameters
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <Badge variant="destructive" className="mb-2">
                  429
                </Badge>
                <h4 className="font-semibold mb-1">Too Many Requests</h4>
                <p className="text-sm text-muted-foreground">
                  Rate limit exceeded
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <Badge variant="destructive" className="mb-2">
                  500
                </Badge>
                <h4 className="font-semibold mb-1">Internal Server Error</h4>
                <p className="text-sm text-muted-foreground">
                  Server-side error
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <Badge variant="destructive" className="mb-2">
                  503
                </Badge>
                <h4 className="font-semibold mb-1">Service Unavailable</h4>
                <p className="text-sm text-muted-foreground">
                  Temporary maintenance
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Bot className="h-6 w-6" />
              Notification Services
            </h2>
            <p>
              Stay updated with new hackathons through our automated
              notification services. We support multiple platforms to reach you
              wherever you are.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 not-prose">
              <div className="border rounded-lg p-6 text-center flex flex-col">
                <FaDiscord className="h-8 w-8 text-[#5865F2] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Discord Bot</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Join our Discord server for real-time hackathon notifications
                  with rich embeds
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link
                    href="https://discord.com/invite/SmygTckVez"
                    target="_blank"
                  >
                    Join Server <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="border rounded-lg p-6 text-center flex flex-col">
                <FaTelegram className="h-8 w-8 text-[#0088cc] mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Telegram Channel</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Follow our Telegram channel for mobile-friendly notifications
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="https://t.me/eurohackathons" target="_blank">
                    Join Channel <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="border rounded-lg p-6 text-center flex flex-col">
                <FaXTwitter className="h-8 w-8 text-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Twitter Updates</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  Follow us on Twitter for hackathon announcements and updates
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href="https://x.com/eurohackathons" target="_blank">
                    Follow @EuroHackathons{" "}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            <h3 className="mb-2 mt-6 text-xl font-medium">
              Notification Features
            </h3>
            <ul className="space-y-2">
              <li>
                ⚡ <strong>Real-time alerts:</strong> Get notified within
                minutes of discovery
              </li>
              <li>
                📋 <strong>Rich information:</strong> Complete event details in
                notifications
              </li>
              <li>
                🏷️ <strong>Topic filtering:</strong> Discord server supports
                topic-based channels
              </li>
              <li>
                🔗 <strong>Direct links:</strong> One-click access to
                registration pages
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
              <Database className="h-6 w-6" />
              Technical Architecture
            </h2>
            <p>
              Euro Hackathons is built with modern technologies to ensure
              reliability, performance, and scalability.
            </p>

            <h3 className="mb-2 mt-6 text-xl font-medium">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 not-prose">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Frontend</h4>
                <ul className="text-sm space-y-1">
                  <li>Next.js 15 with App Router</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>shadcn/ui components</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Backend</h4>
                <ul className="text-sm space-y-1">
                  <li>Next.js API Routes</li>
                  <li>Supabase (Postgr</li>
                  <li>Row Level Security</li>
                </ul>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Infrastructure</h4>
                <ul className="text-sm space-y-1">
                  <li>Vercel deployment</li>
                  <li>GitHub Actions CI/CD</li>
                  <li>Cron job automation</li>
                  <li>Multiple bot integrations</li>
                </ul>
              </div>
            </div>

            <h3 className="mb-2 mt-6 text-xl font-medium">Update Frequency</h3>
            <p>
              Our automated system runs multiple times daily to ensure fresh
              data:
            </p>
            <ul className="mt-2 space-y-1 list-disc pl-5">
              <li>
                <strong>Weekdays:</strong> 4 times daily
              </li>
              <li>
                <strong>Weekends:</strong> 3 times daily
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contributing</h2>
            <p>
              Euro Hackathons is an open-source project and we welcome
              contributions from the community!
            </p>

            <h3 className="mb-2 mt-6 text-xl font-medium">How to Contribute</h3>
            <ul className="space-y-2">
              <li>
                <strong>Report Issues:</strong> Found a bug or missing
                hackathon?{" "}
                <Link
                  href="https://github.com/lorenzopalaia/Euro-Hackathons/issues"
                  className="text-primary hover:underline"
                >
                  Open an issue
                </Link>
              </li>
              <li>
                <strong>Code Contributions:</strong> Fork the repository and
                submit pull requests
              </li>
              <li>
                <strong>Feature Requests:</strong> Propose new features or
                improvements
              </li>
            </ul>

            <h3 className="mb-2 mt-6 text-xl font-medium">Development Setup</h3>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
              <div># Clone the repository</div>
              <div>
                git clone https://github.com/lorenzopalaia/Euro-Hackathons.git
              </div>
              <div></div>
              <div># Install dependencies</div>
              <div>npm install</div>
              <div></div>
              <div># Set up environment variables</div>
              <div>cp .env.example .env.local</div>
              <div></div>
              <div># Run development server</div>
              <div>npm run dev</div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Support & Community</h2>
            <p>
              Need help or have questions? Here&qpos;s how to get in touch with
              our community:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 not-prose">
              <div className="border rounded-lg p-6">
                <FaGithub className="h-6 w-6 mb-3" />
                <h3 className="font-semibold mb-2">GitHub Issues</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Best for bug reports, feature requests, and technical
                  discussions
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://github.com/lorenzopalaia/Euro-Hackathons/issues"
                    target="_blank"
                  >
                    Open Issue <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="border rounded-lg p-6">
                <FaDiscord className="h-6 w-6 text-[#5865F2] mb-3" />
                <h3 className="font-semibold mb-2">Discord Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Join our community for general discussions and real-time
                  support
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link
                    href="https://discord.com/invite/SmygTckVez"
                    target="_blank"
                  >
                    Join Discord <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">
                  How often is the data updated?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our automated system scans for new hackathons 3-4 times daily.
                  The exact schedule varies between weekdays and weekends to
                  optimize for when new events are typically announced.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">
                  Can I submit a hackathon that&apos;s missing?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Please open an issue on our GitHub repository with the
                  hackathon details, and we&apos;ll add it manually to our
                  database.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Is the API free to use?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, our API is free for reasonable personal and small-scale
                  commercial use. We have rate limits in place to ensure fair
                  usage for everyone.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">
                  How do you determine if a hackathon is &quot;European&quot;?
                </h3>
                <p className="text-sm text-muted-foreground">
                  We filter events based on location data. Events must be
                  physically located in European countries or be explicitly
                  targeted at the European community.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">
                  Can I use this data for my own project?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Our API is designed for this purpose. Please respect our
                  rate limits and consider mentioning Euro Hackathons as your
                  data source.
                </p>
              </div>
            </div>
          </section>

          <div className="border-t pt-6 text-center text-muted-foreground">
            <p>
              For additional questions or support, don&apos;t hesitate to reach
              out through any of our community channels. We&apos;re here to
              help! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
