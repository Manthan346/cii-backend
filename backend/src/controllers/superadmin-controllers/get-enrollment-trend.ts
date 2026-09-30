import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";

export const getEnrollmentTrend = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {
        // Get current date and calculate 6 months ago
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Start of 6 months ago (inclusive)
        sixMonthsAgo.setHours(0, 0, 0, 0);

        // Fetch enrollments from last 6 months grouped by month
        const enrollments = await prisma.batch_enrollment.findMany({
            where: {
                enrollment_date: {
                    gte: sixMonthsAgo,
                },
            },
            select: {
                enrollment_date: true,
            },
        });

        // Initialize all 6 months with 0
        const monthLabels = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const trendData: Record<string, number> = {};

        // Generate the last 6 month keys (e.g., "Apr", "May", "Jun", "Jul", "Aug", "Sep")
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = monthLabels[date.getMonth()];
            trendData[monthKey] = 0;
        }

        // Count enrollments per month
        enrollments.forEach((enrollment) => {
            const date = new Date(enrollment.enrollment_date);
            const monthKey = monthLabels[date.getMonth()];
            if (trendData[monthKey] !== undefined) {
                trendData[monthKey]++;
            }
        });

        return res.status(200).json(
            new ApiResponse(200, {
                candidate_enrollment_trend: trendData,
            }, "Enrollment trend fetched successfully")
        );
    }
);