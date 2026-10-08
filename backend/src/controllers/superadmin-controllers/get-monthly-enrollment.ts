import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getMonthlyEnrollmentData = asyncHandler(
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
        const fromStr = from as string;
        const toStr = to as string;

        // Parse MM/YYYY format
        const [fromMonth, fromYear] = fromStr.split("/").map(Number);
        const [toMonth, toYear] = toStr.split("/").map(Number);

        // Validate month/year ranges
        if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
            throw new ApiError(400, "Month must be between 1 and 12");
        }
        if (fromYear < 2000 || fromYear > 2100 || toYear < 2000 || toYear > 2100) {
            throw new ApiError(400, "Year must be between 2020 and 2100");
        }

        // Build date range: from start of from_month to end of to_month
        const startDate = new Date(fromYear, fromMonth - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(toYear, toMonth, 0, 23, 59, 59, 999); // last day of to_month

        if (startDate > endDate) {
            throw new ApiError(400, "from date must be before or equal to to date");
        }

        // If center_id provided, validate it exists
        if (centerId) {
            const center = await prisma.center_details.findUnique({
                where: { center_id: centerId },
                select: { center_name: true },
            });
            if (!center) {
                throw new ApiError(404, "Center not found");
            }
        }

        // Build where clause for enrollments
        const enrollmentWhere: any = {
            enrollment_date: {
                gte: startDate,
                lte: endDate,
            },
            batch_details: {
                ...(centerId ? { center_id: centerId } : {}),
            },
        };

        // Fetch enrollments with center grouping
        const enrollments = await prisma.batch_enrollment.findMany({
            where: enrollmentWhere,
            select: {
                enrollment_id: true,
                enrollment_date: true,
                batch_details: {
                    select: {
                        center_details: {
                            select: {
                                center_id: true,
                                center_name: true,
                            },
                        },
                    },
                },
            },
        });

        // Group by center, year, month
        const groupedData: Record<string, { center_name: string; months: Record<string, number> }> = {};

        enrollments.forEach((enrollment) => {
            const center = enrollment.batch_details?.center_details;
            if (!center) return;

            const centerId = center.center_id;
            const centerName = center.center_name;
            const date = new Date(enrollment.enrollment_date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // 1-12
            const monthKey = `${year}-${month.toString().padStart(2, "0")}`;

            if (!groupedData[centerId]) {
                groupedData[centerId] = { center_name: centerName, months: {} };
            }
            groupedData[centerId].months[monthKey] = (groupedData[centerId].months[monthKey] || 0) + 1;
        });

        // Build response data with all months in range
        const monthsInRange: { year: number; month: number; monthKey: string; monthName: string }[] = [];
        for (let y = fromYear; y <= toYear; y++) {
            const startM = y === fromYear ? fromMonth : 1;
            const endM = y === toYear ? toMonth : 12;
            for (let m = startM; m <= endM; m++) {
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                monthsInRange.push({
                    year: y,
                    month: m,
                    monthKey: `${y}-${m.toString().padStart(2, "0")}`,
                    monthName: monthNames[m - 1]
                });
            }
        }

        // Format response
        const responseData = Object.entries(groupedData).map(([centerId, data]) => ({
            center_id: centerId,
            center_name: data.center_name,
            monthly_enrollment: monthsInRange.map(({ year, month, monthKey, monthName }) => ({
                year,
                month,
                month_name: monthName,
                enrollment_count: data.months[monthKey] || 0,
            })),
        }));

        return res.status(200).json(
            new ApiResponse(200, {
                period: {
                    from: { month: fromMonth, year: fromYear },
                    to: { month: toMonth, year: toYear },
                },
                centers: responseData,
            }, "Monthly enrollment data fetched successfully")
        );
    }
);