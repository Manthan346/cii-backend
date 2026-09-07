import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const getCompanyCourses = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const centerId = req.user.center_id;

        const { company_id } = req.query;

        if (!centerId) {
            throw new ApiError(404, "Center ID not found in token");
        }

        if (!company_id) {
            throw new ApiError(400, "company_id is required");
        }

        if (Array.isArray(company_id)) {
            throw new ApiError(
                400,
                "company_id must be a single value"
            );
        }

        const companyId = company_id as string;

        // Make sure the company belongs to the admin's center
        const centerCompany = await prisma.center_company.findUnique({
            where: {
                center_id_company_id: {
                    center_id: centerId,
                    company_id: companyId,
                },
            },
        });

        if (!centerCompany) {
            throw new ApiError(
                404,
                "Company not found or company is not associated with this center"
            );
        }

        const courses = await prisma.course_details.findMany({
            where: {
                company_id: companyId,
            },

            select: {
                course_id: true,
                course_name: true,
            },

            orderBy: {
                course_name: "asc",
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                courses,
                "Courses fetched successfully"
            )
        );
    }
);

