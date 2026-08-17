import { z } from "zod";

export const createMobilizerSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name must not exceed 100 characters"),

    last_name: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name must not exceed 100 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email must not exceed 255 characters"),

    phone_no: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    designation: z
        .string()
        .trim()
        .max(100, "Designation must not exceed 100 characters")
        .optional(),
});