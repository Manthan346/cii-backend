import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  centerId: z
    .uuid("Invalid center ID"),

  role: z.enum([
    "candidate",
    "faculty",
    // "admin",
    // "superadmin",
  ], {
    error: "Invalid user role",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;