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
  Menu,
  FilterX,
} from "lucide-react";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Mobile collapsed sidebar
  const MobileCollapsedSidebar = () => (
    <aside className="bg-card fixed top-0 left-0 z-40 flex h-full w-16 flex-col items-center space-y-4 border-r py-6 md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileOpen(true)}
        className="h-10 w-10 p-0"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-col space-y-2">
        <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Link href="#" target="_blank">
            <FaDiscord className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Link href="https://t.me/eurohackathons" target="_blank">
            <FaTelegram className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Link href="#" target="_blank">
            <FaXTwitter className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </aside>
  );

  // Full sidebar content
  const SidebarContent = () => (
    <>
      {/* Filters */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h2 className="font-semibold">Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <FilterX className="h-4 w-4" />
              </Button>
            )}
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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
                          !filters.location ? "opacity-100" : "opacity-0",
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
                              : "opacity-0",
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
                              : "opacity-0",
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
            <div className="mt-2 flex flex-wrap gap-1">
              {filters.topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="cursor-pointer text-xs"
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
                      {format(filters.dateRange.from, "dd MMM", {
                        locale: enGB,
                      })}{" "}
                      -{" "}
                      {format(filters.dateRange.to, "dd MMM", { locale: enGB })}
                    </>
                  ) : (
                    format(filters.dateRange.from, "dd MMM yyyy", {
                      locale: enGB,
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
                numberOfMonths={1}
                locale={enGB}
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
            <Link href="#" target="_blank">
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
            <Link href="https://t.me/eurohackathons" target="_blank">
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
            <Link href="#" target="_blank">
              <FaXTwitter className="mr-2 h-4 w-4" />X Updates
            </Link>
          </Button>
        </div>
      </div>
    </>
  );

  // ...existing code...

  return (
    <>
      {/* Mobile collapsed sidebar */}
      <MobileCollapsedSidebar />

      {/* Desktop sidebar */}
      <aside className="bg-card hidden w-60 flex-col space-y-8 border-r p-6 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="animate-in fade-in fixed inset-0 z-50 bg-black/50 duration-500 md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="bg-card animate-in slide-in-from-left fixed top-0 left-0 z-50 h-full w-80 space-y-8 overflow-y-auto border-r p-6 duration-500 md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
