import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";
import { Prisma } from "../../generated/prisma/client";

export const createCourseByAdmin = asyncHandler(
    async (req: Request, res: Response) => {

        const adminReq = req as adminAuthRequest;

        const centerId = adminReq.user.center_id;

        const {
            company_id,
            course_name,
            course_desc,
            course_duration,
            course_mode
        } = req.body;

        // Check whether the company is mapped to the admin's center
        const companyMapping = await prisma.center_company.findUnique({
            where: {
                center_id_company_id: {
                    center_id: centerId,
                    company_id: company_id
                }
            }
        });

        if (!companyMapping) {
            throw new ApiError(
                404,
                "Company is not associated with your center."
            );
        }

        try {

            const course = await prisma.course_details.create({
                data: {
                    company_id,
                    course_name,
                    course_desc,
                    course_duration,
                    course_mode
                }
            });

            return res.status(201).json(
                new ApiResponse(
                    201,
                    {
                        course_id: course.course_id,
                        course_name: course.course_name,
                        company_id: course.company_id,
                        course_mode: course.course_mode
                    },
                    "Course created successfully."
                )
            );

        } catch (error) {

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2003"
            ) {
                throw new ApiError(
                    400,
                    "Invalid company."
                );
            }

            throw error;
        }
    }
);