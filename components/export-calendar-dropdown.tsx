"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { atcb_action } from "add-to-calendar-button-react";
import { Hackathon } from "@/types/hackathon";

interface ExportCalendarDropdownProps {
  hackathon: Hackathon;
}

const calendarOptions = [
  { label: "Google Calendar", value: "Google" as const },
  { label: "Apple Calendar", value: "Apple" as const },
  { label: "Outlook", value: "Outlook.com" as const },
  { label: "iCal", value: "iCal" as const },
  { label: "Yahoo", value: "Yahoo" as const },
  { label: "Microsoft Teams", value: "MicrosoftTeams" as const },
  { label: "Microsoft 365", value: "Microsoft365" as const },
];

export function ExportCalendarDropdown({
  hackathon,
}: ExportCalendarDropdownProps) {
  const formatEventForCalendar = () => {
    const startDate = new Date(hackathon.date_start);
    const endDate = hackathon.date_end
      ? new Date(hackathon.date_end)
      : startDate;

    // Check if the dates have specific times (not just 00:00:00)
    const hasStartTime =
      startDate.getUTCHours() !== 0 || startDate.getUTCMinutes() !== 0;
    const hasEndTime =
      endDate.getUTCHours() !== 0 || endDate.getUTCMinutes() !== 0;

    return {
      name: hackathon.name,
      description:
        hackathon.notes || `Join us for the ${hackathon.name} hackathon!`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      startTime: hasStartTime
        ? startDate.toISOString().split("T")[1].substring(0, 5)
        : "09:00",
      endTime: hasEndTime
        ? endDate.toISOString().split("T")[1].substring(0, 5)
        : "18:00",
      location: hackathon.location,
      timeZone: "Europe/London",
    };
  };

  const handleExport = (option: (typeof calendarOptions)[number]) => {
    const eventData = formatEventForCalendar();
    atcb_action({ ...eventData, options: [option.value] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="w-full">
          Add to Calendar
          <CalendarIcon className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        {calendarOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleExport(option)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
