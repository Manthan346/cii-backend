import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { batch_enrollment_status_type } from "../../generated/prisma/enums";
import { z } from "zod";

export const getAllCandidateStudyMaterial = asyncHandler(
    async(req:CandidateAuthRequest,res:Response) => {
        const candidate_id = req.candidate?.candidate_id;
        

        const batchIdSchema = z.object({
            batch_id: z.string().uuid("Invalid Batch ID"),
        });

        const validation = batchIdSchema.safeParse(req.query);

        if (!validation.success) {
            throw new ApiError(
                400,
                validation.error.issues[0]?.message || "Invalid request"
            );
        }

        const { batch_id } = validation.data;
        

        if (!batch_id) {
            throw new ApiError(400, "Batch ID is required");
        }

        const enrollment = await prisma.batch_enrollment.findFirst({
            where : {
                 candidate_id,
                 batch_id,
                 enrollment_status: batch_enrollment_status_type.ACTIVE
            },
        }
        )

        if (!enrollment) {
            throw new ApiError(403, "You are not enrolled in this batch");
        }

        if (!req.pagination) {
            throw new ApiError(500, "Pagination middleware not found");
        }

        const { page, limit, skip } = req.pagination;


        if (page < 1) {
            throw new ApiError(400, "Page must be greater than or equal to 1");
        }

        if (limit < 1 || limit > 50) {
            throw new ApiError(400, "Limit must be between 1 and 50");
        }

        const [studyMaterials, totalItems] = await Promise.all([
            prisma.study_material.findMany({
                where: {
                    batch_id,
                    is_show: true,
                },
                include: {
                    batch_details: {
                        select: {
                            batch_name: true,
                        },
                    },
                    user_login: {
                        select: {
                            instructor_details: {
                                select: {
                                    instructor_first_name: true,
                                    instructor_last_name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
                skip,
                take: limit,
            }),

            prisma.study_material.count({
                where: {
                    batch_id,
                    is_show: true,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json(
            new ApiResponse(200, {
                studyMaterials,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages,
                },
            })
        );
    }
)