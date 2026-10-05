import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { HR_REDIS_CACHE } from "../../lib/redis";
import { HR_REDIS_KEYS } from "../../constants/hr-keys/hr-keys";
import { redis } from "../../lib/redis";

export const getApplicationsPerJob = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {
        const redisKey = HR_REDIS_KEYS.hr_application_graph_data();
        
            const cachedApplicationsPerJob = await redis.get(redisKey);
        
            if (cachedApplicationsPerJob) {
            return res.status(200).json({
                statusCode: 200,
                message: "HR application graph data fetched successfully.",
                data: JSON.parse(cachedApplicationsPerJob),
            });
        }

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
        console.log("query hit.")

        const data = recentJobs.map((job) => ({
            placement_id: job.placement_id,
            company_name: job.company_name,
            job_role: job.job_role,
            application_count: job._count.placement_applications
        }));

        await redis.set(
          redisKey,
          JSON.stringify(data),
          "EX",
          HR_REDIS_CACHE
      );

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Applications per job fetched successfully."
            )
        );
    }
);

