import { z } from "zod";

export const updateAdminProfileSchema = z
    .object({
        admin_first_name: z
            .string()
            .trim()
            .min(1, "First name is required.")
            .max(100, "First name must not exceed 100 characters.")
            .optional(),

        admin_last_name: z
            .string()
            .trim()
            .max(100, "Last name must not exceed 100 characters.")
            .optional(),

        blood_group: z
            .string()
            .trim()
            .regex(
                /^(A|B|AB|O)[+-]$/,
                "Invalid blood group."
            )
            .optional(),

        admin_phone_no: z
            .string()
            .trim()
            .regex(
                /^[6-9]\d{9}$/,
                "Phone number must be a valid 10-digit Indian mobile number."
            )
            .optional(),

        date_of_birth: z
            .string()
            .trim()
            .regex(
                /^\d{4}-\d{2}-\d{2}$/,
                "Date of birth must be in YYYY-MM-DD format."
            )
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required to update the profile."
        }
    );

export type UpdateAdminProfileInput = z.infer<
    typeof updateAdminProfileSchema
>;