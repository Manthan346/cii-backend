import { event_type,event_mode,event_target_type} from "../../../generated/prisma/enums";
import { z } from "zod";
import { superRefine } from "zod";

export const createEventSchema = z.object({
  event_title: z
    .string()
    .trim()
    .min(1, "Event title is required")
    .max(255, "Event title cannot exceed 255 characters"),

  event_description: z
    .string()
    .trim()
    .min(1, "Event description is required"),

  event_date: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid event date"
    ),

  event_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid event time"),

  venue: z
    .string()
    .trim()
    .max(255)
    .optional(),

  event_link: z
  .string()
  .trim()
  .url("Invalid event link")
  .optional(),

  batch_ids: z
    .array(z.string().uuid("Invalid batch ID"))
    .min(1, "At least one batch must be selected"),
});



export const updateEventSchema = createEventSchema;