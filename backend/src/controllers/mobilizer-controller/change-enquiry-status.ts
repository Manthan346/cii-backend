import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";
import { cache } from "../../lib/cache-helper";

export const changeEnquiryStatus = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const  enquiryId  = req.params.enquiryId as string;
        const centerId = req.mobilizer?.center_id;
        const { status } = req.body;

        if (!enquiryId) {
            throw new ApiError(400, "Enquiry ID is required");
        }

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        if (!status) {
            throw new ApiError(400, "Status is required");
        }

        // Validate that the status is a valid enquiry_status enum value
        if (!(status in enquiry_status)) {
            const validStatuses = Object.values(enquiry_status).join(", ");
            throw new ApiError(400, `Invalid status. Valid statuses are: ${validStatuses}`);
        }

        // Check if enquiry exists AND belongs to the mobilizer's center
        const enquiry = await prisma.enquiry_records.findFirst({
            where: { enquiry_id: enquiryId, center_id: centerId },
            select: {
                enquiry_id: true,
                enq_status: true,
                mobilizer_id: true,
            },
        });

        if (!enquiry) {
            throw new ApiError(404, "Enquiry not found");
        }

        const mobilizerId = req.mobilizer?.mobilizer_id;
        if (!mobilizerId) {
            throw new ApiError(401, "Mobilizer ID not found in token");
        }

        // Update the enquiry status
        const updatedEnquiry = await prisma.enquiry_records.update({
            where: { enquiry_id: enquiryId },
            data: { enq_status: status as enquiry_status },
            select: {
                enquiry_id: true,
                enq_status: true,
                enquiry_first_name: true,
                enquiry_last_name: true,
            }
        });

        // Create a new entry in enquiry_status_history
        const statusHistory = await prisma.enquiry_status_history.create({
            data: {
                enquiry_id: enquiryId,
                enq_status: status as enquiry_status,
                mobilizer_id: mobilizerId,
            },
            select: {
                history_id: true,
                enq_status: true,
                mobilizer_id: true,
                created_at: true,
                mobilizer_details: {
                    select: {
                        mobilizer_first_name: true,
                        mobilizer_last_name: true
                    }
                }
            }
        });

        // Invalidate mobilizer cache for this center (affects dashboard stats, charts, enquiry stats, enrollment analytics)
        await cache.invalidateMobilizerCenter(centerId);

        // Prepare response
        const responseData = {
            enquiry: {
                enquiry_id: updatedEnquiry.enquiry_id,
                name: `${updatedEnquiry.enquiry_first_name} ${updatedEnquiry.enquiry_last_name ?? ""}`.trim(),
                status: updatedEnquiry.enq_status,
            },
            status_history: {
                history_id: statusHistory.history_id,
                status: statusHistory.enq_status,
                changed_by: statusHistory.mobilizer_details
                    ? `${statusHistory.mobilizer_details.mobilizer_first_name} ${statusHistory.mobilizer_details.mobilizer_last_name}`.trim()
                    : "Unknown",
                changed_at: statusHistory.created_at,
            }
        };

        return res.status(200).json(
            new ApiResponse(200, responseData, "Enquiry status updated successfully")
        );
    }
);