import { z } from "zod";

export const createJobEventSchema = z.object({
  event_type: z.enum(["JOB_FAIR", "JOB_DRIVE"]),

  event_name: z
    .string()
    .min(1, "Event name is required")
    .max(255),

  event_date: z.coerce.date()
    .refine(
      (date) => {
        // Ensure event date is in the future (after today at midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      "Event date cannot be in the past. Please select a future date."
    ),

  event_start_time: z.string().min(1, "Event start time is required"),

  event_end_time: z.string().min(1, "Event end time is required"),

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
    .optional()
    .refine(
      (date) => {
        if (!date) return true; // Allow optional - will validate if provided
        // Ensure event date is in the future (after today at midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      "Event date cannot be in the past. Please select a future date."
    ),

  event_start_time: z
    .string()
    .min(1, "Event start time is required")
    .optional(),

  event_end_time: z
    .string()
    .min(1, "Event end time is required")
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


