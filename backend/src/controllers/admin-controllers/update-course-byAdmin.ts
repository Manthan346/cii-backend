import { Request, Response } from "express";
import { courseIdParamSchema } from "../../services/zod/admin/course-creation-validation";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";

import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";

export const updateCourseByAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const adminReq = req as adminAuthRequest;

        const centerId = adminReq.user.center_id;
        const { course_id } = req.params as { course_id : string};

        const result = courseIdParamSchema.safeParse({ course_id });

        if (!result.success) {
            throw new ApiError(400, "Invalid course ID.");
        }

        const {
            course_name,
            course_desc,
            course_duration,
            course_mode,
        } = req.body;

        // 1. Check whether course exists
        const course = await prisma.course_details.findUnique({
            where: {
                course_id,
            },
            select: {
                course_id: true,
                company_id: true,
            },
        });

        if (!course) {
            throw new ApiError(404, "Course not found.");
        }

        // 2. Check whether the course's company belongs to admin's center
        const companyMapping = await prisma.center_company.findUnique({
            where: {
                center_id_company_id: {
                    center_id: centerId,
                    company_id: course.company_id,
                },
            },
        });

        if (!companyMapping) {
            throw new ApiError(
                404,
                "Course is not associated with your center."
            );
        }

        // 3. Prepare only the fields provided by the frontend
        const updateData: {
            course_name?: string;
            course_desc?: string;
            course_duration?: string;
            course_mode?: "online" | "offline" | "hybrid";
        } = {};

        if (course_name !== undefined) {
            updateData.course_name = course_name;
        }

        if (course_desc !== undefined) {
            updateData.course_desc = course_desc;
        }

        if (course_duration !== undefined) {
            updateData.course_duration = course_duration;
        }

        if (course_mode !== undefined) {
            updateData.course_mode = course_mode;
        }

        // 4. Update course
        const updatedCourse = await prisma.course_details.update({
            where: {
                course_id,
            },
            data: updateData,
        });

        // 5. Return updated course
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    course_id: updatedCourse.course_id,
                    company_id: updatedCourse.company_id,
                    course_name: updatedCourse.course_name,
                    course_desc: updatedCourse.course_desc,
                    course_duration: updatedCourse.course_duration,
                    course_mode: updatedCourse.course_mode,
                },
                "Course updated successfully."
            )
        );
    }
);