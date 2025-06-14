"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Share2, Linkedin, Copy } from "lucide-react";
import { Hackathon } from "@/types/hackathon";
import { FaXTwitter, FaReddit } from "react-icons/fa6";
import { europeanCountries } from "@/lib/european-countries";

interface ShareHackathonDropdownProps {
  hackathon: Hackathon;
}

const shareOptions = [
  {
    label: "Twitter",
    value: "twitter",
    icon: FaXTwitter,
  },
  {
    label: "LinkedIn",
    value: "linkedin",
    icon: Linkedin,
  },
  {
    label: "Reddit",
    value: "reddit",
    icon: FaReddit,
  },
  {
    label: "Copy Link",
    value: "copy",
    icon: Copy,
  },
];

export function ShareHackathonDropdown({
  hackathon,
}: ShareHackathonDropdownProps) {
  const formatDate = (hackathon: Hackathon) => {
    const start = new Date(hackathon.date_start);
    const end = hackathon.date_end ? new Date(hackathon.date_end) : null;

    if (!end || start.toDateString() === end.toDateString()) {
      return start.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    return `${start.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const generateShareContent = () => {
    const date = formatDate(hackathon);
    const location =
      europeanCountries.formatLocation(
        hackathon.city,
        hackathon.country_code,
      ) || "TBD";
    const topics = hackathon.topics?.length
      ? hackathon.topics
          .slice(0, 3)
          .map((topic: string) => `#${topic.replace(/\s+/g, "")}`)
          .join(" ")
      : "";

    return {
      title: hackathon.name,
      text: `🚀 Check out this hackathon: ${hackathon.name}\n📅 ${date}\n📍 ${location}\n${topics}`,
      url: hackathon.url,
    };
  };

  const handleShare = async (platform: string) => {
    const shareContent = generateShareContent();

    switch (platform) {
      case "twitter":
        const location =
          europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code,
          ) || "TBD";
        const twitterText = encodeURIComponent(
          `🚀 ${shareContent.title}\n📅 ${formatDate(hackathon)}\n📍 ${location}\n${shareContent.url}`,
        );
        window.open(
          `https://twitter.com/intent/tweet?text=${twitterText}`,
          "_blank",
          "noopener,noreferrer",
        );
        break;

      case "linkedin":
        const linkedinUrl = encodeURIComponent(shareContent.url);
        const linkedinTitle = encodeURIComponent(shareContent.title);
        const linkedinLocation =
          europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code,
          ) || "TBD";
        const linkedinSummary = encodeURIComponent(
          `${shareContent.title} - ${formatDate(hackathon)} in ${linkedinLocation}`,
        );
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${linkedinUrl}&title=${linkedinTitle}&summary=${linkedinSummary}`,
          "_blank",
          "noopener,noreferrer",
        );
        break;

      case "reddit":
        const redditLocation =
          europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code,
          ) || "TBD";
        const redditTitle = encodeURIComponent(
          `${shareContent.title} - ${formatDate(hackathon)} in ${redditLocation}`,
        );
        const redditUrl = encodeURIComponent(shareContent.url);
        window.open(
          `https://www.reddit.com/submit?title=${redditTitle}&url=${redditUrl}`,
          "_blank",
          "noopener,noreferrer",
        );
        break;

      case "copy":
        try {
          await navigator.clipboard.writeText(shareContent.url);
          // Potresti aggiungere un toast notification qui
          console.log("Link copied to Copy!");
        } catch (err) {
          console.error("Failed to copy link", err);
          // Fallback per browser più vecchi
          const textArea = document.createElement("textarea");
          textArea.value = shareContent.url;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand("copy");
            console.log("Link copied to Copy!");
          } catch (err) {
            console.error("Failed to copy link using execCommand", err);
          }
          document.body.removeChild(textArea);
        }
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          Share
          <Share2 className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        {shareOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleShare(option.value)}
              className="flex items-center gap-2"
            >
              <IconComponent className={`h-4 w-4`} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
