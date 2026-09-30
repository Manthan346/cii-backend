import { z } from "zod";

export const getEnrollmentTrendQuerySchema = z.object({
    months: z.coerce.number().int().min(1).max(24).default(12), // last N months
    center_id: z.string().uuid("Invalid center ID format").optional().nullable(),
    course_id: z.string().uuid("Invalid course ID format").optional().nullable(),
    enrollment_status: z.enum(["ACTIVE", "DROPPED", "BLACKLIST", "INACTIVE"]).optional().nullable(),
    group_by: z.enum(["month", "week"]).default("month"),
});

export type GetEnrollmentTrendQuery = z.infer<typeof getEnrollmentTrendQuerySchema>;