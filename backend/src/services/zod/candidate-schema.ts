import { z } from "zod";

export const candidateSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),

  email_id: z
    .string()
    .email("Invalid email address"),

  contact_number: z
    .string()
    .regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),

  gender: z
    .enum(["Male", "Female", "Other"], {
      error: "Gender must be Male, Female, or Other",
    }),

  date_of_birth: z
    .coerce
    .date({
      error: "Invalid date of birth",
    }),

  education: z
    .string()
    .min(2, "Education is required")
    .max(100, "Education is too long"),

  center_name: z
    .string()
    .min(2, "Center name is required")
    .max(100, "Center name is too long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export type CandidateInput = z.infer<typeof candidateSchema>;