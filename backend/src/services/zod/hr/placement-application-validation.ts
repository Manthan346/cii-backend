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