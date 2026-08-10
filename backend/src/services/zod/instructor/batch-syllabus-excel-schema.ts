import { z } from "zod";

export const syllabusRowSchema = z.object({
    topic_name: z
        .string()
        .trim()
        .min(1, "topic_name is required"),

    completion_date: z.coerce.date(
        "completion_date is invalid or missing"
    ),
});

export type SyllabusRow = z.infer<typeof syllabusRowSchema>;