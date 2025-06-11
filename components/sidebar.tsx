"use client";

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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  X,
  Filter,
  Check,
  ChevronsUpDown,
  Bell,
} from "lucide-react";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useFilters } from "@/contexts/filter-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  uniqueLocations?: string[];
  uniqueTopics?: string[];
}

export default function Sidebar({
  uniqueLocations = [],
  uniqueTopics = [],
}: SidebarProps) {
  const { filters, updateFilter, clearFilters } = useFilters();
  const [topicOpen, setTopicOpen] = useState(false);

  const toggleTopic = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    updateFilter("topics", newTopics);
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.topics.length > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

  return (
    <aside className="w-80 border-r bg-card p-6 space-y-8">
      {/* Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Hackathon name..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value: "upcoming" | "past") =>
              updateFilter("status", value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Combobox */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {filters.location || "Select location..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search location..." />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem onSelect={() => updateFilter("location", "")}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !filters.location ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All
                    </CommandItem>
                    {uniqueLocations.map((location) => (
                      <CommandItem
                        key={location}
                        onSelect={() => updateFilter("location", location)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.location === location
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {location}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Topics Combobox */}
        <div className="space-y-2">
          <Label>Topics</Label>
          <Popover open={topicOpen} onOpenChange={setTopicOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={topicOpen}
                className="w-full justify-between"
              >
                {filters.topics.length > 0
                  ? `${filters.topics.length} selected`
                  : "Select topics..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search topic..." />
                <CommandList>
                  <CommandEmpty>No topic found.</CommandEmpty>
                  <CommandGroup>
                    {uniqueTopics.map((topic) => (
                      <CommandItem
                        key={topic}
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

          {/* Selected Topics */}
          {filters.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-xs cursor-pointer"
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Dates</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "dd MMM", { locale: it })}{" "}
                      - {format(filters.dateRange.to, "dd MMM", { locale: it })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "dd MMM yyyy", {
                      locale: it,
                    })
                  )
                ) : (
                  "Select dates"
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

      <Separator />

      {/* Bots and Notifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="space-y-2">
          <Button
            asChild
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Link href="#">
              <FaDiscord className="mr-2 h-4 w-4" />
              Discord Bot
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Link href="#">
              <FaTelegram className="mr-2 h-4 w-4" />
              Telegram Bot
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full justify-start"
            size="sm"
          >
            <Link href="#">
              <FaXTwitter className="mr-2 h-4 w-4" />X Updates
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
