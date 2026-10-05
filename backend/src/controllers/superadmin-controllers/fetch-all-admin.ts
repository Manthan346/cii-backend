import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { pagination } from "../../interfaces/pagination-interface";

export const getAllAdmins = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const { page, limit, skip } = req.pagination!;

        const [admins, totalAdmins] = await prisma.$transaction([
            prisma.user_login.findMany({
                where: {
                    user_role: "admin",
                },
                select: {
                    user_id: true,
                    user_email: true,
                    user_role: true,
                    center_id: true,
                    is_active: true,
                    created_at: true,
                    updated_at: true,

                    admin_details: {
                        select: {
                            admin_id: true,
                            admin_first_name: true,
                            admin_last_name: true,
                            admin_phone_no: true,
                        },
                    },

                    center_details: {
                        select: {
                            center_id: true,
                            center_name: true,
                        },
                    },
                },

                orderBy: {
                    created_at: "desc",
                },

                skip,
                take: limit,
            }),

            prisma.user_login.count({
                where: {
                    user_role: "admin",
                },
            }),
        ]);

        const totalPages = Math.ceil(totalAdmins / limit);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    admins,
                    pagination: {
                        total: totalAdmins,
                        page,
                        limit,
                        totalPages,
                    },
                },
                "Admins fetched successfully"
            )
        );
    }
);