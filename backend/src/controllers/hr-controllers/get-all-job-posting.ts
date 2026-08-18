import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

export const getAllJobPostings = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const { page, limit, skip } = req.pagination!;

        const {
            search,
            sector,
            company_name,
            job_role,
            work_mode,
            location,
        } = req.query;

        if (page < 1) {
            throw new ApiError(
                400,
                "Page must be greater than or equal to 1"
            );
        }

        if (limit < 1 || limit > 50) {
            throw new ApiError(
                400,
                "Limit must be between 1 and 50"
            );
        }

        const where: any = {};

        // Global search
        if (
            typeof search === "string" &&
            search.trim()
        ) {
            const searchValue = search.trim();

            where.OR = [
                {
                    company_name: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
                {
                    job_role: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
                {
                    sector: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
                {
                    location: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                }
            ];
        }

        // Sector
        if (
            typeof sector === "string" &&
            sector.trim()
        ) {
            where.sector = {
                contains: sector.trim(),
                mode: "insensitive",
            };
        }

        // Company
        if (
            typeof company_name === "string" &&
            company_name.trim()
        ) {
            where.company_name = {
                contains: company_name.trim(),
                mode: "insensitive",
            };
        }

        // Job role
        if (
            typeof job_role === "string" &&
            job_role.trim()
        ) {
            where.job_role = {
                contains: job_role.trim(),
                mode: "insensitive",
            };
        }

        // Work mode
        if (
            typeof work_mode === "string" &&
            work_mode.trim()
        ) {
            where.work_mode = work_mode.trim();
        }

        // Location
        if (
            typeof location === "string" &&
            location.trim()
        ) {
            where.location = {
                contains: location.trim(),
                mode: "insensitive",
            };
        }

        const [jobPostings, totalCount] =
            await prisma.$transaction([
                prisma.placement.findMany({
                    where,

                    skip,
                    take: limit,

                    orderBy: {
                        created_at: "desc",
                    },

                    select: {
                        placement_id: true,
                        company_name: true,
                        vacancy: true,
                        location: true,
                        job_role: true,
                        job_description: true,
                        last_date_to_apply: true,
                        is_active: true,
                        created_at: true,
                        updated_at: true,
                        work_mode: true,
                        eligible_qualification: true,
                        eligible_percentage_cgpa: true,
                        salary: true,
                        employment_type: true,
                        sector: true,
                        application_link: true,
                    },
                }),

                prisma.placement.count({
                    where,
                }),
            ]);

        const totalPages = Math.ceil(
            totalCount / limit
        );

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    jobPostings,

                    pagination: {
                        page,
                        limit,
                        totalCount,
                        totalPages,
                        hasNextPage:
                            page < totalPages,
                        hasPreviousPage:
                            page > 1,
                    },
                },
                "Job postings fetched successfully"
            )
        );
    }
);