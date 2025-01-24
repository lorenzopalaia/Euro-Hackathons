import { Hackathon } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { Globe, Flag, Calendar, Tag, MapPin, ChevronRight } from "lucide-react";

import Link from "next/link";

import PulseDot from "@/components/PulseDot";

import { calculateTimeLeft, formatDate } from "@/utils/datetime";
import { capitalize } from "@/utils/string";

const colorClasses = {
  upcoming: {
    border: "border-emerald-500",
    background: "bg-emerald-500",
  },
  past: {
    border: "border-gray-500",
    background: "bg-gray-500",
  },
  future: {
    border: "border-sky-500",
    background: "bg-sky-500",
  },
};

function HackathonDetails({
  hackathon,
  type,
}: {
  hackathon: Hackathon;
  type: "upcoming" | "past" | "future";
}) {
  const { border, background } = colorClasses[type];

  return (
    <Link
      key={hackathon.id}
      className={`mt-8 flex gap-2 border ${
        hackathon.featured && type === "upcoming" ? "border-foreground" : border
      } group rounded shadow-lg hover:border-2`}
      href={hackathon.link}
      target="_blank"
    >
      {hackathon.featured && type === "upcoming" ? (
        <div className="bg-foreground">
          <div className="flex h-full w-full items-center justify-center">
            <p className="rotate-180 font-bold text-background [writing-mode:vertical-lr]">
              FEATURED
            </p>
          </div>
        </div>
      ) : (
        <div className={`${background} w-1 group-hover:w-6`}></div>
      )}
      <div className="w-3/5 space-y-4 border-r p-4">
        <h3 className="text-2xl font-bold">{hackathon.name}</h3>
        <div className="flex items-center gap-8">
          {type === "upcoming" && (
            <Badge
              className={`${
                hackathon.featured && type === "upcoming"
                  ? "bg-foreground hover:bg-foreground"
                  : background + " hover:" + background
              } rounded-full`}
            >
              <PulseDot className="mr-2" />
              {calculateTimeLeft(hackathon.start_date)}
            </Badge>
          )}
          <span className="flex items-center gap-2 text-muted-foreground">
            <Globe />
            {capitalize(hackathon.mode)}
          </span>
        </div>
        {hackathon.prize && (
          <p>
            <span className="font-bold">{hackathon.prize}</span> in prizes
          </p>
        )}
        {hackathon.participants && (
          <p>
            <span className="font-bold">{hackathon.participants}</span>{" "}
            participants
          </p>
        )}
      </div>
      <div className="w-2/5 space-y-4 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin />
          <p>
            {hackathon.city}, {hackathon.country}
          </p>
        </div>
        {hackathon.sponsor && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flag />
            <Badge
              variant="outline"
              className="rounded-full border-sky-500 text-sky-500"
            >
              {hackathon.sponsor}
            </Badge>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar />
          <p>{formatDate(hackathon.start_date, hackathon.end_date, type)}</p>
        </div>
        {hackathon.topic && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag />
            <Badge className="hover:text-xky-800 bg-sky-200 capitalize text-sky-800 hover:bg-sky-200">
              {hackathon.topic}
            </Badge>
          </div>
        )}
      </div>
      <div
        className={`${
          hackathon.featured && type === "upcoming"
            ? "bg-foreground"
            : background
        } hidden group-hover:block`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <ChevronRight className="text-background" />
        </div>
      </div>
    </Link>
  );
}

export default function HackathonCard({
  hackathons,
  type,
  isLoading,
}: {
  hackathons: Hackathon[];
  type: "upcoming" | "past" | "future";
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );

  return (
    <>
      {hackathons.map((hackathon, index) => (
        <HackathonDetails key={index} hackathon={hackathon} type={type} />
      ))}
    </>
  );
}
