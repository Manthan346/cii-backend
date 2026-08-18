import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

/**
 * Edit candidate address — candidate can update their current and permanent address.
 *
 * Identity comes from token (req.user.user_id), never from body.
 * Allowed fields: candidate_current_address, candidate_permanent_address,
 * current_city, current_district, current_pin_code, current_state_name,
 * permanent_city, permanent_district, permanent_pin_code, permanent_state_name.
 *
 * Prisma schema notes:
 *  - current_pin_code is String? (stored as text)
 *  - permanent_pin_code is String? (stored as text)
 *
 * After update, Redis cache for candidate profile is invalidated so next fetch
 * returns fresh data.
 */
export const editCandidateAddress = asyncHandler(
    async (req: CandidateAuthRequest, res: Response) => {
        const userId = req.user?.user_id;

        if (!userId) {
            throw new ApiError(401, "Candidate not authenticated");
        }

        // Body already validated by validateBody middleware
        const {
            candidate_current_address,
            candidate_permanent_address,
            current_city,
            current_district,
            current_pin_code,
            current_state_name,
            permanent_city,
            permanent_district,
            permanent_pin_code,
            permanent_state_name,
        } = req.body;

        // Build update payload from ONLY allowed columns
        // Prisma schema has both pin_code fields as String?
        const data: any = {};

        if (candidate_current_address !== undefined)
            data.candidate_current_address = candidate_current_address;
        if (candidate_permanent_address !== undefined)
            data.candidate_permanent_address = candidate_permanent_address;
        if (current_city !== undefined) data.current_city = current_city;
        if (current_district !== undefined) data.current_district = current_district;
        if (current_pin_code !== undefined) data.current_pin_code = current_pin_code;
        if (current_state_name !== undefined) data.current_state_name = current_state_name;
        if (permanent_city !== undefined) data.permanent_city = permanent_city;
        if (permanent_district !== undefined)
            data.permanent_district = permanent_district;
        if (permanent_pin_code !== undefined) data.permanent_pin_code = permanent_pin_code;
        if (permanent_state_name !== undefined)
            data.permanent_state_name = permanent_state_name;

        // Update the candidate record
        const updated = await prisma.candidates_details.update({
            where: { user_id: userId },
            data,
            select: {
                candidate_id: true,
                candidate_current_address: true,
                candidate_permanent_address: true,
                current_city: true,
                current_district: true,
                current_pin_code: true,
                current_state_name: true,
                permanent_city: true,
                permanent_district: true,
                permanent_pin_code: true,
                permanent_state_name: true,
            },
        });

        // Invalidate Redis cache so next profile fetch returns fresh data
        const cacheKey = CANDIDATE_REDIS_KEYS.candidate_profile_key(userId);
        try {
            await redis.del(cacheKey);
        } catch (err) {
            console.error("Redis DEL failed for profile cache:", err);
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    address: {
                        candidate_current_address: updated.candidate_current_address,
                        candidate_permanent_address: updated.candidate_permanent_address,
                        current_city: updated.current_city,
                        current_district: updated.current_district,
                        current_pin_code: updated.current_pin_code,
                        current_state_name: updated.current_state_name,
                        permanent_city: updated.permanent_city,
                        permanent_district: updated.permanent_district,
                        permanent_pin_code: updated.permanent_pin_code,
                        permanent_state_name: updated.permanent_state_name,
                    },
                },
                "Address updated successfully"
            )
        );
    }
);