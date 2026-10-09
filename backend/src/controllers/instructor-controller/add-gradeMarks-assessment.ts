import { Response } from "express";
import { grade_types } from "../../generated/prisma/enums";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";

export const gradeCandidateAssessment = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const assessment_id = req.params.assessment_id;
        const ca_record_id = req.params.ca_record_id;

        const company_id = req.instructor?.company_id;

        if (!company_id) {
            throw new ApiError(
                401,
                "Instructor company information not found"
            );
        }

        if (
            typeof assessment_id !== "string" ||
            typeof ca_record_id !== "string"
        ) {
            throw new ApiError(400, "Invalid assessment or attempt ID");
        }

        // Validate request body
        const body = req.body;

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            throw new ApiError(400, "Invalid request body");
        }

        const allowedFields = [
            "candidate_marks",
            "assessment_grade",
        ];

        if (
            Object.keys(body).some(
                (key) => !allowedFields.includes(key)
            )
        ) {
            throw new ApiError(
                400,
                "Only candidate_marks and assessment_grade are allowed"
            );
        }

        const hasMarks = Object.prototype.hasOwnProperty.call(
            body,
            "candidate_marks"
        );

        const hasGrade = Object.prototype.hasOwnProperty.call(
            body,
            "assessment_grade"
        );

        if (!hasMarks && !hasGrade) {
            throw new ApiError(
                400,
                "Provide candidate_marks, assessment_grade, or both"
            );
        }

        // Validate marks when supplied
        if (hasMarks) {
            if (
                typeof body.candidate_marks !== "number" ||
                !Number.isInteger(body.candidate_marks) ||
                body.candidate_marks < 0 ||
                body.candidate_marks > 999
            ) {
                throw new ApiError(
                    400,
                    "candidate_marks must be an integer between 0 and 999"
                );
            }
        }

        // Validate grade when supplied
        const validGrades = ["A", "B", "C", "D", "F"];

        if (
            hasGrade &&
            (
                typeof body.assessment_grade !== "string" ||
                !validGrades.includes(body.assessment_grade)
            )
        ) {
            throw new ApiError(
                400,
                "assessment_grade must be A, B, C, D, or F"
            );
        }

        // Verify attempt and company authorization
        const attempt = await prisma.candidate_assessment.findFirst({
            where: {
                ca_record_id,
                assessment_id,
                assessments: {
                    batch_details: {
                        course_details: {
                            company_id,
                        },
                    },
                },
            },
            select: {
                ca_record_id: true,
            },
        });

        if (!attempt) {
            throw new ApiError(
                404,
                "Assessment attempt not found or you are not authorized to access it"
            );
        }

        // Update only the fields provided by the instructor
        const updateData: {
            candidate_marks?: number;
            assessment_grade?: grade_types;
        } = {};

        if (hasMarks) {
            updateData.candidate_marks = body.candidate_marks;
        }

        if (hasGrade) {
            updateData.assessment_grade =
                body.assessment_grade as grade_types;
        }

        const updatedAttempt =
            await prisma.candidate_assessment.update({
                where: {
                    ca_record_id: attempt.ca_record_id,
                },
                data: updateData,
                select: {
                    ca_record_id: true,
                    assessment_id: true,
                    candidate_id: true,
                    attempted_at: true,
                    candidate_marks: true,
                    assessment_grade: true,
                    updated_at: true,
                    candidates_details: {
                        select: {
                            candidate_first_name: true,
                            candidate_last_name: true,
                            candidate_unique_id: true,
                        },
                    },
                },
            });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    ca_record_id: updatedAttempt.ca_record_id,
                    assessment_id: updatedAttempt.assessment_id,
                    candidate_id: updatedAttempt.candidate_id,
                    candidate_unique_id:
                        updatedAttempt.candidates_details.candidate_unique_id,
                    candidate_name: [
                        updatedAttempt.candidates_details.candidate_first_name,
                        updatedAttempt.candidates_details.candidate_last_name,
                    ]
                        .filter(Boolean)
                        .join(" "),
                    attempted_at: updatedAttempt.attempted_at,
                    candidate_marks: updatedAttempt.candidate_marks,
                    assessment_grade: updatedAttempt.assessment_grade,
                    updated_at: updatedAttempt.updated_at,
                },
                "Candidate assessment graded successfully"
            )
        );
    }
);
