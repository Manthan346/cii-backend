
import { Response } from "express";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";

export const getCandidateCertificates = asyncHandler(
    async (req: CandidateAuthRequest, res: Response) => {

        const candidateId = req.candidate?.candidate_id;

        if (!candidateId) {
            throw new ApiError(401, "Candidate authentication required.");
        }

        const certificates = await prisma.batch_enrollment.findMany({
            where: {
                candidate_id: candidateId,
                certificate_url: {
                    not: null
                }
            },
            select: {
                enrollment_id: true,
                batch_id: true,
                certificate_url: true,
                batch_details: {
                    select: {
                        batch_code: true,
                        course_details: {
                            select: {
                                course_name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                enrollment_id: "desc"
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                certificates,
                "Certificates fetched successfully."
            )
        );
    }
);