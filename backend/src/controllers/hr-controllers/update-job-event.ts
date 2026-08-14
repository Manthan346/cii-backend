import { asyncHandler } from "../../helpers/asyncHandler";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";
import { Response } from "express";

export const updateJobEvent = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const job_event_id = req.params.job_event_id;

    if (!job_event_id || Array.isArray(job_event_id)) {
      throw new ApiError(400, "Invalid job event ID.");
    }

    const {
      event_type,
      event_name,
      event_date,
      event_time,
      address,
      google_map_link,
      description,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Check whether the job event exists
      const existingJobEvent = await tx.job_events.findUnique({
        where: {
          job_event_id,
        },
      });

      if (!existingJobEvent) {
        throw new ApiError(404, "Job event not found.");
      }

      // Update job event
      const updatedJobEvent = await tx.job_events.update({
        where: {
          job_event_id,
        },
        data: {
          ...(event_type !== undefined && {
            event_type,
          }),

          ...(event_name !== undefined && {
            event_name,
          }),

          ...(event_date !== undefined && {
            event_date: new Date(event_date),
          }),

          ...(event_time !== undefined && {
            event_time: new Date(
              `1970-01-01T${event_time}:00`
            ),
          }),

          ...(address !== undefined && {
            address,
          }),

          ...(google_map_link !== undefined && {
            google_map_link,
          }),

          ...(description !== undefined && {
            description,
          }),
        },
      });

      // Create notification
      const notification = await tx.notifications.create({
        data: {
          title: "Job Event Updated",

          notification_message:
  `${updatedJobEvent.event_name} has been updated. The event is scheduled for ${updatedJobEvent.event_date.toISOString().split("T")[0]} at ${updatedJobEvent.event_time.toISOString().substring(11, 16)} at ${updatedJobEvent.address}.`,

          notification_type: "JOB_EVENT_UPDATED",

          reference_type: "JOB_EVENT",

          reference_id: updatedJobEvent.job_event_id,
        },
      });

      // Find all recipients
      const users = await tx.user_login.findMany({
        where: {
          user_role: {
            in: [
              "candidate",
              "mobilizer",
              "admin",
              "hr",
            ],
          },
        },
        select: {
          user_id: true,
        },
      });

      // Create user notifications
      if (users.length > 0) {
        await tx.user_notifications.createMany({
          data: users.map((user) => ({
            notification_id:
              notification.notification_id,
            user_id: user.user_id,
          })),
        });
      }

      return {
        updatedJobEvent,
        notifiedUsers: users.length,
      };
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Job event updated successfully.",
      data: {
        ...result.updatedJobEvent,
        notifiedUsers: result.notifiedUsers,
      },
    });
  }
);