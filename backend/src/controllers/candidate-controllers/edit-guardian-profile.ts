import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

/**
 * Edit candidate guardian profile — candidate can update guardian, father, and mother details.
 *
 * Identity comes from token (req.user.user_id), never from body.
 * Allowed fields: guardian (name, relationship, blood_group, phone, occupation, address, gender, dob),
 * father (name, occupation, phone, blood_group, address), mother (name, occupation, phone, blood_group, address).
 *
 * After update, Redis cache for candidate guardian is invalidated so next fetch
 * returns fresh data.
 */
export const editGuardianProfile = asyncHandler(
    async (req: CandidateAuthRequest, res: Response) => {
        const userId = req.user?.user_id;

        if (!userId) {
            throw new ApiError(401, "Candidate not authenticated");
        }

        const {
            // Guardian fields
            guardian_name,
            guardian_relationship,
            guardian_blood_group,
            guardian_phone_no,
            guardian_occupation,
            guardian_address,
            guardian_gender,
            guardian_dob,
            // Father fields
            father_name,
            father_occupation,
            father_phone_no,
            father_blood_group,
            father_address,
            // Mother fields
            mother_name,
            mother_occupation,
            mother_phone_no,
            mother_blood_group,
            mother_address,
        } = req.body;

        // Build update payload from ONLY allowed columns
        const data: any = {};

        // Guardian
        if (guardian_name !== undefined) data.guardian_name = guardian_name;
        if (guardian_relationship !== undefined) data.guardian_relationship = guardian_relationship;
        if (guardian_blood_group !== undefined) data.guardian_blood_group = guardian_blood_group;
        if (guardian_phone_no !== undefined) data.guardian_phone_no = guardian_phone_no;
        if (guardian_occupation !== undefined) data.guardian_occupation = guardian_occupation;
        if (guardian_address !== undefined) data.guardian_address = guardian_address;
        if (guardian_gender !== undefined) data.guardian_gender = guardian_gender;
        if (guardian_dob !== undefined) data.guardian_dob = guardian_dob;

        // Father
        if (father_name !== undefined) data.father_name = father_name;
        if (father_occupation !== undefined) data.father_occupation = father_occupation;
        if (father_phone_no !== undefined) data.father_phone_no = father_phone_no;
        if (father_blood_group !== undefined) data.father_blood_group = father_blood_group;
        if (father_address !== undefined) data.father_address = father_address;

        // Mother
        if (mother_name !== undefined) data.mother_name = mother_name;
        if (mother_occupation !== undefined) data.mother_occupation = mother_occupation;
        if (mother_phone_no !== undefined) data.mother_phone_no = mother_phone_no;
        if (mother_blood_group !== undefined) data.mother_blood_group = mother_blood_group;
        if (mother_address !== undefined) data.mother_address = mother_address;

        // Update the candidate record
        const updated = await prisma.candidates_details.update({
            where: { user_id: userId },
            data,
            select: {
                candidate_id: true,
                guardian_name: true,
                guardian_relationship: true,
                guardian_blood_group: true,
                guardian_phone_no: true,
                guardian_occupation: true,
                guardian_address: true,
                guardian_gender: true,
                guardian_dob: true,
                father_name: true,
                father_occupation: true,
                father_phone_no: true,
                father_blood_group: true,
                father_address: true,
                mother_name: true,
                mother_occupation: true,
                mother_phone_no: true,
                mother_blood_group: true,
                mother_address: true,
            },
        });

        // Invalidate Redis cache so next guardian fetch returns fresh data
        const cacheKey = CANDIDATE_REDIS_KEYS.candidate_guardian_key(updated.candidate_id);
        try {
            await redis.del(cacheKey);
        } catch (err) {
            console.error("Redis DEL failed for guardian cache:", err);
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    guardianDetails: {
                        fatherDetails: {
                            name: updated.father_name,
                            blood_group: updated.father_blood_group,
                            occupation: updated.father_occupation,
                            phone_no: updated.father_phone_no,
                            address: updated.father_address,
                        },
                        motherDetails: {
                            name: updated.mother_name,
                            blood_group: updated.mother_blood_group,
                            occupation: updated.mother_occupation,
                            phone_no: updated.mother_phone_no,
                            address: updated.mother_address,
                        },
                        guardianDetails: {
                            name: updated.guardian_name,
                            blood_group: updated.guardian_blood_group,
                            occupation: updated.guardian_occupation,
                            phone_no: updated.guardian_phone_no,
                            relationship: updated.guardian_relationship,
                            gender: updated.guardian_gender,
                            dob: updated.guardian_dob,
                        },
                    },
                },
                "Guardian profile updated successfully"
            )
        );
    }
);