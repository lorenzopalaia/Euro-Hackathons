"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Hackathon } from "@/types";

export default function useHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHackathons = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase.from("hackathons").select("*");

      if (error) {
        console.error("Error fetching hackathons", error);
      } else {
        const hackathons = data.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        );

        setHackathons(hackathons);
      }
      setIsLoading(false);
    };

    fetchHackathons();
  }, []);

  return {
    hackathons,
    setHackathons,
    isLoading,
  };
}
