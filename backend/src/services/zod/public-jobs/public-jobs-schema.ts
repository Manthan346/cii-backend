import { z } from "zod";

export const publicJobPostingQuerySchema = z
    .object({

        limit: z
            .coerce
            .number()
            .int("Limit must be an integer")
            .min(1, "Limit must be at least 1")
            .max(50, "Limit cannot exceed 50")
            .default(20),

        cursor: z
            .string()
            .optional(),

        search: z
            .string()
            .trim()
            .min(1, "Search cannot be empty")
            .max(100, "Search cannot exceed 100 characters")
            .optional(),

        salary_min: z
            .coerce
            .number()
            .int("Minimum salary must be an integer")
            .nonnegative("Minimum salary cannot be negative")
            .optional(),

        salary_max: z
            .coerce
            .number()
            .int("Maximum salary must be an integer")
            .nonnegative("Maximum salary cannot be negative")
            .optional(),

        location: z
            .string()
            .trim()
            .max(255, "Location cannot exceed 255 characters")
            .optional(),

        work_mode: z
            .enum(["online", "offline", "hybrid"])
            .optional(),

        sector: z
            .string()
            .trim()
            .max(255, "Sector cannot exceed 255 characters")
            .optional()
    })
    .refine(
        (data) => {
            if (
                data.salary_min !== undefined &&
                data.salary_max !== undefined
            ) {
                return data.salary_max >= data.salary_min;
            }

            return true;
        },
        {
            message:
                "Maximum salary must be greater than or equal to minimum salary",

            path: ["salary_max"]
        }
    );