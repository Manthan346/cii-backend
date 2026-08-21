import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";

export const addJobEventImages = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const job_event_id = req.params.job_event_id as string;
    const mobilizer = req.mobilizer;

    if (!job_event_id) {
      throw new ApiError(400, "Job event ID is required");
    }

    if (!mobilizer || !mobilizer.mobilizer_id) {
      throw new ApiError(401, "Unauthorized access. Valid mobilizer required.");
    }

    if (!mobilizer.center_id) {
      throw new ApiError(401, "Mobilizer is not associated with any center.");
    }

    const centerId = mobilizer.center_id;

    // job_events has no center_id column, so we derive the job event's center
    // from the HR who created it:
    //   job_events.created_by -> hr_details -> user_login -> center_id
    // A mobilizer may upload photos only if the HR's center matches their own.
    const jobEvent = await prisma.job_events.findUnique({
      where: { job_event_id },
      select: {
        job_event_id: true,
        jobevent_photos: true,
        hr_details: {
          select: {
            user_login: {
              select: { center_id: true },
            },
          },
        },
      },
    });

    if (!jobEvent) {
      throw new ApiError(404, "Job event not found");
    }

    const jobEventCenterId = jobEvent.hr_details?.user_login?.center_id;

    if (!jobEventCenterId || jobEventCenterId !== centerId) {
      throw new ApiError(
        403,
        "You are not authorized to upload photos to this job event. It does not belong to your center."
      );
    }

    // Images uploaded via the image-upload middleware are placed in req.body.event_images
    const newImageUrls = Array.isArray(req.body.event_images)
      ? req.body.event_images
      : [];

    if (newImageUrls.length === 0) {
      throw new ApiError(400, "No images provided. Please upload up to 10 images.");
    }

    // Enforce a maximum of 10 images total on the job event
    const existingPhotos: string[] = jobEvent.jobevent_photos ?? [];
    const mergedPhotos = [...existingPhotos, ...newImageUrls];

    if (mergedPhotos.length > 10) {
      throw new ApiError(
        400,
        `A job event can have a maximum of 10 images. This event already has ${existingPhotos.length} image(s); you uploaded ${newImageUrls.length} more.`
      );
    }

    // Update the job event with the merged photo array
    const updatedJobEvent = await prisma.job_events.update({
      where: { job_event_id },
      data: {
        jobevent_photos: mergedPhotos,
      },
      select: {
        job_event_id: true,
        event_name: true,
        jobevent_photos: true,
        updated_at: true,
      },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          job_event_id: updatedJobEvent.job_event_id,
          event_name: updatedJobEvent.event_name,
          jobevent_photos: updatedJobEvent.jobevent_photos,
          images_added: newImageUrls.length,
          total_images: updatedJobEvent.jobevent_photos.length,
          updated_at: updatedJobEvent.updated_at,
        },
        `${newImageUrls.length} image(s) added successfully to the job event.`
      )
    );
  }
);
