import { z } from "zod";

export const createPlacementSchema = z.object({
    company_name: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Company name cannot exceed 255 characters"),

    sector: z
    .string()
    .trim()
    .min(1,"Sector field is required")
    .max(255,"Sector name cannot exceed 255 characters"),

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

    application_link: z
        .string()
        .trim()
        .url("Invalid application link")
        .optional(),

    last_date_to_apply: z
    .string()
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Last date to apply must be in YYYY-MM-DD format"
    ),

    experience:z
    .string()
    .trim()
    .min(1,"Experience required.")
    .max(255,"Experience cannot exceed 255 characters.")
});

export const updatePlacementSchema = createPlacementSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required to update",
        }
    );