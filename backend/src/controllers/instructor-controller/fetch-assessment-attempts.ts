
import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";

export const getAssessmentAttempts = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const assessment_id = req.params.assessment_id;
        if (typeof assessment_id !== "string") {
            throw new ApiError(400, "Invalid assessment ID");
        }

        const company_id = req.instructor?.company_id;

        if (!company_id) {
            throw new ApiError(
                401,
                "Instructor company information not found"
            );
        }

        if (!assessment_id) {
            throw new ApiError(400, "Assessment ID is required");
        }

        // Pagination
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            throw new ApiError(
                400,
                "Page must be positive and limit must be between 1 and 100"
            );
        }

        const skip = (page - 1) * limit;

        // Search by candidate name or candidate_unique_id
        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        // Verify assessment ownership through the course's company
        const assessment = await prisma.assessments.findFirst({
            where: {
                assessment_id,
                batch_details: {
                    course_details: {
                        company_id,
                    },
                },
            },
            select: {
                assessment_id: true,
                title: true,
                batch_id: true,
            },
        });

        if (!assessment) {
            throw new ApiError(
                404,
                "Assessment not found or you are not authorized to access it"
            );
        }

        // Build the candidate search filter
        const where = {
            assessment_id: assessment.assessment_id,
            ...(search
                ? {
                      candidates_details: {
                          OR: [
                              {
                                  candidate_first_name: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                              {
                                  candidate_last_name: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                              {
                                  candidate_unique_id: {
                                      contains: search,
                                      mode: "insensitive" as const,
                                  },
                              },
                          ],
                      },
                  }
                : {}),
        };

        // Fetch records and total count together
        const [totalRecords, attempts] = await prisma.$transaction([
            prisma.candidate_assessment.count({
                where,
            }),

            prisma.candidate_assessment.findMany({
                where,
                select: {
                    ca_record_id: true,
                    candidate_id: true,
                    attempted_at: true,
                    candidate_marks: true,
                    assessment_grade: true,
                    candidates_details: {
                        select: {
                            candidate_first_name: true,
                            candidate_last_name: true,
                            candidate_unique_id: true,
                        },
                    },
                },
                orderBy: {
                    attempted_at: "desc",
                },
                skip,
                take: limit,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / limit);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    assessment: {
                        assessment_id: assessment.assessment_id,
                        title: assessment.title,
                        batch_id: assessment.batch_id,
                    },
                    attempts: attempts.map((attempt) => ({
                        ca_record_id: attempt.ca_record_id,
                        candidate_id: attempt.candidate_id,
                        candidate_unique_id:
                            attempt.candidates_details.candidate_unique_id,
                        candidate_name: [
                            attempt.candidates_details.candidate_first_name,
                            attempt.candidates_details.candidate_last_name,
                        ]
                            .filter(Boolean)
                            .join(" "),
                        attempted_at: attempt.attempted_at,
                        candidate_marks: attempt.candidate_marks,
                        assessment_grade: attempt.assessment_grade,
                    })),
                    pagination: {
                        currentPage: page,
                        limit,
                        totalRecords,
                        totalPages,
                        hasNextPage: page < totalPages,
                        hasPreviousPage: page > 1,
                    },
                },
                "Assessment attempts fetched successfully"
            )
        );
    }
);
