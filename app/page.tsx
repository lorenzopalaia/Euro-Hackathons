"use client";

import HackathonList from "@/components/hackathon-list";
import Sidebar from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useMemo } from "react";
import { Hackathon } from "@/types/hackathon";
import { FilterProvider } from "@/contexts/filter-context";
import { europeanCountries } from "@/lib/european-countries";

export default function Home() {
  const [upcoming, setUpcoming] = useState<Hackathon[]>([]);
  const [past, setPast] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const [upcomingRes, pastRes] = await Promise.all([
        fetch("/api/hackathons?status=upcoming"),
        fetch("/api/hackathons?status=past"),
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

  const { uniqueLocations, uniqueTopics } = useMemo(() => {
    const allHackathons = [...upcoming, ...past];

    // Genera le location uniche da city + country_code invece di location
    const locations = Array.from(
      new Set(
        allHackathons
          .map((h) => europeanCountries.formatLocation(h.city, h.country_code))
          .filter((loc): loc is string => Boolean(loc)),
      ),
    );
    const topics = Array.from(
      new Set(allHackathons.flatMap((h) => h.topics || [])),
    );

    return {
      uniqueLocations: locations.sort(),
      uniqueTopics: topics.sort(),
    };
  }, [upcoming, past]);

  return (
    <FilterProvider>
      <div className="flex min-h-screen">
        <Sidebar
          uniqueLocations={uniqueLocations}
          uniqueTopics={uniqueTopics}
        />
        <main className="ml-16 flex-1 p-8 md:ml-60">
          <h1 className="mb-3 text-3xl font-bold">Euro Hackathons</h1>
          <p className="text-muted-foreground">
            Your comprehensive list of hackathons happening across Europe
          </p>
          <Separator className="my-6" />
          <HackathonList upcoming={upcoming} past={past} loading={loading} />
        </main>
      </div>
    </FilterProvider>
  );
}
