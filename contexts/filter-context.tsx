"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";
import type { HackathonTopic } from "@/lib/constants/topics";

interface FilterState {
  search: string;
  locations: string[];
  topics: HackathonTopic[];
  dateRange: DateRange | undefined;
  status: "upcoming" | "past";
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: FilterState = {
  search: "",
  locations: [],
  topics: [],
  dateRange: undefined,
  status: "upcoming",
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => {
    setFilters((prev) => {
      // Se stiamo cambiando lo status, resetta anche le locations
      if (key === "status") {
        return { ...prev, [key]: value, locations: [] };
      }
      return { ...prev, [key]: value };
    });
  };

  const clearFilters = () => {
    setFilters({ ...initialFilters, status: filters.status });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
