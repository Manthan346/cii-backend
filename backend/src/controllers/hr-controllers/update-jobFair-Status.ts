import { asyncHandler } from "../../helpers/asyncHandler";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { Response } from "express";
import { prisma } from "../../lib/prisma";

export const updateJobEventStatus = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const job_event_id = req.params.job_event_id;
    if (!job_event_id || Array.isArray(job_event_id)) {
    throw new ApiError(400, "Invalid job event ID.");
    }
    const { event_status } = req.body;

    if (!job_event_id) {
      throw new ApiError(400, "Job event ID is required.");
    }

    if (
      !["UPCOMING", "COMPLETED", "CANCELLED"].includes(
        String(event_status)
      )
    ) {
      throw new ApiError(
        400,
        "Invalid event status."
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingJobEvent = await tx.job_events.findUnique({
        where: {
          job_event_id,
        },
      });

      if (!existingJobEvent) {
        throw new ApiError(
          404,
          "Job event not found."
        );
      }

      
      const updatedJobEvent = await tx.job_events.update({
        where: {
          job_event_id,
        },
        data: {
          event_status,
        },
      });

      
      let notificationMessage: string;

      if (event_status === "UPCOMING") {
        notificationMessage = `${existingJobEvent.event_name} has been scheduled.`;
        } else if (event_status === "CANCELLED") {
        notificationMessage = `${existingJobEvent.event_name} has been cancelled.`;
        } else {
        notificationMessage = `${existingJobEvent.event_name} has ended.`;
        }

        const notification = await tx.notifications.create({
        data: {
            title: "Job Event Updated",

            notification_message: notificationMessage,

            notification_type: "JOB_EVENT_UPDATED",

            reference_type: "JOB_EVENT",

            reference_id: updatedJobEvent.job_event_id,
        },
        });

    
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
      message: "Job event status updated successfully.",
      data: {
        ...result.updatedJobEvent,
        notifiedUsers: result.notifiedUsers,
      },
    });
  }
);