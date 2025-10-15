"use client";

import { useMemo, useCallback } from "react";
import { useTranslation } from "@/contexts/translation-context";
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
import {
  ExternalLink,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
} from "lucide-react";
import { ExportCalendarDropdown } from "@/components/export-calendar-dropdown";
import { ShareHackathonDropdown } from "@/components/share-hackathon-dropdown";
import { Hackathon } from "@/types/hackathon";
import Link from "next/link";
import { useFilters } from "@/contexts/filter-context";
import { europeanCountries } from "@/lib/european-countries";
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
  const { t } = useTranslation();
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

        if (filters.locations.length > 0) {
          const hackathonLocation = europeanCountries.formatLocation(
            hackathon.city,
            hackathon.country_code
          );
          if (
            !hackathonLocation ||
            !filters.locations.includes(hackathonLocation)
          ) {
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
    const filtered = filterHackathons(source);
    const sorted = [...filtered].sort((a, b) => {
      const da = new Date(a.date_start).getTime();
      const db = new Date(b.date_start).getTime();
      if (filters.sort === "asc") return da - db;
      return db - da;
    });
    return sorted;
  }, [filters.status, filters.sort, upcoming, past, filterHackathons]);

  // formatDate is provided by the translation context (formatDateRange)

  const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => {
    const { t, formatDateRange } = useTranslation();
    // DEBUG: log resolution for badge.new during runtime to diagnose missing translations
    if (typeof window !== "undefined") {
      try {
        console.debug("[i18n-debug] badge.new ->", t("badge.new"));
      } catch {}
    }
    return (
      <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 flex-1">
              {hackathon.name}
            </CardTitle>
            {hackathon.is_new && (
              <Badge
                variant="default"
                className="shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {t("badge.new")}
              </Badge>
            )}
          </div>
          {hackathon.notes && hackathon.notes.trim() && (
            <CardDescription className="line-clamp-2">
              {hackathon.notes}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex md:w-1/2 items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span>
                  {formatDateRange(hackathon.date_start, hackathon.date_end)}
                </span>
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
                  {`+${hackathon.topics.length - 4} ${t("topics.more")}`}
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
                  aria-label={t("aria.register", { name: hackathon.name })}
                >
                  {t("action.join")} <ExternalLink className="ml-1 h-4 w-4" />
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
          {filters.status === "upcoming"
            ? t("header.upcoming")
            : t("header.past")}{" "}
          {t("header.hackathons")}
        </h2>
        <p className="text-muted-foreground">
          {currentHackathons.length}{" "}
          {t("header.found", { count: currentHackathons.length })}
        </p>
      </div>

      {currentHackathons.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p>{t("noResults.message")}</p>
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
