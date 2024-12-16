"use client";

import HackathonCard from "@/components/HackathonCard";

import useHackathons from "@/hooks/useHackathons";

import {
  getApproved,
  getUpcoming,
  getPast,
  getEstimated,
} from "@/utils/hackathons";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HackathonsList() {
  const { hackathons, isLoading } = useHackathons();
  const approved = getApproved(hackathons);
  const upcoming = getUpcoming(approved);
  const past = getPast(approved);
  const estimated = getEstimated(approved);

  return (
    <section>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Upcoming Hackathons</h2>
              <p className="text-muted-foreground">
                Check out the upcoming hackathons you can participate in.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <HackathonCard
              hackathons={upcoming}
              type="upcoming"
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Past Hackathons</h2>
              <p className="text-muted-foreground">
                Browse through the hackathons that have already taken place.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <HackathonCard
              hackathons={past}
              type="past"
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl font-bold">Future Estimations</h2>
              <p className="text-muted-foreground">
                Take a look at the future hackathons that are yet to be
                announced.
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <HackathonCard
              hackathons={estimated}
              type="future"
              isLoading={isLoading}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
