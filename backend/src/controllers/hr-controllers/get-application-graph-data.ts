import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

export const getApplicationsPerJob = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const recentJobs = await prisma.placement.findMany({
            orderBy: {
                created_at: "desc"
            },
            take: 5,
            select: {
                placement_id: true,
                company_name: true,
                job_role: true,
                _count: {
                    select: {
                        placement_applications: true
                    }
                }
            }
        });

        const data = recentJobs.map((job) => ({
            placement_id: job.placement_id,
            company_name: job.company_name,
            job_role: job.job_role,
            application_count: job._count.placement_applications
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Applications per job fetched successfully."
            )
        );
    }
);

