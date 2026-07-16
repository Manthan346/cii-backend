import { z } from "zod";

export const courseSchema = z.object({
  course_name: z
    .string()
    .min(2, "Course name must be at least 2 characters")
    .max(100, "Course name is too long"),

  course_desc: z
    .string()
    .min(10, "Course description must be at least 10 characters")
    .max(1000, "Course description is too long"),

  course_duration: z
    .string()
    .min(1, "Course duration is required")
    .max(50, "Course duration is too long"),

  company_id: z
    .number({
      error: "Company ID is required",
    })
    .int("Company ID must be an integer")
    .positive("Company ID must be positive"),

  course_type: z
    .enum(["Online", "Offline", "Hybrid"], {
      error: "Course type must be Online, Offline, or Hybrid",
    }),
});

export type CourseInput = z.infer<typeof courseSchema>;