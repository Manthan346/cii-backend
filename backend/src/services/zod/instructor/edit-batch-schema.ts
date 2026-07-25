import { z } from "zod";

export const updateBatchSchema = z.object({
  batch_name: z.string().min(3, "Batch name must be at least 3 characters").optional(),

  batch_code: z.string().min(2, "Batch code is required").optional(),

  batch_desc: z.string().optional(),

  batch_start_date: z.coerce.date().optional(),

  batch_end_date: z.coerce.date().optional(),

  max_candidates: z
    .number()
    .int()
    .positive("Maximum candidates must be greater than 0")
    .optional(),

  batch_type: z.enum(["online", "offline", "hybrid"]).optional(), // Replace with your actual enum values

  batch_status: z
    .enum(["active", "inactive", "completed", "cancelled"]) // Replace with your actual enum values
    .optional(),
})
.refine(
  (data) => {
    if (data.batch_start_date && data.batch_end_date) {
      return data.batch_end_date >= data.batch_start_date;
    }
    return true;
  },
  {
    message: "Batch end date must be after the start date.",
    path: ["batch_end_date"],
  }
);