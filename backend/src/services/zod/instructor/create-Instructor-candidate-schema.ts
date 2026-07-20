import { z } from "zod";

export const createInstructorCandidateSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email_id: z
    .string()
    .trim()
    .email("Invalid email address"),

  contact_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid contact number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export type CreateInstructorCandidateInput = z.infer<typeof createInstructorCandidateSchema>;
