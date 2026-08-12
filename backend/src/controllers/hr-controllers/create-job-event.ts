import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";

export const createJobEvent = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const {
      event_type,
      event_name,
      event_date,
      event_time,
      address,
      google_map_link,
      description,
    } = req.body;

    const hr_id = req.hr?.hr_id;

    if (!hr_id) {
      throw new ApiError(401, "HR authentication required");
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create job event
      const jobEvent = await tx.job_events.create({
        data: {
          event_type,
          event_name,
          event_date: new Date(event_date),
          event_time: new Date(`1970-01-01T${event_time}:00`),
          address,
          google_map_link,
          description,
          created_by: hr_id,
        },
      });

      // Create master notification
      const notification = await tx.notifications.create({
        data: {
          title:
            event_type === "JOB_FAIR"
              ? "New Job Fair"
              : "New Job Drive",

          notification_message:
            `${event_name} has been created. Check the event details for more information.`,

          notification_type: "JOB_EVENT_CREATED",
          reference_type: "JOB_EVENT",
          reference_id: jobEvent.job_event_id,
        },
      });

      // selecting relevant users to send the notifications
      const users = await tx.user_login.findMany({
        where: {
          user_role: {
            in: ["candidate", "mobilizer", "admin","hr"],
          },
        },
        select: {
          user_id: true,
        },
      });

      // Notifications are sent to all relevent users 
      if (users.length > 0) {
        await tx.user_notifications.createMany({
          data: users.map((user) => ({
            notification_id: notification.notification_id,
            user_id: user.user_id,
          })),
        });
      }

      return {
        jobEvent,
        notifiedUsers: users.length,
      };
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Job event created successfully",
      data: {
        ...result.jobEvent,
        notifiedUsers: result.notifiedUsers,
      },
    });
  }
);