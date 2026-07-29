import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { batch_enrollment_status_type } from "../../generated/prisma/enums";

interface AssessmentParams {
    assessment_id: string;
}


export const startAssessment = asyncHandler(
    async (req: CandidateAuthRequest & { params: AssessmentParams }, res: Response) => {

        const candidateId = req.candidate?.candidate_id;
        const { assessment_id } = req.params;

        if (!candidateId) {
            throw new ApiError(401, "Unauthorized.");
        }

        // Check assessment exists
        const assessment = await prisma.assessments.findUnique({
            where: {
                assessment_id,
            },
            select: {
                assessment_id: true,
                batch_id: true,
                assessment_link: true,
                assessment_date: true,
                is_show: true,
            },
        });

        if (!assessment) {
            throw new ApiError(404, "Assessment not found.");
        }

        if (!assessment.is_show) {
            throw new ApiError(403, "Assessment is not available.");
        }

        const now = new Date();
        if (assessment.assessment_date < now) {
            throw new ApiError(
                403,
                "The assessment due date has passed. You can no longer attempt this assessment."
            );
        }

        // Verify candidate belongs to batch
        const enrollment = await prisma.batch_enrollment.findFirst({
            where: {
                candidate_id: candidateId,
                batch_id: assessment.batch_id,
                enrollment_status: batch_enrollment_status_type.ACTIVE,
            },
        });

        if (!enrollment) {
            throw new ApiError(
                403,
                "You are not enrolled in this batch."
            );
        }

        // Prevent duplicate attempts
        const existingAttempt = await prisma.candidate_assessment.findFirst({
            where: {
                candidate_id: candidateId,
                assessment_id,
            },
        });

        if (existingAttempt) {
            throw new ApiError(
                409,
                "Assessment has already been started."
            );
        }

        // Create attempt
        const candidateAssessment =
            await prisma.candidate_assessment.create({
                data: {
                    candidate_id: candidateId,
                    assessment_id,
                },
            });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    ca_record_id:
                        candidateAssessment.ca_record_id,
                    assessment_id:
                        candidateAssessment.assessment_id,
                    assessment_link:
                        assessment.assessment_link,
                    attempted_at:
                        candidateAssessment.attempted_at,
                },
                "Assessment started successfully."
            )
        );
    }
);