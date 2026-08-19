import { Response } from "express";

import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

export const getAllNotifications = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const userId = req.user?.user_id;

        if (!userId) {
            throw new ApiError(
                401,
                "User information is missing"
            );
        }

        const { page, limit, skip } = req.pagination!;

        if (page < 1) {
            throw new ApiError(
                400,
                "Page must be greater than or equal to 1"
            );
        }

        if (limit < 1 || limit > 50) {
            throw new ApiError(
                400,
                "Limit must be between 1 and 50"
            );
        }

        const [notifications, totalCount] =
            await prisma.$transaction([
                prisma.user_notifications.findMany({
                    where: {
                        user_id: userId,
                    },

                    skip,
                    take: limit,

                    orderBy: {
                        created_at: "desc",
                    },

                    select: {
                        user_notification_id: true,
                        is_read: true,
                        read_at: true,
                        created_at: true,

                        notifications: {
                            select: {
                                notification_id: true,
                                title: true,
                                notification_message: true,
                                notification_type: true,
                                reference_type: true,
                                reference_id: true,
                                created_at: true,
                            },
                        },
                    },
                }),

                prisma.user_notifications.count({
                    where: {
                        user_id: userId,
                    },
                }),
            ]);

        const totalPages = Math.ceil(
            totalCount / limit
        );

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    notifications,

                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages,
                        hasNextPage:
                            page < totalPages,
                        hasPreviousPage:
                            page > 1,
                    },
                },
                "Notifications fetched successfully"
            )
        );
    }
);