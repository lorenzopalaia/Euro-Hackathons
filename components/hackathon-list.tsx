import { useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { ExportCalendarDropdown } from "@/components/export-calendar-dropdown";
import { ShareHackathonDropdown } from "@/components/share-hackathon-dropdown";
import { Hackathon } from "@/types/hackathon";
import { useUrlPreview } from "@/hooks/use-url-preview";
import Link from "next/link";
import { useFilters } from "@/contexts/filter-context";
import { europeanCountries } from "@/lib/european-countries";
import Image from "next/image";
import { getTopicDisplay } from "@/lib/constants/topics";

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

        if (filters.location) {
          const hackathonLocation = europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code
          );
          if (hackathonLocation !== filters.location) {
            return false;
          }
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

  const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => {
    const { preview, loading: previewLoading } = useUrlPreview(hackathon.url);

    return (
      <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="line-clamp-2">{hackathon.name}</CardTitle>
          {hackathon.notes && hackathon.notes.trim() && (
            <CardDescription className="line-clamp-2">
              {hackathon.notes}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Social Preview Image */}
          {previewLoading ? (
            <Skeleton className="h-48 w-full rounded" />
          ) : preview?.image ? (
            <div className="relative h-48 w-full overflow-hidden rounded bg-muted">
              <Image
                src={preview.image}
                alt={preview.title || hackathon.name}
                fill
                className="object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex md:w-1/2 items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span>{formatDate(hackathon)}</span>
              </div>
              {(hackathon.city || hackathon.country_code) && (
                <div className="flex md:w-1/2 items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {europeanCountries.formatLocation(
                      hackathon.city,
                      hackathon.country_code
                    )}{" "}
                    {hackathon.country_code &&
                      europeanCountries.getCountryEmoji(hackathon.country_code)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {hackathon.topics && hackathon.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hackathon.topics
                .slice(0, 4)
                .map((topic: string, index: number) => {
                  const topicConfig = getTopicDisplay(topic);
                  return (
                    <Badge
                      key={`${topic}-${index}`}
                      variant="outline"
                      className={`text-xs border ${topicConfig.color}`}
                    >
                      {topicConfig.label}
                    </Badge>
                  );
                })}
              {hackathon.topics.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{hackathon.topics.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {filters.status === "upcoming" && (
            <>
              <Button asChild className="w-full">
                <Link
                  href={hackathon.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Register for ${hackathon.name}`}
                >
                  Join <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-2 w-full">
                <ShareHackathonDropdown hackathon={hackathon} />
                <ExportCalendarDropdown hackathon={hackathon} />
              </div>
            </>
          )}

          {filters.status === "past" && (
            <ShareHackathonDropdown hackathon={hackathon} />
          )}
        </CardFooter>
      </Card>
    );
  };

  // ...existing code...
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
              <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Preview image skeleton */}
                <Skeleton className="h-32 w-full rounded-md" />
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex md:w-1/2 items-center gap-2">
                      <Skeleton className="h-4 w-4 shrink-0" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex md:w-1/2 items-center gap-2">
                      <Skeleton className="h-4 w-4 shrink-0" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-14" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Skeleton className="h-9 w-full" />
                {filters.status === "upcoming" && (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                )}
                {filters.status === "past" && (
                  <Skeleton className="h-8 w-full" />
                )}
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
        <div className="py-8 text-center text-muted-foreground">
          <p>No hackathons found matching your criteria</p>
        </div>
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
