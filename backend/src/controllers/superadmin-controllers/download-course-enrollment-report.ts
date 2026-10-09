import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import ExcelJS from "exceljs";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
] as const;

export const downloadCourseEnrollmentReport = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {
        const { center_id, from, to } = req.query;

        // Validate required params
        if (!from || !to) {
            throw new ApiError(400, "from and to query parameters are required (format: MM/YYYY)");
        }

        if (Array.isArray(from) || Array.isArray(to) || (center_id && Array.isArray(center_id))) {
            throw new ApiError(400, "Query parameters must be single values");
        }

        const centerId = center_id as string | undefined;
        const [fromMonth, fromYear] = (from as string).split("/").map(Number);
        const [toMonth, toYear] = (to as string).split("/").map(Number);

        if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
            throw new ApiError(400, "Month must be between 1 and 12");
        }
        if (fromYear < 2020 || fromYear > 2100 || toYear < 2020 || toYear > 2100) {
            throw new ApiError(400, "Year must be between 2020 and 2100");
        }

        const startDate = new Date(fromYear, fromMonth - 1, 1);
        const endDate = new Date(toYear, toMonth, 0, 23, 59, 59, 999);

        if (startDate > endDate) {
            throw new ApiError(400, "from date must be before or equal to to date");
        }

        // Validate center if provided
        let centerName = "All Centers";
        if (centerId) {
            const center = await prisma.center_details.findUnique({
                where: { center_id: centerId },
                select: { center_name: true },
            });
            if (!center) throw new ApiError(404, "Center not found");
            centerName = center.center_name;
        }

        // --- Optimized: Use findMany with select (scalar fields only), then group in memory ---
        // Prisma groupBy doesn't support relation fields, so fetch minimal data and aggregate
        const enrollments = await prisma.batch_enrollment.findMany({
            where: {
                enrollment_date: { gte: startDate, lte: endDate },
                batch_details: centerId ? { center_id: centerId } : undefined,
            },
            select: {
                enrollment_id: true,
                enrollment_date: true,
                batch_details: {
                    select: {
                        course_id: true,
                        center_id: true,
                    },
                },
            },
        });

        // Build month keys in range (pre-compute once)
        const monthsInRange: { year: number; month: number; monthKey: string; monthName: string }[] = [];
        for (let y = fromYear; y <= toYear; y++) {
            const startM = y === fromYear ? fromMonth : 1;
            const endM = y === toYear ? toMonth : 12;
            for (let m = startM; m <= endM; m++) {
                monthsInRange.push({
                    year: y,
                    month: m,
                    monthKey: `${y}-${m.toString().padStart(2, "0")}`,
                    monthName: MONTH_NAMES[m - 1],
                });
            }
        }

        // Collect unique course/center IDs from results
        const courseIds = new Set<string>();
        const centerIds = new Set<string>();

        for (const e of enrollments) {
            if (e.batch_details?.course_id) courseIds.add(e.batch_details.course_id);
            if (e.batch_details?.center_id) centerIds.add(e.batch_details.center_id);
        }

        // Fetch names in parallel (only for IDs that exist in results)
        const [courses, centers] = await Promise.all([
            courseIds.size > 0 ? prisma.course_details.findMany({
                where: { course_id: { in: [...courseIds] } },
                select: { course_id: true, course_name: true },
            }) : Promise.resolve([]),
            centerIds.size > 0 ? prisma.center_details.findMany({
                where: { center_id: { in: [...centerIds] } },
                select: { center_id: true, center_name: true },
            }) : Promise.resolve([]),
        ]);

        const courseNameMap = new Map(courses.map(c => [c.course_id, c.course_name]));
        const centerNameMap = new Map(centers.map(c => [c.center_id, c.center_name]));

        // Map: courseId|centerId -> { course_name, center_name, months: Record<monthKey, count> }
        const dataMap = new Map<string, {
            course_name: string;
            center_name: string;
            months: Record<string, number>
        }>();

        for (const e of enrollments) {
            const courseId = e.batch_details?.course_id;
            const centerId_ = e.batch_details?.center_id;
            if (!courseId || !centerId_) continue;

            const date = new Date(e.enrollment_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

            const key = `${courseId}|${centerId_}`;
            if (!dataMap.has(key)) {
                dataMap.set(key, {
                    course_name: courseNameMap.get(courseId) || "Unknown",
                    center_name: centerNameMap.get(centerId_) || "Unknown",
                    months: {},
                });
            }
            dataMap.get(key)!.months[monthKey] = (dataMap.get(key)!.months[monthKey] || 0) + 1;
        }

        // --- Create Excel ---
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Course Enrollment Report");

        // Title
        const titleRow = worksheet.addRow([`Course-wise Enrollment Report - ${centerName}`]);
        titleRow.font = { bold: true, size: 16 };
        worksheet.mergeCells(titleRow.number, 1, titleRow.number, 6);

        // Period
        const periodRow = worksheet.addRow([`Period: ${from} to ${to}`]);
        periodRow.font = { italic: true };
        worksheet.mergeCells(periodRow.number, 1, periodRow.number, 6);

        worksheet.addRow([]);

        // Header
        const headerRow = worksheet.addRow([
            "Course", "Center", "Year", "Month", "Month Name", "Enrollment Count"
        ]);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
        headerRow.alignment = { vertical: "middle", horizontal: "center" };

        // Data rows
        if (dataMap.size === 0) {
            const noDataRow = worksheet.addRow(["No enrollment data found for the selected period"]);
            noDataRow.font = { italic: true };
            worksheet.mergeCells(noDataRow.number, 1, noDataRow.number, 6);
        } else {
            for (const [, data] of dataMap) {
                for (const monthInfo of monthsInRange) {
                    const count = data.months[monthInfo.monthKey] || 0;
                    worksheet.addRow([
                        data.course_name,
                        data.center_name,
                        monthInfo.year,
                        monthInfo.month,
                        monthInfo.monthName,
                        count,
                    ]);
                }
            }
        }

        // Column widths
        worksheet.getColumn(1).width = 35; // Course
        worksheet.getColumn(2).width = 30; // Center
        worksheet.getColumn(3).width = 10; // Year
        worksheet.getColumn(4).width = 10; // Month
        worksheet.getColumn(5).width = 15; // Month Name
        worksheet.getColumn(6).width = 18; // Enrollment Count

        // Filename
        const safeCenterName = centerName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
        const filename = `course-enrollment-report-${safeCenterName}-${from}-to-${to}.xlsx`;

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

        await workbook.xlsx.write(res);
        res.end();
    }
);