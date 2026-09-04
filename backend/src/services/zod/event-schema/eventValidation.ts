import {
  event_type,
  event_mode,
  event_target_type,
  event_status_type,
} from "../../../generated/prisma/enums";
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

  event_start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid event start time"),

  event_end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid event end time"),

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

  event_status: z.nativeEnum(event_status_type).optional(),

  target_type: z.nativeEnum(event_target_type).optional().default(event_target_type.PUBLIC),
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

      if (data.target_type === event_target_type.PUBLIC) {
        if (data.batch_ids && data.batch_ids.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["batch_ids"],
            message: "PUBLIC events cannot be tied to specific batches."
          });
        }
      }
    }
  });



export const updateEventSchema = createEventSchema;

// ---- New schemas for Public Events (Mobilizer) ----

export const updatePublicEventSchema = z.object({
  event_title: z
    .string()
    .trim()
    .min(1, "Event title is required")
    .max(255, "Event title cannot exceed 255 characters")
    .optional(),

  event_description: z
    .string()
    .trim()
    .min(1, "Event description is required")
    .optional(),

  event_date: z
    .string()
    .refine(
      (date) => !isNaN(Date.parse(date)),
      "Invalid event date"
    )
    .optional(),

  event_start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid event start time")
    .optional(),

  event_end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid event end time")
    .optional(),

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

  event_mode: z.nativeEnum(event_mode).optional(),

  event_type: z.nativeEnum(event_type).optional(),

  event_status: z.enum(event_status_type).optional(),

  is_show: z.boolean().optional(),

  // Optional image upload field
  event_images: z
    .array(z.string().url("Invalid image URL"))
    .optional()
    .default([]),
}).superRefine((data, ctx) => {
  // If event_mode is ONLINE or HYBRID, event_link is required
  if ((data.event_mode === event_mode.ONLINE || data.event_mode === event_mode.HYBRID) && !data.event_link) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["event_link"],
      message: "Meeting link is required for online/hybrid events",
    });
  }
  // If event_mode is OFFLINE or HYBRID, venue is required
  if ((data.event_mode === event_mode.OFFLINE || data.event_mode === event_mode.HYBRID) && !data.venue) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["venue"],
      message: "Venue is required for offline/hybrid events",
    });
  }
});

export const getPublicEventsQuerySchema = z.object({
  event_type: z.nativeEnum(event_type).optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});