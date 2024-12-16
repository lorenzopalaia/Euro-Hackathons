export type Hackathon = {
  id?: number;
  name: string;
  mode: "onsite" | "online" | "hybrid";
  start_date: string;
  end_date: string;
  country: string;
  city: string;
  link: string;
  prize?: number;
  participants?: number;
  sponsor?: string;
  topic?: string;
  featured: boolean;
  approved: boolean;
};
