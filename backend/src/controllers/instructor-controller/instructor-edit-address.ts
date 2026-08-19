import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { editInstructorAddressSchema } from "../../services/zod/instructor/instructor-edit-address-schema";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

/**
 * Edit instructor address — instructor can edit current and permanent address.
 *
 * Identity comes from token (req.instructor.instructor_id), never from body.
 * Allowed fields: current_address fields (current_city, current_state, current_district, current_taluka, current_pincode, current_address)
 * and permanent_address fields (permanent_city, permanent_state, permanent_district, permanent_taluka, permanent_pincode, permanent_address).
 * After update, the instructor profile response will reflect the new values.
 */
export const instructorEditAddress = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;

        if (!instructorId) {
            throw new ApiError(401, "Instructor not authenticated");
        }

        // Body already validated by validateBody middleware
        const {
            // Current address fields
            current_city,
            current_state,
            current_district,
            current_taluka,
            current_pincode,
            current_address,
            // Permanent address fields
            permanent_city,
            permanent_state,
            permanent_district,
            permanent_taluka,
            permanent_pincode,
            permanent_address,
        } = req.body;

        // Build update payload from ONLY allowed columns
        const data: {
            current_city?: string;
            current_state?: string;
            current_district?: string;
            current_taluka?: string;
            current_pincode?: string;
            current_address?: string;
            permanent_city?: string;
            permanent_state?: string;
            permanent_district?: string;
            permanent_taluka?: string;
            permanent_pincode?: string;
            permanent_address?: string;
        } = {};

        // Current address fields
        if (current_city !== undefined) data.current_city = current_city;
        if (current_state !== undefined) data.current_state = current_state;
        if (current_district !== undefined) data.current_district = current_district;
        if (current_taluka !== undefined) data.current_taluka = current_taluka;
        if (current_pincode !== undefined) data.current_pincode = current_pincode;
        if (current_address !== undefined) data.current_address = current_address;

        // Permanent address fields
        if (permanent_city !== undefined) data.permanent_city = permanent_city;
        if (permanent_state !== undefined) data.permanent_state = permanent_state;
        if (permanent_district !== undefined) data.permanent_district = permanent_district;
        if (permanent_taluka !== undefined) data.permanent_taluka = permanent_taluka;
        if (permanent_pincode !== undefined) data.permanent_pincode = permanent_pincode;
        if (permanent_address !== undefined) data.permanent_address = permanent_address;

        // Update the instructor record
        const updated = await prisma.instructor_details.update({
            where: { instructor_id: instructorId },
            data,
            select: {
                instructor_id: true,
                current_city: true,
                current_state: true,
                current_district: true,
                current_taluka: true,
                current_pincode: true,
                current_address: true,
                permanent_city: true,
                permanent_state: true,
                permanent_district: true,
                permanent_taluka: true,
                permanent_pincode: true,
                permanent_address: true,
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    profile: {
                        current_address: {
                            current_city: updated.current_city,
                            current_state: updated.current_state,
                            current_district: updated.current_district,
                            current_taluka: updated.current_taluka,
                            current_pincode: updated.current_pincode,
                            current_address: updated.current_address,
                        },
                        permanent_address: {
                            permanenet_city: updated.permanent_city,
                            permanent_state: updated.permanent_state,
                            permanent_district: updated.permanent_district,
                            permanent_taluka: updated.permanent_taluka,
                            permanent_pincode: updated.permanent_pincode,
                            permanent_address: updated.permanent_address,
                        },
                    },
                },
                "Address updated successfully"
            )
        );
    }
);