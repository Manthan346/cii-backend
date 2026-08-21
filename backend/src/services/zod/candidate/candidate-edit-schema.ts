import { z } from "zod";

/**
 * Candidate edit-profile schema.
 *
 * Only allows updating the permitted fields:
 *  - first_name (optional if present)
 *  - last_name (optional if present)
 *  - gender (optional, string)
 *  - date_of_birth (optional, ISO date string)
 *  - blood_group (optional)
 *  - emergency_contact_no (optional, 10-digit phone)
 *  - contact_number (optional, 10-digit phone, @unique in DB)
 *  - highest_qualification (optional)
 *  - candidate_current_address (optional)
 *  - candidate_permanent_address (optional)
 *  - profile_photo (optional, Cloudinary URL from upload middleware)
 *
 * All fields optional for PATCH behavior — only send what you want to change.
 * This works as a true PATCH: send only profile_photo, only first_name,
 * or any combination. No "at least one field required" check.
 */
export const editCandidateProfileSchema = z
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

        emergency_contact_no: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Emergency contact no must be exactly 10 digits")
            .optional(),

        contact_number: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits")
            .optional(),

        highest_qualification: z
            .string()
            .trim()
            .max(100, "Highest qualification must not exceed 100 characters")
            .optional(),

        candidate_current_address: z
            .string()
            .trim()
            .max(200, "Current address must not exceed 200 characters")
            .optional(),

        candidate_permanent_address: z
            .string()
            .trim()
            .max(200, "Permanent address must not exceed 200 characters")
            .optional(),

        // Cloudinary URL from upload middleware
        profile_photo: z
            .string()
            .url("Profile photo must be a valid URL")
            .optional(),
    })
    .partial();