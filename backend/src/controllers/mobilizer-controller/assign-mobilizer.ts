import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";

export const assignMobilizerToEnquiry = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const mobilizerId = req.mobilizer?.mobilizer_id;
        const centerId = req.mobilizer?.center_id;
        const enquiryId  = req.params.enquiryId as string

        if (!mobilizerId) {
            throw new ApiError(401, "Mobilizer ID not found in token");
        }

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        if (!enquiryId) {
            throw new ApiError(400, "Enquiry ID is required");
        }

        // Check if enquiry exists AND belongs to the mobilizer's center.
        // findFirst with center_id scopes the lookup; an enquiry that exists but is
        // from another center returns null -> 404 (no cross-center info leak).
        const enquiry = await prisma.enquiry_records.findFirst({
            where: { enquiry_id: enquiryId, center_id: centerId },
            select: {
                enquiry_id: true,
                mobilizer_id: true,
                enquiry_first_name: true,
                enquiry_last_name: true
            },
        });

        if (!enquiry) {
            throw new ApiError(404, "Enquiry not found");
        }

        // Check if already assigned to another mobilizer
        if (enquiry.mobilizer_id && enquiry.mobilizer_id !== mobilizerId) {
            const existingMobilizer = await prisma.mobilizer_details.findUnique({
                where: { mobilizer_id: enquiry.mobilizer_id },
                select: { mobilizer_first_name: true, mobilizer_last_name: true }
            });
            throw new ApiError(400, `Enquiry already assigned to ${existingMobilizer?.mobilizer_first_name} ${existingMobilizer?.mobilizer_last_name}`);
        }

        // Assign mobilizer to enquiry
        const updatedEnquiry = await prisma.enquiry_records.update({
            where: { enquiry_id: enquiryId },
            data: { mobilizer_id: mobilizerId },
            select: {
                enquiry_id: true,
                enquiry_first_name: true,
                enquiry_last_name: true,
                mobilizer_id: true,
                mobilizer_details: {
                    select: {
                        mobilizer_id: true,
                        mobilizer_first_name: true,
                        mobilizer_last_name: true,
                        mobilizer_unique_id: true
                    }
                }
            }
        });

        return res.status(200).json(
            new ApiResponse(200, updatedEnquiry, "Enquiry assigned to mobilizer successfully")
        );
    }
);