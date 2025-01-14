import Hero from "@/components/Hero";
import HackathonsList from "@/components/HackathonsList";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-4xl space-y-16 px-4">
        <Hero />
        <HackathonsList />
      </main>
    </>
  );
}
