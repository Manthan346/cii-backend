import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";

export const getCenterWiseEnrollment = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {
        // Aggregate enrollments per center using batch_enrollment -> batch_details -> center_details
        const enrollments = await prisma.batch_enrollment.findMany({
            select: {
                batch_details: {
                    select: {
                        center_details: {
                            select: {
                                center_name: true,
                            },
                        },
                    },
                },
            },
        });

        // Count per center
        const centerCounts: Record<string, number> = {};

        enrollments.forEach((enrollment) => {
            const centerName = enrollment.batch_details?.center_details?.center_name;
            if (centerName) {
                centerCounts[centerName] = (centerCounts[centerName] || 0) + 1;
            }
        });

        // Sort descending by count
        const sorted = Object.fromEntries(
            Object.entries(centerCounts).sort(([, a], [, b]) => b - a)
        );

        return res.status(200).json(
            new ApiResponse(200, {
                centre_wise_candidate_count: sorted,
            }, "Center-wise enrollment fetched successfully")
        );
    }
);