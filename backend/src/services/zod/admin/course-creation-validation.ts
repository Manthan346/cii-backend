import { z } from "zod";

export const createCourseSchema = z.object({
    company_id: z.uuid(),

    course_name: z
        .string()
        .trim()
        .min(3, "Course name is required.")
        .max(100, "Course name must not exceed 100 characters."),

    course_desc: z
        .string()
        .trim()
        .min(10, "Course description must be at least 10 characters."),

    course_duration: z
        .string()
        .trim()
        .min(1, "Course duration is required.")
        .max(100, "Course duration must not exceed 100 characters."),

    course_mode: z.enum(["online", "offline", "hybrid"]),
});