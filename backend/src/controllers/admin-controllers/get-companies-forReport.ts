import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const getCompanies = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const centerId = req.user.center_id;

        if (!centerId) {
            throw new ApiError(404, "Center ID not found in token");
        }

        const companies = await prisma.center_company.findMany({
            where: {
                center_id: centerId,
            },

            select: {
                company_details: {
                    select: {
                        company_id: true,
                        company_name: true,
                    },
                },
            },

            orderBy: {
                company_details: {
                    company_name: "asc",
                },
            },
        });

        const data = companies.map((item) => ({
            company_id: item.company_details.company_id,
            company_name: item.company_details.company_name,
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Companies fetched successfully"
            )
        );
    }
);

