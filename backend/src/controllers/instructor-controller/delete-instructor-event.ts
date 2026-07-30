import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { notification_reference_type,notification_type } from "../../generated/prisma/enums";
import { ApiResponse } from "../../helpers/ApiResponse";

export const deleteInstructorEvent = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const event_id = req.params.event_id as string;
        await prisma.$transaction(async (tx) => {

        // 1. Fetch event
        const event = await tx.event_details.findUnique({
            where: {
                event_id
            },
            select: {
                event_id: true,
                event_title: true
            }
        });

        if (!event) {
            throw new ApiError(404, "Event not found.");
        }

        // 2. Find existing notification for this event
        const notification = await tx.notifications.findFirst({
            where: {
                reference_type: notification_reference_type.EVENT,
                reference_id: event_id
            },
            select: {
                notification_id: true
            }
        });

        if (!notification) {
            throw new ApiError(404, "Notification not found.");
        }

        // 3. Update notification
        await tx.notifications.update({
            where: {
                notification_id: notification.notification_id
            },
            data: {
                notification_type: notification_type.EVENT_DELETED,
                title: "Event Cancelled",
                notification_message: `The event "${event.event_title}" has been cancelled.`,
                reference_id: null,
                reference_type: null
            }
        });

        // 4. Mark notification unread for everyone
        await tx.user_notifications.updateMany({
            where: {
                notification_id: notification.notification_id
            },
            data: {
                is_read: false,
                read_at: null
            }
        });
            
        await tx.event_details.delete({
            where: {
                event_id
            }
        });

    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Event deleted successfully."
        )
    );
    }
)