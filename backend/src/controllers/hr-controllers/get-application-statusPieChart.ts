// src/controllers/placement-controller/get-application-status.ts

import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { application_status_type } from "../../generated/prisma/enums";
import { HR_REDIS_CACHE } from "../../lib/redis";
import { HR_REDIS_KEYS } from "../../constants/hr-keys/hr-keys";
import { redis } from "../../lib/redis";

export const getApplicationPieChartStatus = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const redisKey = HR_REDIS_KEYS.hr_pie_chart();

        const cachedChartData = await redis.get(redisKey);

        if (cachedChartData) {
        return res.status(200).json({
            statusCode: 200,
            message: "HR profile fetched successfully.",
            data: JSON.parse(cachedChartData),
        });
    }

        // Total applications across all jobs
        const applied =
            await prisma.placement_applications.count();

        // Applications currently in screening
        const screening =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.SCREENING
                }
            });

        // Shortlisted applications
        const shortlisted =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.SHORTLISTED
                }
            });

        // Applications in interview stage
        const interview =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.INTERVIEW
                }
            });

        // Selected applications
        const selected =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.SELECTED
                }
            });

        // Rejected applications
        const rejected =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.REJECTED
                }
            });

        // Withdrawn applications
        const withdrawn =
            await prisma.placement_applications.count({
                where: {
                    application_status: application_status_type.WITHDRAWN
                }
            });

        const data = {
            applied,
            screening,
            shortlisted,
            interview,
            selected,
            rejected,
            withdrawn
        };

        console.log("Query hit")

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
                "Application status details fetched successfully."
            )
        );
    }
);
