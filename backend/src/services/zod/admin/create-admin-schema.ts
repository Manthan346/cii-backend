import { z } from "zod";

export const createAdminSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email must not exceed 255 characters"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;