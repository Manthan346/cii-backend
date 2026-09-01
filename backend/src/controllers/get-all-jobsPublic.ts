import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../helpers/asyncHandler";
import { ApiError } from "../helpers/ApiError";
import { ApiResponse } from "../helpers/ApiResponse";
import { publicJobPostingQuerySchema } from "../services/zod/public-jobs/public-jobs-schema";

interface JobPostingCursor {
    created_at: string;
    placement_id: string;
}


const encodeCursor = (
    cursor: JobPostingCursor
): string => {

    return Buffer
        .from(JSON.stringify(cursor))
        .toString("base64url");
};


const decodeCursor = (
    cursor: string
): JobPostingCursor => {

    try {

        const decoded = Buffer
            .from(cursor, "base64url")
            .toString("utf-8");

        const parsed = JSON.parse(decoded);

        if (
            typeof parsed.created_at !== "string" ||
            typeof parsed.placement_id !== "string"
        ) {
            throw new Error();
        }

        return parsed;

    } catch {

        throw new ApiError(
            400,
            "Invalid pagination cursor"
        );
    }
};


export const getPublicJobPostings = asyncHandler(
    async (req: Request, res: Response) => {

        const validation =
            publicJobPostingQuerySchema.safeParse(req.query);

        if (!validation.success) {

            throw new ApiError(
                400,
                validation.error.issues[0]?.message ||
                    "Invalid job posting filters"
            );
        }


        const {
            limit,
            cursor,
            search,
            salary_min,
            salary_max,
            location,
            work_mode,
            sector
        } = validation.data;

        const today = new Date();

        today.setUTCHours(0, 0, 0, 0);

        const conditions: any[] = [

            {
                is_active: true
            },
            {
                last_date_to_apply: {
                    gte: today
                }
            }
        ];

        if (search) {
            conditions.push({
                OR: [
                    {
                        company_name: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        job_role: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        sector: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        location: {
                            contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            });
        }

        if (sector) {

            conditions.push({
                sector: {
                    contains: sector,
                    mode: "insensitive"
                }
            });
        }

        if (location) {

            conditions.push({
                location: {
                    contains: location,
                    mode: "insensitive"
                }
            });
        }

        if (work_mode) {

            conditions.push({
                work_mode
            });
        }

        if (
            salary_min !== undefined &&
            salary_max !== undefined
        ) {
            conditions.push({
                salary_min: {
                    lte: salary_max
                },
                salary_max: {
                    gte: salary_min
                }
            });
        } else if (salary_min !== undefined) {
            conditions.push({
                salary_max: {
                    gte: salary_min
                }
            });
        } else if (salary_max !== undefined) {
            conditions.push({
                salary_min: {
                    lte: salary_max
                }
            });
        }

        if (cursor) {
            const decodedCursor =
                decodeCursor(cursor);

            const cursorDate =
                new Date(decodedCursor.created_at);

            if (isNaN(cursorDate.getTime())) {
                throw new ApiError(
                    400,
                    "Invalid pagination cursor"
                );
            }

            conditions.push({
                OR: [
                    {
                        created_at: {
                            lt: cursorDate
                        }
                    },

                    {
                        created_at: cursorDate,

                        placement_id: {
                            lt: decodedCursor.placement_id
                        }
                    }
                ]
            });
        }

        const jobPostings =
            await prisma.placement.findMany({
                where: {
                    AND: conditions
                },
                take: limit + 1,
                orderBy: [
                    {
                        created_at: "desc"
                    },
                    {
                        placement_id: "desc"
                    }
                ],
                select: {
                    placement_id: true,
                    company_name: true,
                    vacancy: true,
                    location: true,
                    job_role: true,
                    job_description: true,
                    last_date_to_apply: true,
                    work_mode: true,
                    eligible_qualification: true,
                    eligible_percentage_cgpa: true,
                    salary_min: true,
                    salary_max: true,
                    employment_type: true,
                    sector: true,
                    experience: true,
                    created_at: true
                }
            });

        const hasNextPage =
            jobPostings.length > limit;

        if (hasNextPage) {
            jobPostings.pop();
        }

        let nextCursor: string | null = null;

        if (
            hasNextPage &&
            jobPostings.length > 0
        ) {
            const lastJob =
                jobPostings[jobPostings.length - 1];

            if (lastJob.created_at) {
                nextCursor = encodeCursor({
                    created_at:
                        lastJob.created_at.toISOString(),

                    placement_id:
                        lastJob.placement_id
                });
            }
        }
        res.status(200).json(
            new ApiResponse(
                200,
                {
                    jobPostings,
                    pagination: {
                        limit,
                        hasNextPage,
                        nextCursor
                    }
                },
                "Job postings fetched successfully"
            )
        );
    }
);