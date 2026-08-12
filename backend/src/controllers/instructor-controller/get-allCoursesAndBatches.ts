import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getAllCoursesAndBatches = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const { company_id } = req.instructor!;

        if (!company_id) {
            throw new ApiError(403, "Company not found.");
        }

        const [batches, companyCourses] = await Promise.all([
            prisma.batch_details.findMany({
                where: {
                    course_details: {
                        company_id: company_id,
                    },
                },
                select: {
                    batch_id: true,
                    batch_code: true,
                },
                orderBy: { batch_start_date: "desc" },
            }),
            prisma.course_details.findMany({
                where: { company_id: company_id },
                select: {
                    course_id: true,
                    course_name: true,
                },
                orderBy: { course_name: "asc" },
            }),
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    company_id,
                    courses: companyCourses,
                    batches: batches.map((b) => ({
                        batchId: b.batch_id,
                        batch_code: b.batch_code,
                    })),
                },
                "Courses and batches fetched successfully."
            )
        );
    }
);
