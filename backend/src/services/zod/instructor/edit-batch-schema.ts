import { z } from "zod";

export const updateBatchSchema = z
    .object({
        batch_name: z
            .string()
            .min(3, "Batch name must be at least 3 characters")
            .optional(),

        batch_code: z
            .string()
            .min(2, "Batch code must be at least 2 characters")
            .optional(),

        batch_desc: z
            .string()
            .min(1, "Batch description cannot be empty")
            .optional(),

        batch_start_date: z.coerce.date().optional(),

        batch_end_date: z.coerce.date().optional(),

        max_candidates: z
            .number()
            .int()
            .positive("Maximum candidates must be greater than 0")
            .optional(),

        batch_type: z
            .enum(["ACADEMIC", "WORKSHOP", "UPSKILLING", "SEMINAR"])
            .optional(),

        batch_status: z
            .enum(["ACTIVE", "INACTIVE", "COMPLETED", "CANCELLED"])
            .optional(),
    })
    .refine(
        (data) => {
            if (data.batch_start_date && data.batch_end_date) {
                return data.batch_end_date > data.batch_start_date;
            }

            return true;
        },
        {
            message: "Batch end date must be after the start date.",
            path: ["batch_end_date"],
        }
    );