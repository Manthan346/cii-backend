import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";

import { prisma } from "../../lib/prisma";

import { adminAuthRequest } from "../../interfaces/admin-auth-interface";

import { ApiResponse } from "../../helpers/ApiResponse";

import { ApiError } from "../../helpers/ApiError";

export const getCourseBatches = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const centerId = req.user.center_id;

        const { course_id } = req.query;

        if (!centerId) {
            throw new ApiError(404, "Center ID not found in token");
        }

        if (!course_id) {
            throw new ApiError(400, "course_id is required");
        }

        if (Array.isArray(course_id)) {
            throw new ApiError(
                400,
                "course_id must be a single value"
            );
        }

        const courseId = course_id as string;

        // Verify that the selected course belongs to a company
        // associated with the admin's center.
        const course = await prisma.course_details.findFirst({
            where: {
                course_id: courseId,

                company_details: {
                    center_company: {
                        some: {
                            center_id: centerId,
                        },
                    },
                },
            },
        });

        if (!course) {
            throw new ApiError(
                404,
                "Course not found or course does not belong to this center"
            );
        }

        const batches = await prisma.batch_details.findMany({
            where: {
                course_id: courseId,
            },

            select: {
                batch_id: true,
                batch_name: true,
            },

            orderBy: {
                batch_start_date: "asc",
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                batches,
                "Batches fetched successfully"
            )
        );
    }
);