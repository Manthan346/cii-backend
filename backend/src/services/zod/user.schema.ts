import { z } from "zod";

export const candidateSchema = z.object({
  candidate_name: z
    .string()
    .min(2, "Candidate name must be at least 2 characters")
    .max(100, "Candidate name is too long"),

  email_id: z
    .email("Invalid email address"),

  contact_number: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),

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

  address: z
    .string()
    .min(5, "Address is required")
    .max(255, "Address is too long"),
});

export type CandidateSchemaType = z.infer<typeof candidateSchema>;
