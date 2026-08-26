import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { editInstructorProfileSchema } from "../../services/zod/instructor/instructor-edit-schema";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { upload } from "../../middlewares/multer-middleware/multer";
import { uploadCloudnary } from "../../services/cloudinary";

/**
 * Edit instructor profile — instructor can edit name, gender, dob, blood group, highest qualification, designation.
 *
 * Identity comes from token (req.instructor.instructor_id), never from body.
 * Allowed fields: first_name, last_name, gender, date_of_birth, blood_group, highest_qualification, designation.
 *
 * After update, the instructor profile response will reflect the new values.
 */
export const instructorEditProfile = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;

        if (!instructorId) {
            throw new ApiError(401, "Instructor not authenticated");
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
            highest_qualification,
            designation,
            contact_number,
            emergency_contact,

        } = req.body;

        // Build update payload from ONLY allowed columns
        const data: {
            instructor_first_name?: string;
            instructor_last_name?: string;
            gender?: string;
            date_of_birth?: Date;
            instructor_blood_group?: string;
            highest_qualification?: string;
            instructor_designation?: string;
            profile_photo?: string;
            contact_number?: string;
            emergency_contact?: string;

        } = {};

        if (first_name !== undefined) data.instructor_first_name = first_name;
        if (last_name !== undefined) data.instructor_last_name = last_name;
        if (gender !== undefined) data.gender = gender;
        if (date_of_birth !== undefined) {
            const parsed = new Date(date_of_birth);
            if (!isNaN(parsed.getTime())) data.date_of_birth = parsed;
        }
        if (blood_group !== undefined) data.instructor_blood_group = blood_group;
        if (highest_qualification !== undefined) data.highest_qualification = highest_qualification;
        if (designation !== undefined) data.instructor_designation = designation;
        if (contact_number !== undefined) data.contact_number = contact_number;
        if (emergency_contact !== undefined) data.emergency_contact = emergency_contact;
        if (profile_photo !== undefined) data.profile_photo = profile_photo;

        // Update the instructor record
        const updated = await prisma.instructor_details.update({
            where: { instructor_id: instructorId },
            data,
            select: {
                instructor_id: true,
                instructor_first_name: true,
                instructor_last_name: true,
                gender: true,
                date_of_birth: true,
                instructor_blood_group: true,
                highest_qualification: true,
                profile_photo: true,
                contact_number: true,
                emergency_contact: true,
                instructor_designation: true
                
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    profile: {
                        first_name: updated.instructor_first_name,
                        last_name: updated.instructor_last_name,
                        gender: updated.gender,
                        date_of_birth: updated.date_of_birth,
                        blood_group: updated.instructor_blood_group,
                        highest_qualification: updated.highest_qualification,
                        designation: updated.instructor_designation,
                        profile_photo: updated.profile_photo,
                        contact_number: updated.contact_number,
                        emergency_contact: updated.emergency_contact,
                    },
                },
                "Profile updated successfully"
            )
        );
    }
);