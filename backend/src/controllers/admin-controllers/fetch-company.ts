import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { role_types } from "../../generated/prisma/enums";

export const getCompaniesByAdminCenter = asyncHandler(
    async (req: Request, res: Response) => {
        const adminReq = req as adminAuthRequest;
        const adminUserId = adminReq.user.user_id;

        const admin = await prisma.user_login.findUnique({
            where: {
                user_id: adminUserId
            },
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

        const companies = await prisma.center_company.findMany({
            where: {
                center_id: admin.center_id
            },
            select: {
                company_details: {
                    select: {
                        company_id: true,
                        company_name: true
                    }
                }
            },
            orderBy: {
                company_details: {
                    company_name: "asc"
                }
            }
        });

        const data = companies.map((item) => ({
            company_id: item.company_details.company_id,
            company_name: item.company_details.company_name
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Companies fetched successfully."
            )
        );
    }
);