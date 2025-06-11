"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ExternalLink,
  MapPin,
  Calendar as CalendarIcon,
  Tag,
  FileText,
  Filter,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Hackathon } from "@/lib/database.types";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface FilterState {
  search: string;
  location: string;
  topics: string[];
  dateRange: DateRange | undefined;
}

export default function HackathonList() {
  const [upcoming, setUpcoming] = useState<Hackathon[]>([]);
  const [past, setPast] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    topics: [],
    dateRange: undefined,
  });

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

  // Ottieni tutte le location e topics unici per i filtri
  const { uniqueLocations, uniqueTopics } = useMemo(() => {
    const allHackathons = [...upcoming, ...past];

    const locations = Array.from(
      new Set(allHackathons.map((h) => h.location).filter(Boolean))
    );
    const topics = Array.from(
      new Set(allHackathons.flatMap((h) => h.topics || []))
    );

    return {
      uniqueLocations: locations.sort(),
      uniqueTopics: topics.sort(),
    };
  }, [upcoming, past]);

  // Filtra gli hackathons in base ai filtri attivi
  const filterHackathons = useCallback(
    (hackathons: Hackathon[]) => {
      return hackathons.filter((hackathon) => {
        // Filtro per testo (nome)
        if (
          filters.search &&
          !hackathon.name.toLowerCase().includes(filters.search.toLowerCase())
        ) {
          return false;
        }

        // Filtro per location
        if (filters.location && hackathon.location !== filters.location) {
          return false;
        }

        // Filtro per topics
        if (filters.topics.length > 0) {
          const hackathonTopics = hackathon.topics || [];
          const hasMatchingTopic = filters.topics.some((topic) =>
            hackathonTopics.includes(topic)
          );
          if (!hasMatchingTopic) {
            return false;
          }
        }

        // Filtro per data range
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

  const filteredUpcoming = useMemo(
    () => filterHackathons(upcoming),
    [upcoming, filterHackathons]
  );
  const filteredPast = useMemo(
    () => filterHackathons(past),
    [past, filterHackathons]
  );

  const updateFilter = (
    key: keyof FilterState,
    value: FilterState[keyof FilterState]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTopic = (topic: string) => {
    setFilters((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      topics: [],
      dateRange: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.topics.length > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

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

    // If different months, show both months
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

    // Same month, show day range
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString(
      "en-GB",
      {
        month: "short",
        year: "numeric",
      }
    )}`;
  };

  const HackathonCard = ({ hackathon }: { hackathon: Hackathon }) => (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg line-clamp-2">{hackathon.name}</CardTitle>

        {/* Informazioni primarie */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(hackathon)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{hackathon.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Topics */}
        {hackathon.topics && hackathon.topics.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {hackathon.topics.map((topic, index) => (
                  <Badge
                    key={`${topic}-${index}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {hackathon.notes && hackathon.notes.trim() && (
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                {hackathon.notes}
              </p>
            </div>
          </div>
        )}

        {/* Button sempre in fondo */}
        <div className="mt-auto pt-4">
          <Button asChild className="w-full">
            <Link
              href={hackathon.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Partecipa <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Filtri sempre visibili */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtri</CardTitle>
              {hasActiveFilters && <Badge variant="secondary">Attivi</Badge>}
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancella filtri
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtro primario: Ricerca */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Cerca per nome
            </Label>
            <Input
              id="search"
              placeholder="Inserisci il nome dell'hackathon..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="h-10"
            />
          </div>

          {/* Filtri secondari: Location, Topics, Date - stessa altezza */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Località</Label>
              <Select
                value={filters.location}
                onValueChange={(value) =>
                  updateFilter("location", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Seleziona località" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le località</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topics - Combobox */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Topic
                {filters.topics.length > 0 && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({filters.topics.length})
                  </span>
                )}
              </Label>
              <Popover open={topicsOpen} onOpenChange={setTopicsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={topicsOpen}
                    className="h-10 w-full justify-between"
                  >
                    {filters.topics.length === 0
                      ? "Seleziona topic..."
                      : filters.topics.length === 1
                      ? filters.topics[0]
                      : `${filters.topics.length} topic selezionati`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Cerca topic..." />
                    <CommandList>
                      <CommandEmpty>Nessun topic trovato.</CommandEmpty>
                      <CommandGroup>
                        {uniqueTopics.map((topic) => (
                          <CommandItem
                            key={topic}
                            value={topic}
                            onSelect={() => {
                              toggleTopic(topic);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.topics.includes(topic)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {topic}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Intervallo di date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "dd MMM yyyy", {
                            locale: it,
                          })}{" "}
                          -{" "}
                          {format(filters.dateRange.to, "dd MMM yyyy", {
                            locale: it,
                          })}
                        </>
                      ) : (
                        format(filters.dateRange.from, "dd MMM yyyy", {
                          locale: it,
                        })
                      )
                    ) : (
                      <span>Seleziona date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => updateFilter("dateRange", range)}
                    numberOfMonths={2}
                    locale={it}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Visualizzazione filtri attivi */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Nome: {filters.search}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("search", "")}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="outline" className="gap-1">
                  Località: {filters.location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("location", "")}
                  />
                </Badge>
              )}
              {filters.topics.map((topic) => (
                <Badge key={topic} variant="outline" className="gap-1">
                  {topic}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  />
                </Badge>
              ))}
              {filters.dateRange?.from && (
                <Badge variant="outline" className="gap-1">
                  Date:{" "}
                  {format(filters.dateRange.from, "dd MMM", { locale: it })}
                  {filters.dateRange.to &&
                    ` - ${format(filters.dateRange.to, "dd MMM", {
                      locale: it,
                    })}`}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => updateFilter("dateRange", undefined)}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista Hackathons */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            🟢 Upcoming ({filteredUpcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            🔴 Past ({filteredPast.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUpcoming.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
          {filteredUpcoming.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {hasActiveFilters
                ? "Nessun hackathon trovato con i filtri selezionati."
                : "Nessun hackathon in programma al momento."}
            </p>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPast.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
          {filteredPast.length === 0 && hasActiveFilters && (
            <p className="text-center text-muted-foreground py-8">
              Nessun hackathon passato trovato con i filtri selezionati.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
