import { z } from "zod";

export const createCenterSchema = z.object({
    center_name: z
        .string()
        .min(1, "Center name is required")
        .max(255, "Center name cannot exceed 255 characters"),

    center_address: z
        .string()
        .min(1, "Center address is required"),

    center_email: z
        .string()
        .email("Invalid center email")
        .max(255, "Center email cannot exceed 255 characters"),

    center_contact: z
        .string()
        .min(10, "Center contact must be at least 10 digits")
        .max(15, "Center contact cannot exceed 15 digits")
        .regex(/^\d+$/, "Center contact must contain only digits"),

    center_code: z
        .string()
        .max(6, "Center code cannot exceed 6 characters")
        .optional()
        .nullable(),

    city_name: z
        .string()
        .optional()
        .nullable(),
});