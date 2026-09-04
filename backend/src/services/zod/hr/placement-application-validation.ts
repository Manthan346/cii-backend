import { z } from "zod";

export const createPlacementApplicationSchema = z.object({
    applicant_name: z
        .string()
        .trim()
        .min(1, "Applicant name is required")
        .max(255, "Applicant name cannot exceed 255 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email cannot exceed 255 characters"),

    contact_no: z
        .string()
        .trim()
        .min(10, "Contact number must be at least 10 characters")
        .max(20, "Contact number cannot exceed 20 characters"),

    resume: z
        .string()
        .trim()
        .url("Invalid resume URL"),

    graduation_year: z
        .coerce
        .number()
        .int("Graduation year must be a valid year")
        .positive("Graduation year must be a positive number"),

    highest_qualification: z
        .string()
        .trim()
        .min(1, "Highest qualification is required")
        .max(
            255,
            "Highest qualification cannot exceed 255 characters"
        ),

    institute_name: z
        .string()
        .trim()
        .min(1, "Institute name is required")
        .max(255, "Institute name cannot exceed 255 characters"),

    cgpa: z
        .coerce
        .number()
        .min(0, "CGPA cannot be negative")
        .max(10, "CGPA cannot exceed 10")
        .optional(),

    percentage: z
        .coerce
        .number()
        .min(0, "Percentage cannot be negative")
        .max(100, "Percentage cannot exceed 100")
        .optional(),

    source: z
        .string()
        .trim()
        .max(100, "Source cannot exceed 100 characters")
        .optional(),
});

export const updateApplicationStatusSchema = z.object({
    application_status: z.enum([
        "SCREENING",
        "SHORTLISTED",
        "INTERVIEW",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN",
    ]),
});