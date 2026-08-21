import { z } from "zod";

/**
 * Mobilizer enroll candidate schema.
 *
 * Mobilizer can enroll a candidate by providing:
 *  - candidate details: first_name, last_name, contact_number, gender, date_of_birth, blood_group, email (optional)
 *  - course_id to select batches from
 *  - batch_id to enroll into
 *  - enrollment_date (optional, defaults to today)
 *
 * Identity comes from token (req.mobilizer.mobilizer_id and center_id), never from body.
 * Center isolation: candidate will be created in mobilizer's center only.
 */
export const mobilizerEnrollCandidateSchema = z
    .object({
        // Candidate personal details
        first_name: z
            .string()
            .trim()
            .min(1, "First name must not be empty")
            .max(100, "First name must not exceed 100 characters"),

        last_name: z
            .string()
            .trim()
            .max(100, "Last name must not exceed 100 characters")
            .optional(),

        contact_number: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

        // Email is required for login credentials
        email: z
            .string()
            .email("Invalid email format")
            .min(1, "Email is required"),

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

        // Course and batch selection
        course_id: z
            .uuid("Invalid course ID format"),

        batch_id: z
            .uuid("Invalid batch ID format"),

        // Optional enrollment date
        enrollment_date: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Enrollment date must be in YYYY-MM-DD format")
            .optional(),
    })
    .partial();