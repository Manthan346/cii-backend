import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { role_types } from "../../generated/prisma/enums";

export const getAdminCandidateDashboardSummary = asyncHandler(
    async (req: Request, res: Response) => {
        const adminReq = req as adminAuthRequest;
        const adminUserId = adminReq.user.user_id;

        const admin = await prisma.user_login.findUnique({
            where: { user_id: adminUserId },
            select: {
                user_role: true,
                center_id: true
            }
        });

        if (!admin) {
            throw new ApiError(404, "Admin user not found.");
        }

        if (admin.user_role !== role_types.admin) {
            throw new ApiError(403, "Unauthorized.");
        }

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const startOfNextMonth = new Date(
            startOfMonth.getFullYear(),
            startOfMonth.getMonth() + 1,
            1
        );

        const enrollmentWhere = {
            candidates_details: {
                user_login: {
                    center_id: admin.center_id
                }
            }
        };

        const [
            enrollmentsThisMonth,
            totalCandidates,
            certificatesIssued,
            totalEnrollments
        ] = await Promise.all([
            prisma.batch_enrollment.count({
                where: {
                    ...enrollmentWhere,
                    created_at: {
                        gte: startOfMonth,
                        lt: startOfNextMonth
                    }
                }
            }),

            prisma.batch_enrollment.findMany({
                where: enrollmentWhere,
                distinct: ["candidate_id"],
                select: {
                    candidate_id: true
                }
            }),

            prisma.batch_enrollment.count({
                where: {
                    ...enrollmentWhere,
                    certificate_url: {
                        not: null
                    }
                }
            }),

            prisma.batch_enrollment.count({
                where: enrollmentWhere
            })
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    enrollments_this_month: enrollmentsThisMonth,
                    total_candidates: totalCandidates.length,
                    certificates_issued: certificatesIssued,
                    total_enrollments: totalEnrollments
                },
                "Certificate dashboard summary fetched successfully."
            )
        );
    }
);