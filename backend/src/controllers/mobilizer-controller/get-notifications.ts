import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";



function parseBooleanParam(raw: unknown): boolean {
    if (typeof raw !== "string") return false;
    return raw.toLowerCase() === "true" || raw === "1";
}

export const getMobilizerNotifications = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const userId = req.user?.user_id;

        if (!userId) {
            throw new ApiError(401, "User not authenticated");
        }

        // --- pagination ---
        const cursor = req.query.cursor as string | undefined;
        let limit = req.query.limit ? Number(req.query.limit) : 20;
        if (!Number.isFinite(limit) || limit <= 0) limit = 20;
        if (limit > 50) limit = 50; // safety cap

        // --- optional unread-only filter ---
        const unreadOnly =
            req.query.unreadOnly != null
                ? parseBooleanParam(req.query.unreadOnly)
                : false;

        // user_notifications is scoped to THIS mobilizer's user_id only.
        const whereClause: any = { user_id: userId };
        if (unreadOnly) whereClause.is_read = false;

        const userNotifications = await prisma.user_notifications.findMany({
            where: whereClause,
            take: limit + 1,
            ...(cursor && {
                cursor: { user_notification_id: cursor },
                skip: 1,
            }),
            orderBy: { created_at: "desc" },
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
                    },
                },
            },
        });

        const hasNextPage = userNotifications.length > limit;
        const pageItems = hasNextPage
            ? userNotifications.slice(0, limit)
            : userNotifications;
        const nextCursor = hasNextPage
            ? pageItems[pageItems.length - 1].user_notification_id
            : null;

        // Flatten BEFORE mutating — the response should reflect "was this
        // unread when you opened the list?", not the state a moment later
        // after we mark them read below.
        const notifications = pageItems.map((un) => ({
            user_notification_id: un.user_notification_id,
            notification_id: un.notifications.notification_id,
            title: un.notifications.title,
            message: un.notifications.notification_message,
            notification_type: un.notifications.notification_type,
            reference_type: un.notifications.reference_type,
            reference_id: un.notifications.reference_id,
            is_read: un.is_read, // pre-mutation value
            read_at: un.read_at,
            created_at: un.created_at,
        }));

        // Side effect: mark every unread notification in this page as read,
        // since the user is now viewing the notification feed.
        const unreadIdsInPage = pageItems
            .filter((un) => !un.is_read)
            .map((un) => un.user_notification_id);

        if (unreadIdsInPage.length > 0) {
            await prisma.user_notifications.updateMany({
                where: { user_notification_id: { in: unreadIdsInPage } },
                data: { is_read: true, read_at: new Date() },
            });
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    notifications,
                    pagination: { nextCursor, hasNextPage, limit },
                },
                "Notifications fetched successfully"
            )
        );
    }
);
