import { z } from "zod";

/**
 * Instructor edit academic schema.
 *
 * Only allows updating the permitted academic and experience fields:
 *  - education fields: highest_qualification, specialization, university, passing_year, additional_qualifications
 *  - experience fields: total_experience, previous_organization, role
 *
 * All fields optional for PATCH behavior — send only what you want to change.
 * This works as a true PATCH: send only highest_qualification, only total_experience, or any combination.
 */
export const editInstructorAcademicSchema = z
    .object({
        // Education fields
        highest_qualification: z
            .string()
            .trim()
            .max(100, "Highest qualification must not exceed 100 characters")
            .optional(),

        specialization: z
            .string()
            .trim()
            .max(100, "Specialization must not exceed 100 characters")
            .optional(),

        university: z
            .string()
            .trim()
            .max(100, "University must not exceed 100 characters")
            .optional(),

        passing_year: z
            .string()
            .trim()
            .max(10, "Passing year must not exceed 10 characters")
            .optional(),

        additional_qualifications: z
            .string()
            .trim()
            .max(200, "Additional qualifications must not exceed 200 characters")
            .optional(),

        // Experience fields
        total_experience: z
            .string()
            .trim()
            .max(50, "Total experience must not exceed 50 characters")
            .optional(),

        previous_organization: z
            .string()
            .trim()
            .max(200, "Previous organization must not exceed 200 characters")
            .optional(),

        role: z
            .string()
            .trim()
            .max(100, "Role must not exceed 100 characters")
            .optional(),
    })
    .partial();