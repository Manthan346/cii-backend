import { z } from "zod";

/**
 * Edit-profile schema for a mobilizer.
 *
 * Mobilizer can ONLY edit his name (first + last) and mobile number.
 * Everything else (designation, email, center, unique id, password) is
 * intentionally NOT here — anything not in this schema cannot be written
 * because the controller only reads these keys.
 *
 * All fields are optional so this works as a true PATCH: the mobilizer can
 * update only the mobile, only the last name, or all three at once.
 * `partial` is not used so we can give each field its own message and so
 * the controller can detect "nothing to update" cleanly.
 */
export const editMobilizerProfileSchema = z
    .object({
        first_name: z
            .string()
            .trim()
            .min(1, "First name must not be empty")
            .max(100, "First name must not exceed 100 characters"),

        last_name: z
            .string()
            .trim()
            .min(1, "Last name must not be empty")
            .max(100, "Last name must not exceed 100 characters"),

        mobile_number: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Provide at least one field to update: first_name, last_name, or mobile_number",
    });
