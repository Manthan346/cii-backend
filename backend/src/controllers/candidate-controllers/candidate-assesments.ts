import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const candidateAssessments = asyncHandler(
    async (req: CandidateAuthRequest, res: Response) => {

        const candidateId = req.candidate?.candidate_id;

        if (!candidateId) {
            throw new ApiError(
                404,
                "Candidate id not found."
            );
        }

        const records =
            await prisma.candidate_assessment.findMany({
                where: {
                    candidate_id: candidateId
                },
                select: {
                    attempted_at: true,
                    assessment_grade: true,

                    assessments: {
                        select: {
                            title: true,
                            assessment_type: true,
                            assessment_date: true
                        }
                    }
                }
            });

        /*
         * Convert the internal database date back to the
         * actual assessment date for the candidate.
         *
         * Database:
         *     2026-09-09
         *
         * Candidate sees:
         *     2026-09-08
         *
         * The database date represents the exclusive
         * expiry date.
         */
        const formattedRecords = records.map((record) => {

            const displayDate =
                new Date(record.assessments.assessment_date);

            displayDate.setUTCDate(
                displayDate.getUTCDate() - 1
            );

            return {
                ...record,

                assessments: {
                    ...record.assessments,

                    assessment_date:
                        displayDate
                }
            };
        });

        const completed = formattedRecords.filter(
            (record) =>
                record.assessment_grade !== null
        );

        const pending = formattedRecords.filter(
            (record) =>
                record.assessment_grade === null
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    completedCount:
                        completed.length,

                    pendingCount:
                        pending.length,

                    completed,

                    pending
                },
                "Assessments fetched successfully."
            )
        );
    }
);

export default candidateAssessments;

