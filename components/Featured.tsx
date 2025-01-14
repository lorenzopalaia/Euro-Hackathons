import AnimatedGradientText from "@/components/ui/animated-gradient-text";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import DialogContent from "@/components/DialogContent";

import { ChevronRight } from "lucide-react";

export default function Featured({
  emoji = "🚀",
  text = "Help us by adding new hackathons",
}: {
  emoji?: string;
  text?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="hidden cursor-pointer sm:mb-8 sm:flex sm:justify-center">
          <AnimatedGradientText>
            {emoji} <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
            <span className="inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
              {text}
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </div>
      </DialogTrigger>
      <DialogContent />
    </Dialog>
  );
}
