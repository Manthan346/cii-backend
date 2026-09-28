import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";

export const getCompaniesByAdmin = asyncHandler(
    async (req: Request, res: Response) => {

        const adminReq = req as adminAuthRequest;

        const centerId = adminReq.user.center_id;

        const companies = await prisma.center_company.findMany({
            where: {
                center_id: centerId
            },
            include: {
                company_details: {
                    include: {
                        course_details: true
                    }
                }
            }
        });

        const formattedCompanies = companies.map((mapping) => ({
            company_id: mapping.company_details.company_id,
            company_name: mapping.company_details.company_name,
            course_count: mapping.company_details.course_details.length,
            courses: mapping.company_details.course_details.map((course) => ({
                course_id: course.course_id,
                course_name: course.course_name,
                course_desc: course.course_desc,
                course_duration: course.course_duration,
                course_mode: course.course_mode
            }))
        }));

        const totalCourses = formattedCompanies.reduce(
            (total, company) => total + company.course_count,
            0
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    total_companies: formattedCompanies.length,
                    total_courses: totalCourses,
                    companies: formattedCompanies
                },
                "Companies fetched successfully."
            )
        );
    }
);