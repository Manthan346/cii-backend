import { z } from "zod";

/**
 * Instructor guardian edit schema.
 *
 * Only allows updating permitted guardian, father, and mother fields.
 * Identity comes from instructor's token (req.instructor.instructor_id), never from body.
 *
 * All fields optional for PATCH behavior — send only what you want to change.
 * This works as a true PATCH: send only guardian_name, only father_name, or any combination.
 */
export const editInstructorGuardianSchema = z
    .object({
        // Guardian fields
        guardian_name: z
            .string()
            .trim()
            .max(100, "Guardian name must not exceed 100 characters")
            .optional(),

        guardian_relationship: z
            .string()
            .trim()
            .max(50, "Relationship must not exceed 50 characters")
            .optional(),

        guardian_blood_group: z
            .string()
            .trim()
            .max(5, "Blood group must not exceed 5 characters")
            .optional(),

        guardian_phone_no: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Guardian phone no must be exactly 10 digits")
            .optional(),

        guardian_occupation: z
            .string()
            .trim()
            .max(100, "Occupation must not exceed 100 characters")
            .optional(),

        guardian_address: z
            .string()
            .trim()
            .max(200, "Address must not exceed 200 characters")
            .optional(),

        guardian_dob: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .optional(),

        // Father fields
        father_name: z
            .string()
            .trim()
            .max(100, "Father name must not exceed 100 characters")
            .optional(),

        father_occupation: z
            .string()
            .trim()
            .max(100, "Father occupation must not exceed 100 characters")
            .optional(),

        father_phone_no: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Father phone no must be exactly 10 digits")
            .optional(),

        father_blood_group: z
            .string()
            .trim()
            .max(5, "Father blood group must not exceed 5 characters")
            .optional(),

        father_address: z
            .string()
            .trim()
            .max(200, "Father address must not exceed 200 characters")
            .optional(),

        father_dob: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .optional(),

        // Mother fields
        mother_name: z
            .string()
            .trim()
            .max(100, "Mother name must not exceed 100 characters")
            .optional(),

        mother_occupation: z
            .string()
            .trim()
            .max(100, "Mother occupation must not exceed 100 characters")
            .optional(),

        mother_phone_no: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Mother phone no must be exactly 10 digits")
            .optional(),

        mother_blood_group: z
            .string()
            .trim()
            .max(5, "Mother blood group must not exceed 5 characters")
            .optional(),

        mother_address: z
            .string()
            .trim()
            .max(200, "Mother address must not exceed 200 characters")
            .optional(),

        mother_dob: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .optional(),
    })
    .partial();