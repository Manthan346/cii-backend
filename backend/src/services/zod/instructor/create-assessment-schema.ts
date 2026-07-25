import { z } from "zod";
import { assessment_type } from "../../../generated/prisma/enums";

export const createAssessmentSchema = z.object({

    batch_id: z
        .string()
        .uuid("Invalid batch ID."),

    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters.")
        .max(150, "Title cannot exceed 150 characters."),

    assessment_desc: z
        .string()
        .trim()
        .min(5, "Description must be at least 5 characters.")
        .max(1000, "Description cannot exceed 1000 characters."),

    assessment_type: z.nativeEnum(assessment_type),

    assessment_date: z
        .string()
        .date("Invalid assessment date."),

    questions: z
        .number()
        .int()
        .positive("Questions must be greater than 0."),

    assessment_duration: z
        .number()
        .int()
        .positive("Duration must be greater than 0 minutes."),

    assessment_link: z
    .string()
    .url("Invalid assessment link.")
    .optional(),

});