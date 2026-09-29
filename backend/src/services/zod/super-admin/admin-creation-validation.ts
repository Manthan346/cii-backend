import { z } from "zod";

export const createAdminBySuperAdminSchema = z.object({
    first_name: z
        .string()
        .min(1, "First name is required")
        .max(100, "First name cannot exceed 100 characters"),

    last_name: z
        .string()
        .max(100, "Last name cannot exceed 100 characters")
        .optional()
        .nullable(),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email must not exceed 255 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters"),

    center_id: z
        .string()
        .uuid("Invalid center ID format"),
});

export type CreateAdminBySuperAdminInput = z.infer<typeof createAdminBySuperAdminSchema>;