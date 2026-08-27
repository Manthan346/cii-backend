import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";


export const getEventDetails = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const eventId  = req.params.eventId as string;
    const mobilizer = req.mobilizer;

    if (!eventId) {
      throw new ApiError(400, "Event ID is required");
    }

    if (!mobilizer?.center_id) {
      throw new ApiError(401, "Mobilizer center not found");
    }

    // Fetch event with documents and verify it belongs to mobilizer's center
    const event = await prisma.event_details.findUnique({
      where: { event_id: eventId,  },
      select: {
        event_id: true,
        center_id: true,
        event_title: true,
        event_description: true,
        event_date: true,
        event_time: true,
        venue: true,
        event_link: true,
        event_mode: true,
        event_type: true,
        target_type: true,
        event_status: true,
        event_documents: true, // Include event documents for image uploads
        is_show: true,
        created_at: true,
        updated_at: true,
        created_by: true,
        updated_by: true,
      },
    });

    if (!event) {
      throw new ApiError(404, "Event not found");
    }

    // Verify that the event belongs to the mobilizer's center
    if (event.center_id !== mobilizer.center_id) {
      throw new ApiError(403, "Unauthorized access to this event");
    }

    // Fetch mobilizer details for created_by and updated_by to get their names
    const [createdByDetails, updatedByDetails] = await Promise.all([
      event.created_by
        ? prisma.mobilizer_details.findUnique({
          where: { mobilizer_id: event.created_by },
          select: {
            mobilizer_first_name: true,
            mobilizer_last_name: true,
          },
        })
        : Promise.resolve(null),
      event.updated_by
        ? prisma.mobilizer_details.findUnique({
          where: { mobilizer_id: event.updated_by },
          select: {
            mobilizer_first_name: true,
            mobilizer_last_name: true,
          },
        })
        : Promise.resolve(null)
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...event,
          created_by_name: createdByDetails
            ? `${createdByDetails.mobilizer_first_name} ${createdByDetails.mobilizer_last_name}`
            : "Unknown Mobilizer",
          updated_by_name: updatedByDetails
            ? `${updatedByDetails.mobilizer_first_name} ${updatedByDetails.mobilizer_last_name}`
            : "Unknown Mobilizer"
        },
        "Event details fetched successfully"
      )
    );
  }
);