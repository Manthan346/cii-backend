import { z } from "zod";

export const downloadSuperAdminEnrollmentReportQuerySchema = z.object({
    center_id: z.string().uuid("Invalid center ID format").optional().nullable(),
    from_month: z.coerce.number().int().min(1).max(12),
    from_year: z.coerce.number().int().min(2020).max(2100),
    to_month: z.coerce.number().int().min(1).max(12),
    to_year: z.coerce.number().int().min(2020).max(2100),
}).refine(
    (data) => {
        const from = new Date(data.from_year, data.from_month - 1, 1);
        const to = new Date(data.to_year, data.to_month, 0, 23, 59, 59, 999);
        return from <= to;
    },
    { message: "from_month/from_year must be before or equal to to_month/to_year" }
);

export type DownloadSuperAdminEnrollmentReportQuery = z.infer<typeof downloadSuperAdminEnrollmentReportQuerySchema>;