import Background from "@/components/Background";
import UnderlinedText from "@/components/UnderlinedText";
import Featured from "@/components/Featured";
import AddDialog from "@/components/AddDialog";

function Heading() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
        Find your next <UnderlinedText>hackathon</UnderlinedText> 🇪🇺🚀
      </h1>
    </div>
  );
}

function Description() {
  return (
    <>
      <p className="text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8">
        The best hackathons in{" "}
        <span className="text-foreground font-bold">Europe</span>, all in one
        place. Discover events, connect with other participants, and showcase
        your skills.
      </p>
      <p className="text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8">
        If you know of any upcoming hackathons that are not listed, feel free to
        add them to our platform. Your{" "}
        <UnderlinedText>contributions</UnderlinedText> help us keep the
        community informed and engaged.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <AddDialog />
      </div>
    </>
  );
}

export default function Hero() {
  return (
    <Background>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <Featured />
        <Heading />
        <Description />
      </div>
    </Background>
  );
}
