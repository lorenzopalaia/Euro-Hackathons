import { createClient } from "@/utils/supabase/server";
import { DiscordClient } from "@/utils/discord";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    id,
    name,
    mode,
    prize,
    participants,
    country,
    city,
    sponsor,
    start_date,
    end_date,
    topic,
    featured,
    link,
    approved,
  } = await req.json();

  const supabase = await createClient();

  const discord = new DiscordClient();

  const { error } = await supabase
    .from("hackathons")
    .update({
      name,
      mode,
      prize,
      participants,
      country,
      city,
      sponsor,
      start_date,
      end_date,
      topic,
      featured,
      link,
      approved,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const embed = {
    title: approved
      ? `🚀 Hackathon approved: ${name}`
      : `🚀 Hackathon updated: ${name}`,
    description: `🌍 Location: ${city}, ${country}\n📅 Date: ${start_date} - ${end_date}`,
    fields: [
      { name: "Approved", value: approved ? "Yes" : "No", inline: true },
      { name: "Featured", value: featured ? "Yes" : "No", inline: true },
      { name: "Mode", value: mode },
      { name: "Link", value: link },
    ],
    color: 0xd25d7c,
  };

  await discord.sendEmbed(embed);

  return NextResponse.json({ message: "Hackathon updated successfully" });
}
