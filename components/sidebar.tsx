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
  Users,
  Github,
  HelpCircle,
  FileText,
  FileCheck,
  Shield,
  Palette,
} from "lucide-react";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { useFilters } from "@/contexts/filter-context";
import type { FilterState, FilterContextType } from "@/contexts/filter-context";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HackathonTopic } from "@/lib/constants/topics";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface SidebarProps {
  uniqueUpcomingLocations?: string[];
  uniquePastLocations?: string[];
  uniqueTopics?: HackathonTopic[];
}

// Configurazione dei link esterni
const EXTERNAL_LINKS = {
  discord: "https://discord.com/invite/SmygTckVez",
  telegram: "https://t.me/eurohackathons",
  twitter: "https://x.com/eurohackathons",
  github: "https://github.com/lorenzopalaia/Euro-Hackathons",
} as const;

// Configurazione delle sezioni della sidebar
const SIDEBAR_SECTIONS = {
  notifications: [
    { href: EXTERNAL_LINKS.discord, icon: FaDiscord, label: "Discord Bot" },
    { href: EXTERNAL_LINKS.telegram, icon: FaTelegram, label: "Telegram Bot" },
    { href: EXTERNAL_LINKS.twitter, icon: FaXTwitter, label: "X Updates" },
  ],
  socials: [{ href: EXTERNAL_LINKS.github, icon: Github, label: "GitHub" }],
  support: [
    { href: "/docs", icon: FileText, label: "Documentation" },
    { href: "/privacy", icon: Shield, label: "Privacy Policy" },
    { href: "/terms", icon: FileCheck, label: "Terms of Service" },
  ],
} as const;

// Componente per i pulsanti della sidebar mobile collassata
const CollapsedSidebarButton = ({
  href,
  icon: Icon,
  onClick,
  variant = "outline",
}: {
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  variant?: "outline" | "ghost";
}) => {
  const buttonProps = {
    variant,
    size: "sm" as const,
    className: "h-10 w-10 p-0",
  };

  if (href) {
    return (
      <Button asChild {...buttonProps}>
        <Link
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          <Icon className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button {...buttonProps} onClick={onClick}>
      <Icon className="h-4 w-4" />
    </Button>
  );
};

// Componente per le sezioni con link esterni
const ExternalLinksSection = ({
  title,
  icon: TitleIcon,
  links,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: readonly {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[];
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <TitleIcon className="h-4 w-4" />
      <h2 className="font-semibold">{title}</h2>
    </div>
    <div className="space-y-2">
      {links.map(({ href, icon: Icon, label }) => (
        <Button
          key={href}
          asChild
          variant="outline"
          className="w-full justify-start"
          size="sm"
        >
          <Link
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
          >
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </Link>
        </Button>
      ))}
    </div>
  </div>
);

// Mobile collapsed sidebar (moved out to avoid remounting on each render)
function MobileCollapsedSidebar({
  onOpen,
}: {
  onOpen: (open: boolean) => void;
}) {
  return (
    <aside className="fixed top-0 left-0 z-40 flex h-full w-16 flex-col items-center space-y-4 border-r bg-card py-6 md:hidden">
      <CollapsedSidebarButton
        variant="ghost"
        icon={Menu}
        onClick={() => onOpen(true)}
      />

      <div className="flex flex-col space-y-2">
        <CollapsedSidebarButton icon={Palette} onClick={() => onOpen(true)} />

        <Separator className="mb-4 mt-2" />

        <CollapsedSidebarButton icon={Filter} onClick={() => onOpen(true)} />

        <Separator className="mb-4 mt-2" />

        {SIDEBAR_SECTIONS.notifications.map(({ href, icon }) => (
          <CollapsedSidebarButton key={href} href={href} icon={icon} />
        ))}

        <Separator className="mb-4 mt-2" />

        {SIDEBAR_SECTIONS.socials.map(({ href, icon }) => (
          <CollapsedSidebarButton key={href} href={href} icon={icon} />
        ))}

        <Separator className="mb-4 mt-2" />

        {SIDEBAR_SECTIONS.support.map(({ href, icon }) => (
          <CollapsedSidebarButton key={href} href={href} icon={icon} />
        ))}
      </div>
    </aside>
  );
}

// Full sidebar content (moved out to avoid remounting on each render)
function SidebarContent({
  filters,
  updateFilter,
  clearFilters,
  uniqueTopics = [],
  availableLocations = [],
  onCloseMobile,
}: {
  filters: FilterState;
  updateFilter: FilterContextType["updateFilter"];
  clearFilters: () => void;
  uniqueTopics?: HackathonTopic[];
  availableLocations?: string[];
  onCloseMobile?: () => void;
}) {
  const [topicOpen, setTopicOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l: string) => l !== location)
      : [...filters.locations, location];
    updateFilter("locations", newLocations);
  };

  const toggleTopic = (topic: HackathonTopic) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t: HackathonTopic) => t !== topic)
      : [...filters.topics, topic];
    updateFilter("topics", newTopics);
  };

  const hasActiveFilters =
    filters.search ||
    filters.locations.length > 0 ||
    filters.topics.length > 0 ||
    filters.dateRange?.from ||
    filters.dateRange?.to;

  return (
    <>
      {/* Theme Switcher */}
      <ThemeSwitcher />

      <Separator />

      {/* Filters */}
      <div className="space-y-4">
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
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => onCloseMobile?.()}
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
            placeholder="Hackathon name"
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
          <Label>Locations</Label>
          <Popover open={locationOpen} onOpenChange={setLocationOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={locationOpen}
                className="w-full justify-between"
              >
                {filters.locations.length > 0
                  ? `${filters.locations.length} selected`
                  : "Select locations"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search location" />
                <CommandList>
                  <CommandEmpty>No location found.</CommandEmpty>
                  <CommandGroup>
                    {availableLocations.map((location) => (
                      <CommandItem
                        key={location}
                        onSelect={() => {
                          toggleLocation(location);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filters.locations.includes(location)
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

          {/* Selected Locations */}
          {filters.locations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {filters.locations.map((location: string) => (
                <Badge
                  key={location}
                  variant="secondary"
                  className="cursor-pointer text-xs"
                  onClick={() => toggleLocation(location)}
                >
                  {location}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
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
                  : "Select topics"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search topic" />
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
              {filters.topics.map((topic: HackathonTopic) => (
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

      {/* Notifications */}
      <ExternalLinksSection
        title="Notifications"
        icon={Bell}
        links={SIDEBAR_SECTIONS.notifications}
      />

      <Separator />

      {/* Socials */}
      <ExternalLinksSection
        title="Socials"
        icon={Users}
        links={SIDEBAR_SECTIONS.socials}
      />

      <Separator />

      {/* Support */}
      <ExternalLinksSection
        title="Support"
        icon={HelpCircle}
        links={SIDEBAR_SECTIONS.support}
      />
    </>
  );
}

export default function Sidebar({
  uniqueUpcomingLocations = [],
  uniquePastLocations = [],
  uniqueTopics = [],
}: SidebarProps) {
  const { filters, updateFilter, clearFilters } = useFilters();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Determina le location da mostrare in base allo status
  const availableLocations =
    filters.status === "upcoming"
      ? uniqueUpcomingLocations
      : uniquePastLocations;

  return (
    <>
      {/* Mobile collapsed sidebar */}
      <MobileCollapsedSidebar onOpen={setMobileOpen} />

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col space-y-6 overflow-y-auto border-r bg-card p-6 md:flex">
        <SidebarContent
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          uniqueTopics={uniqueTopics}
          availableLocations={availableLocations}
          onCloseMobile={() => setMobileOpen(false)}
        />
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/50 animate-in fade-in duration-300 md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 z-50 h-full w-80 space-y-6 overflow-y-auto border-r bg-card p-6 animate-in slide-in-from-left duration-300 md:hidden">
            <SidebarContent
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              uniqueTopics={uniqueTopics}
              availableLocations={availableLocations}
              onCloseMobile={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  );
}
