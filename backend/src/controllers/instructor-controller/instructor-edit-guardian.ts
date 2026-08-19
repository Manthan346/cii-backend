import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { editInstructorGuardianSchema } from "../../services/zod/instructor/instructor-edit-guardian-schema";

/**
 * Edit instructor guardian details — instructor can update guardian, father, and mother details.
 *
 * Identity comes from token (req.instructor.instructor_id), never from body.
 *
 * API request field → DB column mapping:
 *  - guardian_name         -> instructor_guardian_name
 *  - guardian_relationship  -> instructor_guardian_relationship
 *  - guardian_occupation    -> instructor_guardian_occupation
 *  - guardian_phone_no      -> instructor_guardian_contact_no
 *  - guardian_address        -> instructor_guardian_address
 *  - guardian_blood_group   -> instructor_guardian_blood_group
 *  - guardian_dob           -> guardian_dob (Date)
 *  - father_address          -> father_current_address
 *  - father_dob              -> father_dob (Date)
 *  - mother_address          -> mother_current_address
 *  - mother_dob              -> mother_dob (Date)
 *  (father_name, father_occupation, father_phone_no, father_blood_group,
 *   mother_name, mother_occupation, mother_phone_no, mother_blood_group map 1:1)
 *
 * After update, the instructor guardian response will reflect the new values.
 */
export const instructorEditGuardian = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;

        if (!instructorId) {
            throw new ApiError(401, "Instructor not authenticated");
        }

        const {
            // Guardian fields
            guardian_name,
            guardian_relationship,
            guardian_blood_group,
            guardian_phone_no,
            guardian_occupation,
            guardian_address,
            guardian_dob,
            // Father fields
            father_name,
            father_occupation,
            father_phone_no,
            father_blood_group,
            father_address,
            father_dob,
            // Mother fields
            mother_name,
            mother_occupation,
            mother_phone_no,
            mother_blood_group,
            mother_address,
            mother_dob,
        } = req.body;

        // Build update payload from ONLY allowed columns (DB field names)
        const data: {
            instructor_guardian_name?: string;
            instructor_guardian_relationship?: string;
            instructor_guardian_occupation?: string;
            instructor_guardian_contact_no?: string;
            instructor_guardian_address?: string;
            instructor_guardian_blood_group?: string;
            guardian_dob?: Date;
            father_name?: string;
            father_occupation?: string;
            father_phone_no?: string;
            father_blood_group?: string;
            father_current_address?: string;
            father_dob?: Date;
            mother_name?: string;
            mother_occupation?: string;
            mother_phone_no?: string;
            mother_blood_group?: string;
            mother_current_address?: string;
            mother_dob?: Date;
        } = {};

        // Guardian fields
        if (guardian_name !== undefined) data.instructor_guardian_name = guardian_name;
        if (guardian_relationship !== undefined) data.instructor_guardian_relationship = guardian_relationship;
        if (guardian_occupation !== undefined) data.instructor_guardian_occupation = guardian_occupation;
        if (guardian_phone_no !== undefined) data.instructor_guardian_contact_no = guardian_phone_no;
        if (guardian_address !== undefined) data.instructor_guardian_address = guardian_address;
        if (guardian_blood_group !== undefined) data.instructor_guardian_blood_group = guardian_blood_group;
        if (guardian_dob !== undefined) {
            const parsed = new Date(guardian_dob);
            if (!isNaN(parsed.getTime())) data.guardian_dob = parsed;
        }

        // Father fields
        if (father_name !== undefined) data.father_name = father_name;
        if (father_occupation !== undefined) data.father_occupation = father_occupation;
        if (father_phone_no !== undefined) data.father_phone_no = father_phone_no;
        if (father_blood_group !== undefined) data.father_blood_group = father_blood_group;
        if (father_address !== undefined) data.father_current_address = father_address;
        if (father_dob !== undefined) {
            const parsed = new Date(father_dob);
            if (!isNaN(parsed.getTime())) data.father_dob = parsed;
        }

        // Mother fields
        if (mother_name !== undefined) data.mother_name = mother_name;
        if (mother_occupation !== undefined) data.mother_occupation = mother_occupation;
        if (mother_phone_no !== undefined) data.mother_phone_no = mother_phone_no;
        if (mother_blood_group !== undefined) data.mother_blood_group = mother_blood_group;
        if (mother_address !== undefined) data.mother_current_address = mother_address;
        if (mother_dob !== undefined) {
            const parsed = new Date(mother_dob);
            if (!isNaN(parsed.getTime())) data.mother_dob = parsed;
        }

        // Update the instructor record
        const updated = await prisma.instructor_details.update({
            where: { instructor_id: instructorId },
            data,
            select: {
                instructor_guardian_name: true,
                instructor_guardian_relationship: true,
                instructor_guardian_occupation: true,
                instructor_guardian_contact_no: true,
                instructor_guardian_address: true,
                instructor_guardian_blood_group: true,
                guardian_dob: true,
                father_name: true,
                father_occupation: true,
                father_phone_no: true,
                father_blood_group: true,
                father_current_address: true,
                father_dob: true,
                mother_name: true,
                mother_occupation: true,
                mother_phone_no: true,
                mother_blood_group: true,
                mother_current_address: true,
                mother_dob: true,
            },
        });

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
                            address: updated.father_current_address,
                            dob: updated.father_dob,
                        },
                        motherDetails: {
                            name: updated.mother_name,
                            blood_group: updated.mother_blood_group,
                            occupation: updated.mother_occupation,
                            phone_no: updated.mother_phone_no,
                            address: updated.mother_current_address,
                            dob: updated.mother_dob,
                        },
                        guardianDetails: {
                            name: updated.instructor_guardian_name,
                            blood_group: updated.instructor_guardian_blood_group,
                            occupation: updated.instructor_guardian_occupation,
                            phone_no: updated.instructor_guardian_contact_no,
                            relationship: updated.instructor_guardian_relationship,
                            address: updated.instructor_guardian_address,
                            dob: updated.guardian_dob,
                        },
                    },
                },
                "Guardian details updated successfully"
            )
        );
    }
);