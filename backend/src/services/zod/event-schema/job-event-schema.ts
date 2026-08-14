import { z } from "zod";

export const createJobEventSchema = z.object({
  event_type: z.enum(["JOB_FAIR", "JOB_DRIVE"]),

  event_name: z
    .string()
    .min(1, "Event name is required")
    .max(255),

  event_date: z.coerce.date(),

  event_time: z.string().min(1, "Event time is required"),

  address: z
    .string()
    .min(1, "Address is required"),

  google_map_link: z
    .string()
    .url("Invalid Google Maps URL")
    .optional(),

  description: z
    .string()
    .optional()
});

export const updateJobEventSchema = z.object({
  event_type: z
    .enum(["JOB_FAIR", "JOB_DRIVE"])
    .optional(),

  event_name: z
    .string()
    .min(1, "Event name is required")
    .max(255)
    .optional(),

  event_date: z
    .coerce
    .date()
    .optional(),

  event_time: z
    .string()
    .min(1, "Event time is required")
    .optional(),

  address: z
    .string()
    .min(1, "Address is required")
    .optional(),

  google_map_link: z
    .string()
    .url("Invalid Google Maps URL")
    .optional(),

  description: z
    .string()
    .optional(),
});


