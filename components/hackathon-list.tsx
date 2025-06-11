"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  MapPin,
  Calendar as CalendarIcon,
  Tag,
  FileText,
} from "lucide-react";
import { Hackathon } from "@/lib/database.types";
import Link from "next/link";
import { useFilters } from "@/contexts/filter-context";

export default function HackathonList() {
  const [upcoming, setUpcoming] = useState<Hackathon[]>([]);
  const [past, setPast] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilters();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const [upcomingRes, pastRes] = await Promise.all([
        fetch("/api/hackathons?status=upcoming&limit=100"),
        fetch("/api/hackathons?status=past&limit=50"),
      ]);

      const upcomingData = await upcomingRes.json();
      const pastData = await pastRes.json();

      setUpcoming(upcomingData.data || []);
      setPast(pastData.data || []);
    } catch (error) {
      console.error("Error fetching hackathons:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <Card className="hover:shadow-lg transition-all duration-200 border-border flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
              {hackathon.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">{formatDate(hackathon)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{hackathon.location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        {hackathon.topics && hackathon.topics.length > 0 && (
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <div className="flex flex-wrap gap-1.5 min-w-0">
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
          </div>
        )}

        {hackathon.notes && hackathon.notes.trim() && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {hackathon.notes}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={hackathon.url} target="_blank" rel="noopener noreferrer">
            Join <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {filters.status === "upcoming" ? "Upcoming" : "Past"} Hackathons
        </h2>
        <p className="text-muted-foreground">
          {currentHackathons.length} hackathon
          {currentHackathons.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {currentHackathons.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Nessun hackathon trovato
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {currentHackathons.map((hackathon) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))}
        </div>
      )}
    </div>
  );
}
