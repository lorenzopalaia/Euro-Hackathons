import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "upcoming";

  try {
    const query = supabase
      .from("hackathons")
      .select(
        "id, name, location, city, country_code, date_start, date_end, topics, notes, url, status"
      )
      .eq("status", status)
      .order("date_start", { ascending: status === "upcoming" });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
