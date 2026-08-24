import { z } from "zod";

export const createInstructorSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name must not exceed 100 characters"),

    last_name: z
        .string()
        .trim()
        .max(100, "Last name must not exceed 100 characters")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email must not exceed 255 characters"),

    phone_no: z
        .string()
        .regex(
            /^[0-9]{10}$/,
            "Phone number must be exactly 10 digits"
        ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),

    gender: z
        .string()
        .trim()
        .max(10, "Gender must not exceed 10 characters")
        .optional(),

    date_of_birth: z
        .string()
        .optional(),

    specialization: z
        .string()
        .trim()
        .max(255, "Specialization must not exceed 255 characters")
        .optional(),

    experience_years: z
        .number()
        .int()
        .min(0, "Experience cannot be negative")
        .optional(),

    company_id: z
        .string()
        .uuid("Invalid company ID"),
});