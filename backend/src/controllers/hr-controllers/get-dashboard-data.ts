import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { HR_REDIS_KEYS } from "../../constants/hr-keys/hr-keys";
import { HR_REDIS_CACHE } from "../../lib/redis";
import { redis } from "../../lib/redis";

export const getHrDashboard = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const redisKey = HR_REDIS_KEYS.hr_dashboard_key();

        const cachedDashboard = await redis.get(redisKey);

        if (cachedDashboard) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    JSON.parse(cachedDashboard),
                    "Placement dashboard details fetched successfully."
                )
            );
        }

        const totalJobApplications =
            await prisma.placement_applications.count();

        const totalJobEvents =
            await prisma.job_events.count();

        const upcomingJobEvents =
            await prisma.job_events.count({
                where: {
                    event_status: "UPCOMING"
                }
            });

        const completedJobEvents =
            await prisma.job_events.count({
                where: {
                    event_status: "COMPLETED"
                }
            });

        const shortlistedStudents =
            await prisma.placement_applications.count({
                where: {
                    application_status: "SHORTLISTED"
                }
            });

        const selectedStudents =
            await prisma.placement_applications.count({
                where: {
                    application_status: "SELECTED"
                }
            });

        const currentJobsPosted =
            await prisma.placement.count({
                where: {
                    last_date_to_apply: {
                        gte: new Date()
                    }
                }
            });

        const interviewedCandidates =
            await prisma.placement_applications.count({
                where: {
                    application_status: "INTERVIEW"
                }
            });

        console.log("HR DASHBOARD FETCHED FROM DATABASE");

        const data = {
            totalJobApplications,
            totalJobEvents,
            upcomingJobEvents,
            completedJobEvents,
            shortlistedStudents,
            selectedStudents,
            currentJobsPosted,
            interviewedCandidates
        };

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
                "Placement dashboard details fetched successfully."
            )
        );
    }
);

