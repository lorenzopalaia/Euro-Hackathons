import { Hackathon } from "@/types";

export function getUnapproved(hackathons: Hackathon[]) {
  return hackathons.filter((hackathon) => !hackathon.approved);
}

export function getApproved(hackathons: Hackathon[]) {
  return hackathons.filter((hackathon) => hackathon.approved);
}

export function getUpcoming(hackathons: Hackathon[]) {
  return hackathons.filter(
    (hackathon) => new Date(hackathon.start_date) > new Date(),
  );
}

export function getPast(hackathons: Hackathon[]) {
  return hackathons.filter(
    (hackathon) => new Date(hackathon.start_date) < new Date(),
  );
}

export function getEstimated(hackathons: Hackathon[]) {
  return hackathons
    .filter((hackathon) => {
      const today = new Date();
      const start_date = new Date(hackathon.start_date);
      const timeDiff = today.getTime() - start_date.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return daysDiff < 365;
    })
    .map((hackathon) => {
      const today = new Date();
      const futureDate = new Date(hackathon.start_date);
      futureDate.setFullYear(today.getFullYear());

      if (futureDate < today) {
        futureDate.setFullYear(today.getFullYear() + 1);
      }

      return {
        ...hackathon,
        start_date: futureDate.toISOString().split("T")[0],
        end_date: new Date(
          futureDate.getTime() +
            (new Date(hackathon.end_date).getTime() -
              new Date(hackathon.start_date).getTime()),
        )
          .toISOString()
          .split("T")[0],
      };
    });
}
