import { z } from "zod";

export const hackathonSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    mode: z.enum(["onsite", "online", "hybrid"], {
      required_error: "Mode is required",
    }),
    prize: z.number().positive().optional(),
    participants: z.number().positive().optional(),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    sponsor: z.string().optional(),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    topic: z
      .enum(["web", "mobile", "design", "hardware", "ai", "blockchain", "iot"])
      .optional(),
    link: z.string().url("Invalid URL format"),
    approved: z.boolean(),
    featured: z.boolean(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

export type HackathonFormData = z.infer<typeof hackathonSchema>;
