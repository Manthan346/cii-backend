import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { upload } from "../../middlewares/multer-middleware/multer";
import { uploadCloudnary } from "../../services/cloudinary";

/**
 * Edit candidate profile — candidate can update their basic details + profile photo.
 *
 * Identity comes from token (req.user.user_id), never from body.
 * Allowed fields: first_name, last_name, gender, date_of_birth, blood_group,
 * highest_qualification, profile_photo (Cloudinary URL from upload middleware).
 *
 * After update, Redis cache for candidate profile is invalidated so next fetch
 * returns fresh data.
 */
export const editCandidateProfile = asyncHandler(
    async (req: CandidateAuthRequest, res: Response) => {
        const userId = req.user?.user_id;

        if (!userId) {
            throw new ApiError(401, "Candidate not authenticated");
        }

        // Body already validated by validateBody middleware
        // upload.single('profile_photo') middleware sets req.file with diskStorage path
        // Upload to Cloudinary and get secure URL
        const profile_photo = (await uploadCloudnary(req.file?.path || ''))?.secure_url || undefined;

        const {
            first_name,
            last_name,
            gender,
            date_of_birth,
            blood_group,
            emergency_contact_no,
            contact_number,
            highest_qualification,
            pancard_no,
            aadhar_card,
            qualification_percentage





        
        } = req.body;

        // Build update payload from ONLY allowed columns
        const data: {
            candidate_first_name?: string;
            candidate_last_name?: string;
            gender?: string;
            date_of_birth?: Date;
            blood_group?: string;
            candidate_emergency_contact_no?: string;
            contact_number?: string;
            highest_qualification?: string;
            pan_card_no?: string,
            aadhar_card_no?: string,
            qualification_percentage?: string,

         
            profile_photo?: string;
        } = {};

        if (first_name !== undefined) data.candidate_first_name = first_name;
        if (last_name !== undefined) data.candidate_last_name = last_name;
        if (gender !== undefined) data.gender = gender;
        if (date_of_birth !== undefined) {
            const parsed = new Date(date_of_birth);
            if (!isNaN(parsed.getTime())) data.date_of_birth = parsed;
        }
        if (blood_group !== undefined) data.blood_group = blood_group;
        if (emergency_contact_no !== undefined) data.candidate_emergency_contact_no = emergency_contact_no;
        if (contact_number !== undefined) data.contact_number = contact_number;
        if (highest_qualification !== undefined) data.highest_qualification = highest_qualification;
        if (pancard_no !== undefined) data.pan_card_no = pancard_no;
        if (aadhar_card !== undefined) data.aadhar_card_no = aadhar_card;
        if (qualification_percentage !== undefined) data.qualification_percentage = qualification_percentage;

        if (profile_photo !== undefined) data.profile_photo = profile_photo;

        // Update the candidate record
        const updated = await prisma.candidates_details.update({
            where: { user_id: userId },
            data,
            select: {
                candidate_id: true,
                candidate_first_name: true,
                candidate_last_name: true,
                contact_number: true,
                gender: true,
                date_of_birth: true,
                blood_group: true,
                candidate_emergency_contact_no: true,
                
                highest_qualification: true,
                candidate_current_address: true,
                candidate_permanent_address: true,
                profile_photo: true,

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
                    profile: {
                        candidate_id: updated.candidate_id,
                        first_name: updated.candidate_first_name,
                        last_name: updated.candidate_last_name,
                        contact_number: updated.contact_number,
                        gender: updated.gender,
                        date_of_birth: updated.date_of_birth,
                        blood_group: updated.blood_group,
                        highest_qualification: updated.highest_qualification,
                        profile_photo: updated.profile_photo,
                    },
                },
                "Profile updated successfully"
            )
        );
    }
);