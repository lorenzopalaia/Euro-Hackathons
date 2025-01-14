import { createClient } from "@/utils/supabase/server";
import { DiscordClient } from "@/utils/discord";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
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
    link,
  } = await req.json();

  const supabase = await createClient();

  const discord = new DiscordClient();

  const { error } = await supabase.from("hackathons").insert([
    {
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
      link,
    },
  ]);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const embed = {
    title: `🚀 New Hackathon: ${name}`,
    description: `🌍 Location: ${city}, ${country}\n📅 Date: ${start_date} - ${end_date}`,
    fields: [{ name: "Approved", value: "No", inline: true }],
    color: 0xd25d7c,
  };

  await discord.sendEmbed(embed);

  return NextResponse.json({ message: "Hackathon added successfully" });
}
