import { createClient } from "@/utils/supabase/server";
import { DiscordClient } from "@/utils/discord";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    id,
    name,
    mode,
    country,
    city,
    start_date,
    end_date,
    featured,
    link,
  } = await req.json();

  const supabase = await createClient();

  const discord = new DiscordClient();

  const { error } = await supabase.from("hackathons").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const embed = {
    title: `🚀 Hackathon deleted: ${name}`,
    description: `🌍 Location: ${city}, ${country}\n📅 Date: ${start_date} - ${end_date}`,
    fields: [
      { name: "Featured", value: featured ? "Yes" : "No", inline: true },
      { name: "Mode", value: mode },
      { name: "Link", value: link },
    ],
    color: 0xd25d7c,
  };

  await discord.sendEmbed(embed);

  return NextResponse.json({ message: "Hackathon deleted successfully" });
}
