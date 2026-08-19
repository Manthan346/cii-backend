import { z } from "zod";

/**
 * Instructor edit address schema.
 *
 * Only allows updating the permitted address fields from CurrentInformation and PermanentInformation:
 *  - current_city (optional, string, max 100 chars)
 *  - current_state (optional, string, max 10 chars)
 *  - current_district (optional, string, max 100 chars)
 *  - current_taluka (optional, string, max 50 chars)
 *  - current_pincode (optional, string, max 10 chars)
 *  - current_address (optional, string, max 200 chars)
 *  - permanent_city (optional, string, max 100 chars)
 *  - permanent_state (optional, string, max 10 chars)
 *  - permanent_district (optional, string, max 100 chars)
 *  - permanent_taluka (optional, string, max 50 chars)
 *  - permanent_pincode (optional, string, max 10 chars)
 *  - permanent_address (optional, string, max 200 chars)
 *
 * All fields optional for PATCH behavior — send only what you want to change.
 * This works as a true PATCH: send only current_city, only permanent_address, or any combination.
 */
export const editInstructorAddressSchema = z
    .object({
        current_city: z
            .string()
            .trim()
            .max(100, "Current city must not exceed 100 characters")
            .optional(),

        current_state: z
            .string()
            .trim()
            .max(10, "Current state must not exceed 10 characters")
            .optional(),

        current_district: z
            .string()
            .trim()
            .max(100, "Current district must not exceed 100 characters")
            .optional(),

        current_taluka: z
            .string()
            .trim()
            .max(50, "Current taluka must not exceed 50 characters")
            .optional(),

        current_pincode: z
            .string()
            .trim()
            .max(10, "Current pincode must not exceed 10 characters")
            .optional(),

        current_address: z
            .string()
            .trim()
            .max(200, "Current address must not exceed 200 characters")
            .optional(),

        permanent_city: z
            .string()
            .trim()
            .max(100, "Permanent city must not exceed 100 characters")
            .optional(),

        permanent_state: z
            .string()
            .trim()
            .max(10, "Permanent state must not exceed 10 characters")
            .optional(),

        permanent_district: z
            .string()
            .trim()
            .max(100, "Permanent district must not exceed 100 characters")
            .optional(),

        permanent_taluka: z
            .string()
            .trim()
            .max(50, "Permanent taluka must not exceed 50 characters")
            .optional(),

        permanent_pincode: z
            .string()
            .trim()
            .max(10, "Permanent pincode must not exceed 10 characters")
            .optional(),

        permanent_address: z
            .string()
            .trim()
            .max(200, "Permanent address must not exceed 200 characters")
            .optional(),
    })
    .partial();