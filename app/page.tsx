"use client";

import HackathonList from "@/components/hackathon-list";
import Sidebar from "@/components/sidebar";
import { useEffect, useState, useMemo } from "react";
import { Hackathon } from "@/lib/database.types";

export default function Home() {
  const [upcoming, setUpcoming] = useState<Hackathon[]>([]);
  const [past, setPast] = useState<Hackathon[]>([]);

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
    }
  };

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

  return (
    <div className="flex min-h-screen">
      <Sidebar uniqueLocations={uniqueLocations} uniqueTopics={uniqueTopics} />
      <main className="flex-1 p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-3">Euro Hackathons</h1>
          <p className="text-muted-foreground">
            Your comprehensive list of hackathons happening across Europe
          </p>
        </div>
        <HackathonList />
      </main>
    </div>
  );
}
