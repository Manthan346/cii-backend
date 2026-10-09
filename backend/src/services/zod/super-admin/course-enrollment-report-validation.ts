import { z } from "zod";

export const courseEnrollmentReportQuerySchema = z.object({
    center_id: z.string().uuid("Invalid center ID format").optional().nullable(),
    from: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "from must be in MM/YYYY format (e.g., 01/2026)"),
    to: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, "to must be in MM/YYYY format (e.g., 12/2026)"),
}).refine(
    (data) => {
        const [fromMonth, fromYear] = data.from.split("/").map(Number);
        const [toMonth, toYear] = data.to.split("/").map(Number);
        const from = new Date(fromYear, fromMonth - 1, 1);
        const to = new Date(toYear, toMonth, 0, 23, 59, 59, 999);
        return from <= to;
    },
    { message: "from date must be before or equal to to date" }
);

export type CourseEnrollmentReportQuery = z.infer<typeof courseEnrollmentReportQuerySchema>;