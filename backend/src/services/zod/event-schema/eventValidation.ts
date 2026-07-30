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
  .optional(),

  event_mode: z.nativeEnum(event_mode),

  event_type: z.nativeEnum(event_type),

  target_type: z.nativeEnum(event_target_type),
})
.superRefine((data, ctx) => {
    if (data.event_mode === event_mode.ONLINE) {
      if (!data.event_link) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["event_link"],
          message: "Meeting link is required for online events",
        });
      }
    }

    if (data.event_mode === event_mode.OFFLINE) {
      if (!data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["venue"],
          message: "Venue is required for offline events",
        });
      }
    }

    if (data.event_mode === event_mode.HYBRID) {
      if (!data.venue) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["venue"],
          message: "Venue is required for hybrid events",
        });
      }

      if (!data.event_link) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["event_link"],
          message: "Meeting link is required for hybrid events",
        });
      }

      if (data.target_type === event_target_type.BATCH) {
        if (!data.batch_ids || data.batch_ids.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["batch_ids"],
                message: "Please select at least one batch."
            });
        }
     }

     if (
          data.target_type !== event_target_type.BATCH &&
          data.batch_ids &&
          data.batch_ids.length > 0
      ) {
          ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["batch_ids"],
              message: "Batch selection is only allowed when target type is BATCH."
          });
      }
    }
  });



export const updateEventSchema = createEventSchema;