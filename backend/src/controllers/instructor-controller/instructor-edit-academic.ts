import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../..//helpers/ApiError";
import { ApiResponse } from "../..//helpers/ApiResponse";
import { editInstructorAcademicSchema } from "../../services/zod/instructor/instructor-edit-academic-schema";


export const instructorEditAcademic = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;

        if (!instructorId) {
            throw new ApiError(401, "Instructor not authenticated");
        }

        // Body already validated by validateBody middleware
        const {
            // Education fields
            highest_qualification,
            specialization,
            university,
            passing_year,
            additional_qualifications,
            // Experience fields
            total_experience,
            previous_organization,
            role,
        } = req.body;

        // Build update payload from ONLY allowed columns (DB field names)
        const data: {
            highest_qualification?: string;
            specialization?: string;
            instructor_university?: string;
            instructor_passing_year?: string;
            qualification?: string[];
            experience_years?: number;
            instructor_prev_org?: string;
            instructor_prev_org_designation?: string;
        } = {};

        // Education fields
        if (highest_qualification !== undefined) data.highest_qualification = highest_qualification;
        if (specialization !== undefined) data.specialization = specialization;
        if (university !== undefined) data.instructor_university = university;
        if (passing_year !== undefined) data.instructor_passing_year = passing_year;
        if (additional_qualifications !== undefined) {
            // qualification is a String[] — split comma-separated string into array
            data.qualification = additional_qualifications
                .split(",")
                .map((q: string) => q.trim())
                .filter((q: string) => q.length > 0);
        }

        // Experience fields
        if (total_experience !== undefined) {
            // experience_years is an Int — parse the numeric part of the string
            const parsed = parseInt(total_experience, 10);
            if (!isNaN(parsed)) data.experience_years = parsed;
        }
        if (previous_organization !== undefined) data.instructor_prev_org = previous_organization;
        if (role !== undefined) data.instructor_prev_org_designation = role;

        // Update the instructor record
        const updated = await prisma.instructor_details.update({
            where: { instructor_id: instructorId },
            data,
            select: {
                highest_qualification: true,
                specialization: true,
                instructor_university: true,
                instructor_passing_year: true,
                qualification: true,
                experience_years: true,
                instructor_prev_org: true,
                instructor_prev_org_designation: true,
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    academics: {
                        education: {
                            highestQualification: updated.highest_qualification,
                            specialization: updated.specialization,
                            university: updated.instructor_university,
                            passingYear: updated.instructor_passing_year,
                            additionalQualifications: updated.qualification,
                        },
                        experience: {
                            totalExperience: updated.experience_years,
                            previousOrganisation: updated.instructor_prev_org,
                            role: updated.instructor_prev_org_designation,
                        },
                    },
                },
                "Academic details updated successfully"
            )
        );
    }
);