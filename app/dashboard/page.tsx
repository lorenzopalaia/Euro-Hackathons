import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import Header from "@/components/Header";

import HackathonsEditor from "@/components/HackathonsEditor";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <main className="container mx-auto mt-16 max-w-4xl space-y-16 px-4">
        <div>
          <h1 className="text-4xl font-bold">Welcome back,</h1>
          <p className="text-muted-foreground">{data.user.email}</p>
          <p className="mt-4">
            Here are the hackathons that need approval. You can see the status
            of each one below.
          </p>
        </div>
        <HackathonsEditor />
      </main>
    </>
  );
}
