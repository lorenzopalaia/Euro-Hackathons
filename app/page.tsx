import { Metadata } from "next";
import HackathonList from "@/components/hackathon-list";
import Link from "next/link";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "🇪🇺🚀 Euro Hackathons",
  description: "Comprehensive list of hackathons happening across Europe",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">🇪🇺🚀 EURO HACKATHONS</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive, up-to-date list of hackathons happening across
          Europe. Whether you&apos;re a seasoned hacker or a beginner, find your
          next coding adventure here!
        </p>
      </div>

      <div className="mb-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">🤖 Stay Updated</h2>
        <p className="text-muted-foreground mb-6">
          Get notified about new hackathons automatically! Our system checks for
          new events every 2 hours.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors"
          >
            <FaDiscord size={20} />
            Discord Bot
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#006699] transition-colors"
          >
            <FaTelegram size={20} />
            Telegram Bot
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaXTwitter size={20} />X Updates
          </Link>
        </div>
      </div>

      <HackathonList />
    </div>
  );
}
