import { z } from "zod";

export const downloadSuperAdminEnrollmentReportQuerySchema = z.object({
    center_id: z.string().uuid("Invalid center ID format").optional().nullable(),
    from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
    to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
});

export type DownloadSuperAdminEnrollmentReportQuery = z.infer<typeof downloadSuperAdminEnrollmentReportQuerySchema>;