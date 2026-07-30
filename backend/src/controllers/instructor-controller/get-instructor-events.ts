import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { notification_reference_type } from "../../generated/prisma/enums";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getAllInstructorEvents = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const { page, limit, skip } = req.pagination!;
        const user_id = req.user.user_id;

        if (!Number.isInteger(page) || page < 1) {
            throw new ApiError(400, "Page must be greater than or equal to 1.");
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
            throw new ApiError(400, "Limit must be between 1 and 50.");
        }

        const totalRecords = await prisma.user_notifications.count({
            where: {
                user_id,
                notifications: {
                    reference_type: notification_reference_type.EVENT,
                },
            },
        });

        const events = await prisma.user_notifications.findMany({
            where: {
                user_id,
                notifications: {
                reference_type: notification_reference_type.EVENT,
                },
            },
            skip,
            take: limit,
            orderBy: {
                created_at: "desc",
            },
            select: {
                is_read: true,
                read_at: true,
                notifications: {
                select: {
                    notification_id: true,
                    reference_id: true, // <-- IMPORTANT
                    notification_type: true,
                    title: true,
                    notification_message: true,
                    created_at: true,
                },
                },
            },
        });

        

        

        const eventIds = events.map((event) => {
            if (!event.notifications.reference_id) {
                throw new ApiError(
                500,
                "Event notification is missing reference_id."
                );
            }

        return event.notifications.reference_id;
        });

        const eventDetails = await prisma.event_details.findMany({
            where: {
                event_id: {
                    in: eventIds,
                },
            },
        });

        const eventMap = new Map(
            eventDetails.map((event) => [event.event_id, event])
        );

        const response = events.map((event) => ({
            is_read: event.is_read,
            read_at: event.read_at,
            notifications: {
                ...event.notifications,
                event_details: eventMap.get(event.notifications.reference_id!),
            },
        }));


        const totalPages = Math.ceil(totalRecords / limit);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    events:response,
                    pagination: {
                        page,
                        limit,
                        totalRecords,
                        totalPages,
                    },
                },
                "Events fetched successfully."
            )
        );

    }
)
