import { z } from "zod";

export const createInstructorCandidateEnrollmentSchema = z.object({

  email_id: z
    .string()
    .trim()
    .email("Invalid email address"),

  batch_id: z
  .string()
  .uuid("Invalid batch Id")
});

export type CreateInstructorCandidateEnrollmentInput = z.infer<typeof createInstructorCandidateEnrollmentSchema>;