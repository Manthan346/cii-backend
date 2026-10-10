
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { notification_reference_type } from "../../generated/prisma/enums";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";

type NotificationTokenPayload = {
  user_id: string;
  role: string;
};

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const userNotificationId = req.params.userNotificationId;

    if (typeof userNotificationId !== "string") {
    throw new ApiError(400, "Invalid notification ID");
    }

    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }

    let decoded: NotificationTokenPayload;

    try {
      decoded = jwt.verify(
        accessToken,
        process.env.JWT_SECRET!
      ) as NotificationTokenPayload;
    } catch {
      throw new ApiError(401, "Invalid or expired access token");
    }

    if (!decoded.user_id || !decoded.role) {
      throw new ApiError(401, "Invalid access token payload");
    }

    const user = await prisma.user_login.findUnique({
      where: {
        user_id: decoded.user_id,
      },
      select: {
        is_active: true,
      },
    });

    if (!user || !user.is_active) {
      throw new ApiError(403, "Account is inactive or unavailable");
    }

    const notification = await prisma.user_notifications.findFirst({
    where: {
        user_notification_id: userNotificationId,
        user_id: decoded.user_id,
    },
    select: {
        user_notification_id: true,
        notifications: {
        select: {
            reference_type: true,
        },
        },
    },
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    if (notification.notifications.reference_type ===notification_reference_type.EVENT) {
        throw new ApiError(
            403,
            "Event-related notifications cannot be deleted"
        );
        }

    const deleted = await prisma.user_notifications.deleteMany({
      where: {
        user_notification_id: userNotificationId,
        user_id: decoded.user_id,
        OR: [
          {
            notifications: {
              reference_type: {
                not: notification_reference_type.EVENT,
              },
            },
          },
          {
            notifications: {
              reference_type: null,
            },
          },
        ],
      },
    });

    if (deleted.count === 0) {
      throw new ApiError(
        403,
        "Notification cannot be deleted"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Notification deleted successfully"
      )
    );
  }
);
