import { z } from "zod";

export const createPlacementSchema = z.object({
    vacancy: z
        .number()
        .int("Vacancy must be an integer")
        .positive("Vacancy must be greater than 0"),

    location: z
        .string()
        .trim()
        .min(1, "Location is required")
        .max(255, "Location cannot exceed 255 characters"),

    job_role: z
        .string()
        .trim()
        .min(1, "Job role is required")
        .max(255, "Job role cannot exceed 255 characters"),

    job_description: z
        .string()
        .trim()
        .optional(),

    salary: z
        .string()
        .trim()
        .max(100, "Salary cannot exceed 100 characters")
        .optional(),

    employment_type: z
        .string()
        .trim()
        .max(100, "Employment type cannot exceed 100 characters")
        .optional(),

    work_mode: z
    .enum(["online", "offline", "hybrid"])
    .optional(),

    eligible_qualification: z
        .string()
        .trim()
        .optional(),

    eligible_percentage_cgpa: z
        .string()
        .trim()
        .optional(),

    last_date_to_apply: z
        .string()
        .refine(
            (date) => !isNaN(Date.parse(date)),
            "Invalid application deadline"
        ),
});