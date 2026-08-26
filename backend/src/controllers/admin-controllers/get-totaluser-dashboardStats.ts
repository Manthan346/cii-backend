import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getUserStats = asyncHandler(
    async (req: Request, res: Response) => {
        const adminReq = req as adminAuthRequest;
        const adminUserId = adminReq.user.user_id;

        const admin = await prisma.user_login.findUnique({
            where: { user_id: adminUserId },
            select: { center_id: true },
        });

        if (!admin) {
            throw new ApiError(404, "Admin user not found.");
        }

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        const [totalUsers, activeUsers, inactiveUsers, newUsersThisMonth] =
            await Promise.all([
                prisma.user_login.count({
                    where: {
                        center_id: admin.center_id,
                    },
                }),

                prisma.user_login.count({
                    where: {
                        center_id: admin.center_id,
                        is_active: true,
                    },
                }),

                prisma.user_login.count({
                    where: {
                        center_id: admin.center_id,
                        is_active: false,
                    },
                }),

                prisma.user_login.count({
                    where: {
                        center_id: admin.center_id,
                        created_at: {
                            gte: startOfMonth,
                            lt: endOfMonth,
                        },
                    },
                }),
            ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalUsers,
                    activeUsers,
                    inactiveUsers,
                    newUsersThisMonth,
                },
                "User statistics fetched successfully."
            )
        );
    }
);