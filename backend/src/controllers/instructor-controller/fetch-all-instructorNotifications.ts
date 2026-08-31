import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getInstructorNotifications = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {

        const instructorId = req.instructor?.instructor_id;
        const userId = req.user?.user_id;

        if (!instructorId) {
            throw new ApiError(
                401,
                "You are not authorized."
            );
        }

        if (!userId) {
            throw new ApiError(
                401,
                "User information not found."
            );
        }

        const notifications = await prisma.user_notifications.findMany({
            where: {
                user_id: userId
            },
            select: {
                user_notification_id: true,
                notification_id: true,
                is_read: true,
                read_at: true,
                created_at: true,
                notifications: {
                    select: {
                        title: true,
                        notification_message: true,
                        notification_type: true,
                        reference_type: true,
                        reference_id: true,
                        created_at: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    notifications
                },
                "Notifications fetched successfully."
            )
        );
    }
);