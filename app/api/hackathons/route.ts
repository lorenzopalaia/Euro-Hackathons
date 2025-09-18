import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<
  string,
  { count: number; lastReset: number; burst: number; lastBurst: number }
>();

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const hourWindow = 60 * 60 * 1000; // 1 hour
  const minuteWindow = 60 * 1000; // 1 minute

  const current = rateLimitMap.get(ip) || {
    count: 0,
    lastReset: now,
    burst: 0,
    lastBurst: now,
  };

  // Reset hourly counter
  if (now - current.lastReset >= hourWindow) {
    current.count = 0;
    current.lastReset = now;
  }

  // Reset burst counter
  if (now - current.lastBurst >= minuteWindow) {
    current.burst = 0;
    current.lastBurst = now;
  }

  // Check limits
  if (current.count >= 100) {
    return { allowed: false, resetTime: current.lastReset + hourWindow };
  }

  if (current.burst >= 10) {
    return { allowed: false, resetTime: current.lastBurst + minuteWindow };
  }

  // Increment counters
  current.count++;
  current.burst++;
  rateLimitMap.set(ip, current);

  return { allowed: true };
}

export async function GET(request: Request) {
  const ip = getRateLimitKey(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (rateLimit.resetTime! - Date.now()) / 1000,
          ).toString(),
        },
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "upcoming";

  try {
    const query = supabase
      .from("hackathons")
      .select(
        "id, name, city, country_code, date_start, date_end, topics, notes, url, status,is_new",
      )
      .eq("status", status)
      .order("date_start", { ascending: status === "upcoming" });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(
      {
        data,
      },
      {
        headers: {
          // Cache for 5 minutes, serve stale for up to 10 minutes while revalidating
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
          // CDN specific caching
          "CDN-Cache-Control": "max-age=300",
          "Vercel-CDN-Cache-Control": "max-age=300",
          // Add ETag for conditional requests
          ETag: `"hackathons-${status}-${Date.now()}"`,
          // Vary by status parameter
          Vary: "Accept, Authorization",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
