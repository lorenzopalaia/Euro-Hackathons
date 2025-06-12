"use client";

import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MapPin,
  Calendar as CalendarIcon,
  Tag,
  FileText,
} from "lucide-react";
import { Hackathon } from "@/types/hackathon";
import Link from "next/link";
import { useFilters } from "@/contexts/filter-context";
import { emojiFlag } from "@/lib/emoji-flag";

interface HackathonListProps {
  upcoming: Hackathon[];
  past: Hackathon[];
  loading: boolean;
}

export default function HackathonList({
  upcoming,
  past,
  loading,
}: HackathonListProps) {
  const { filters } = useFilters();

  const filterHackathons = useCallback(
    (hackathons: Hackathon[]) => {
      return hackathons.filter((hackathon) => {
        if (
          filters.search &&
          !hackathon.name.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        if (filters.location && hackathon.location !== filters.location) {
          return false;
        }

        if (filters.topics.length > 0) {
          const hackathonTopics = hackathon.topics || [];
          const hasMatchingTopic = filters.topics.some((topic) =>
            hackathonTopics.includes(topic)
          );
          if (!hasMatchingTopic) {
            return false;
          }
        }

        if (filters.dateRange?.from || filters.dateRange?.to) {
          const hackathonDate = new Date(hackathon.date_start);

          if (
            filters.dateRange.from &&
            hackathonDate < filters.dateRange.from
          ) {
            return false;
          }

          if (filters.dateRange.to && hackathonDate > filters.dateRange.to) {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
  );

  const currentHackathons = useMemo(() => {
    const source = filters.status === "upcoming" ? upcoming : past;
    return filterHackathons(source);
  }, [filters.status, upcoming, past, filterHackathons]);

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

    if (
      start.getMonth() !== end.getMonth() ||
      start.getFullYear() !== end.getFullYear()
    ) {
      return `${start.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })} - ${end.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    }

    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString(
      "en-GB",
      {
        month: "short",
        year: "numeric",
      }
    )}`;
  };

  const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => (
    <Card className="border-border flex h-full flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground mb-2 line-clamp-2 text-xl font-bold">
              {hackathon.name}
            </h3>
            <div className="text-muted-foreground flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">{formatDate(hackathon)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {hackathon.location.includes(",")
                  ? emojiFlag(hackathon.location.split(",")[1]?.trim())
                  : ""}{" "}
                {hackathon.location}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {hackathon.topics && hackathon.topics.length > 0 && (
          <div className="flex items-start gap-2">
            <Tag className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {hackathon.topics.slice(0, 4).map((topic, index) => (
                <Badge
                  key={`${topic}-${index}`}
                  variant="secondary"
                  className="text-xs font-medium"
                >
                  {topic}
                </Badge>
              ))}
              {hackathon.topics.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{hackathon.topics.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {hackathon.notes && hackathon.notes.trim() && (
          <div className="flex items-start gap-2 mt-2">
            <FileText className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {hackathon.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={hackathon.url} target="_blank" rel="noopener noreferrer">
            Join <ExternalLink className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex h-full flex-col">
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex gap-1.5">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-4" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">
          {filters.status === "upcoming" ? "Upcoming" : "Past"} Hackathons
        </h2>
        <p className="text-muted-foreground">
          {currentHackathons.length} hackathon
          {currentHackathons.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {currentHackathons.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Nessun hackathon trovato
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {currentHackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
}
