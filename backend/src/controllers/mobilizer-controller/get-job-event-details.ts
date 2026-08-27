import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";


export const getJobEventDetails = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const jobEventId = req.params.job_event_id as string;
    const mobilizer = req.mobilizer;

    if (!jobEventId) {
      throw new ApiError(400, "Job event ID is required");
    }

    if (!mobilizer?.center_id) {
      throw new ApiError(401, "Mobilizer center not found");
    }

    // Fetch job event with HR details and verify it belongs to mobilizer's center
    // Center isolation: job_events -> hr_details -> user_login -> center_id
    const jobEvent = await prisma.job_events.findUnique({
      where: { job_event_id: jobEventId },
      select: {
        job_event_id: true,
        event_type: true,
        event_name: true,
        event_date: true,
        event_time: true,
        address: true,
        google_map_link: true,
        description: true,
        created_at: true,
        updated_at: true,
        created_by: true,
        jobevent_photos: true,
        event_status: true,
        hr_details: {
          select: {
            hr_id: true,
            hr_first_name: true,
            hr_last_name: true,
            hr_designation: true,
            hr_phone_no: true,
            user_login: {
              select: {
                center_id: true,
              },
            },
          },
        },
      },
    });

    if (!jobEvent) {
      throw new ApiError(404, "Job event not found");
    }

    // Verify that the job event belongs to the mobilizer's center
    // (via HR's user_login.center_id)
    const jobEventCenterId = jobEvent.hr_details?.user_login?.center_id;
    if (!jobEventCenterId || jobEventCenterId !== mobilizer.center_id) {
      throw new ApiError(403, "Unauthorized access to this job event");
    }

    // Format HR name
    const hrName = jobEvent.hr_details
      ? `${jobEvent.hr_details.hr_first_name} ${jobEvent.hr_details.hr_last_name || ''}`.trim()
      : "Unknown HR";

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job_event_id: jobEvent.job_event_id,
          event_type: jobEvent.event_type,
          event_name: jobEvent.event_name,
          event_date: jobEvent.event_date,
          event_time: jobEvent.event_time,
          address: jobEvent.address,
          google_map_link: jobEvent.google_map_link,
          description: jobEvent.description,
          created_at: jobEvent.created_at,
          updated_at: jobEvent.updated_at,
          created_by: jobEvent.created_by,
          jobevent_photos: jobEvent.jobevent_photos,
          event_status: jobEvent.event_status,
          hr_name: hrName,
        },
        "Job event details fetched successfully"
      )
    );
  }
);