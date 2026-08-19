import { z } from "zod";

/**
 * Instructor edit-profile schema.
 *
 * Only allows updating the permitted fields from PersonalInformation:
 *  - first_name (optional if present)
 *  - last_name (optional if present)
 *  - gender (optional, string, max 10 chars)
 *  - date_of_birth (optional, ISO date YYYY-MM-DD)
 *  - blood_group (optional, max 5 chars)
 *  - highest_qualification (optional, max 100 chars)
 *
 * All fields optional for PATCH behavior — send only what you want to change.
 * This works as a true PATCH: send only first_name, only gender, or any combination.
 */
export const editInstructorProfileSchema = z
    .object({
        first_name: z
            .string()
            .trim()
            .min(1, "First name must not be empty")
            .max(100, "First name must not exceed 100 characters")
            .optional(),

        last_name: z
            .string()
            .trim()
            .min(1, "Last name must not be empty")
            .max(100, "Last name must not exceed 100 characters")
            .optional(),

        gender: z
            .string()
            .trim()
            .max(10, "Gender must not exceed 10 characters")
            .optional(),

        date_of_birth: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .optional(),

        blood_group: z
            .string()
            .trim()
            .max(5, "Blood group must not exceed 5 characters")
            .optional(),

        highest_qualification: z
            .string()
            .trim()
            .max(100, "Highest qualification must not exceed 100 characters")
            .optional(),

        contact_number: z
            .string()
            .trim()
            .optional(),

        emergency_contact: z
            .string()
            .trim()
            .optional(),
    })
    .partial();