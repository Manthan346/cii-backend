import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";
import { batch_enrollment_status_type } from "../../generated/prisma/enums";
import { ApiResponse } from "../../helpers/ApiResponse";


export const getAllAssessments = asyncHandler(
    async(req:CandidateAuthRequest,res:Response) => {
        const candidateId = req.candidate?.candidate_id;

        if (!req.pagination) {
            throw new ApiError(500, "Pagination middleware not found");
        }
        const { page, limit, skip } = req.pagination;

        if (!candidateId) {
            throw new ApiError(401, "Candidate not found");
        }

        const enrollments = await prisma.batch_enrollment.findMany({
            where: {
                candidate_id: candidateId,
                enrollment_status: batch_enrollment_status_type.ACTIVE,
            },
            select: {
                batch_id: true,
            },
        });

        const batchIds = enrollments.map((e) => e.batch_id);
        console.log(batchIds);
        if (batchIds.length === 0) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        totalAvailable: 0,
                        assessments: [],
                    },
                    "No active batch enrollments found."
                )
            );
        }

        const attemptedAssessments = await prisma.candidate_assessment.findMany({
            where: {
                candidate_id: candidateId,
            },
            select: {
                assessment_id: true,
            },
        });

        const attemptedIds = attemptedAssessments.map(
            (assessment) => assessment.assessment_id
        );
        
        console.log(attemptedIds);

        const assessments = await prisma.assessments.findMany({
            where: {
                batch_id: {
                    in: batchIds,
                },
                is_show: true,
                assessment_id: {
                    notIn: attemptedIds,
                },
            },
            orderBy: {
                assessment_date: "asc",
            },
            skip,
            take: limit,
            select: {
                assessment_id: true,
                title: true,
                assessment_desc: true,
                assessment_type: true,
                assessment_date: true,
                assessment_duration: true,
                assessment_link: true,
                batch_details: {
                    select: {
                        batch_name: true,
                        batch_code: true,
                    },
                },
            },
        });
        console.log("Assessments:", assessments);
        
        const totalAvailable = await prisma.assessments.count({
            where: {
                batch_id: {
                    in: batchIds,
                },
                is_show: true,
                assessment_id: {
                    notIn: attemptedIds,
                },
            },
        });


        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    page,
                    limit,
                    totalAvailable,
                    totalPages: Math.ceil(totalAvailable / limit),
                    assessments,
                },
                "Available assessments fetched successfully"
            )
        );

    }
)