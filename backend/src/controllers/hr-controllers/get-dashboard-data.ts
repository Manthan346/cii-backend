

import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";

export const getHrDashboard = asyncHandler(
    async (req: Request, res: Response) => {

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

        return res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Placement dashboard details fetched successfully."
            )
        );
    }
);

