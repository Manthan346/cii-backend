import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { updatePublicEventSchema } from "../../services/zod/event-schema/eventValidation";
import { event_mode } from "../../generated/prisma/enums";
import { uploadEventImages } from "../../middlewares/multer-middleware/image-upload";

export const updatePublicEvent = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const event_id = req.params.event_id as string;
    const mobilizer = req.mobilizer;
    const user_id = req.user.user_id;

    if (!mobilizer || !mobilizer.center_id) {
      throw new ApiError(401, "Unauthorized access. Mobilizer must be associated with a center.");
    }

    // Fetch mobilizer details to get the name
    const mobilizerDetails = await prisma.mobilizer_details.findUnique({
      where: { mobilizer_id: mobilizer.mobilizer_id },
      select: {
        mobilizer_first_name: true,
        mobilizer_last_name: true,
      },
    });

    const data = updatePublicEventSchema.parse(req.body);

    const event = await prisma.event_details.findUnique({
      where: { event_id },
      select: {
        center_id: true,
        target_type: true,
        is_show: true,
        event_documents: true,
      },
    });

    if (!event) {
      throw new ApiError(404, "Event not found.");
    }

    // Only allow updating PUBLIC events
    if (event.target_type !== "PUBLIC") {
      throw new ApiError(403, "Only PUBLIC events can be updated via this endpoint.");
    }

    // Only allow mobilizers from the same center to update
    if (event.center_id !== mobilizer.center_id) {
      throw new ApiError(403, "You are not authorized to update this event.");
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (data.event_title !== undefined) updateData.event_title = data.event_title;
    if (data.event_description !== undefined) updateData.event_description = data.event_description;
    if (data.event_date !== undefined) updateData.event_date = new Date(data.event_date);
    if (data.event_time !== undefined) updateData.event_time = new Date(`1970-01-01T${data.event_time}:00`);
    if (data.venue !== undefined) updateData.venue = data.venue;
    if (data.event_link !== undefined) updateData.event_link = data.event_link;
    if (data.event_mode !== undefined) updateData.event_mode = data.event_mode;
    if (data.event_type !== undefined) updateData.event_type = data.event_type;
    if (data.is_show !== undefined) updateData.is_show = data.is_show;

    // Handle image uploads - if event_images is provided, add to event_documents array
    if (data.event_images !== undefined && data.event_images !== null && Array.isArray(data.event_images) && data.event_images.length > 0) {
      // Get existing documents or initialize empty array
      const existingDocuments = event.event_documents || [];

      // Add new image URLs to documents array
      updateData.event_documents = [...existingDocuments, ...data.event_images];
    }

    updateData.updated_by = user_id;

    const updatedEvent = await prisma.event_details.update({
      where: { event_id },
      data: updateData,
    });

    // Prepare response with mobilizer name
    const responseData = {
      ...updatedEvent,
      updated_by_name: mobilizerDetails
        ? `${mobilizerDetails.mobilizer_first_name} ${mobilizerDetails.mobilizer_last_name}`
        : "Unknown Mobilizer"
    };

    return res.status(200).json(
      new ApiResponse(200, responseData, "Public event updated successfully.")
    );
  }
);