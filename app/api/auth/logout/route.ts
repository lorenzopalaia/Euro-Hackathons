import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
    return NextResponse.redirect("/error");
  }

  redirect("/");
  return NextResponse.redirect("/");
}
