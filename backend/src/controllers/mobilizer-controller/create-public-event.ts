import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import {
    event_target_type,
    notification_reference_type,
    notification_type
} from "../../generated/prisma/enums";
import { ApiError } from "../../helpers/ApiError";
import { createEventSchema } from "../../services/zod/event-schema/eventValidation";

export const createPublicEvent = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {

        const center_id = req.mobilizer?.center_id;
        const mobilizerId = req.mobilizer?.mobilizer_id;

        if (!center_id) {
            throw new ApiError(
                401,
                "Unauthorized access. Mobilizer must be associated with a center."
            );
        }

        // Fetch mobilizer details to get the name
        const mobilizerDetails = await prisma.mobilizer_details.findUnique({
            where: { mobilizer_id: mobilizerId },
            select: {
                mobilizer_first_name: true,
                mobilizer_last_name: true,
            },
        });

        const data = createEventSchema.parse(req.body);

        if (data.target_type !== event_target_type.PUBLIC) {
            throw new ApiError(
                400,
                "Only PUBLIC events can be created via this endpoint."
            );
        }

        // Center-scoped audience — every user_login of this center
        const centerUsers = await prisma.user_login.findMany({
            where: { center_id },
            select: { user_id: true }
        });

        const recipientUserIds = [
            ...new Set([
                req.user.user_id,
                ...centerUsers.map(u => u.user_id)
            ])
        ];

        const createdEvent = await prisma.$transaction(
            async (tx) => {

                const event = await tx.event_details.create({
                    data: {
                        center_id: center_id,
                        event_title: data.event_title,
                        event_description: data.event_description,
                        event_date: new Date(data.event_date),
                        event_time: new Date(
                            `1970-01-01T${data.event_time}:00`
                        ),
                        venue: data.venue,
                        event_link: data.event_link,
                        event_mode: data.event_mode,
                        event_type: data.event_type,
                        target_type: data.target_type,
                        event_status: data?.event_status,
                        is_show: true,
                        created_by: req.user.user_id,
                        updated_by: req.user.user_id
                    }
                });

                const notification = await tx.notifications.create({
                    data: {
                        title: data.event_title,
                        notification_message:
                            `A new public event "${data.event_title}" has been scheduled on ${data.event_date}.`,
                        notification_type: notification_type.EVENT_CREATED,
                        reference_type: notification_reference_type.EVENT,
                        reference_id: event.event_id
                    }
                });

                if (recipientUserIds.length > 0) {
                    await tx.user_notifications.createMany({
                        data: recipientUserIds.map(userId => ({
                            user_id: userId,
                            notification_id: notification.notification_id
                        }))
                    });
                }

                return event;
            }
        );

        // Prepare response with mobilizer name
        const responseData = {
            ...createdEvent,
            created_by_name: mobilizerDetails
                ? `${mobilizerDetails.mobilizer_first_name} ${mobilizerDetails.mobilizer_last_name}`
                : "Unknown Mobilizer"
        };

        return res.status(201).json(
            new ApiResponse(
                201,
                responseData,
                "Public event created successfully."
            )
        );
    }
);
