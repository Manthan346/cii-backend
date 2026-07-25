import { z } from "zod";

export const createBatchSchema = z
  .object({
    batch_name: z
      .string()
      .trim()
      .min(3, "Batch name must be at least 3 characters")
      .max(100, "Batch name cannot exceed 100 characters"),

    batch_code: z
      .string()
      .trim()
      .min(2, "Batch code is required")
      .max(50, "Batch code cannot exceed 50 characters"),

    batch_desc: z
      .string()
      .trim()
      .min(5, "Batch description must be at least 5 characters")
      .max(500, "Batch description cannot exceed 500 characters"),

    course_id: z.uuid("Invalid course ID"),

    batch_start_date: z.coerce.date(),

    batch_end_date: z.coerce.date(),

    max_candidates: z.coerce
      .number()
      .int()
      .positive("Maximum candidates must be greater than 0"),

    batch_type: z.enum([
      "ACADEMIC",
      "WORKSHOP",
      "UPSKILLING",
      "SEMINAR",
    ]),

    b_status: z.enum([
      "UPCOMING",
      "ACTIVE",
      "INACTIVE",
      "COMPLETED",
    ]),
  })
  .refine(
    (data) => data.batch_end_date > data.batch_start_date,
    {
      path: ["batch_end_date"],
      message: "Batch end date must be after batch start date",
    }
  );


export type CreateBatchInput = z.infer<typeof createBatchSchema>;