import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../helpers/asyncHandler";
import { ApiResponse } from "../helpers/ApiResponse";
import { job_event_status } from "../generated/prisma/enums";


export const getPublicJobEvents = asyncHandler(
    async (req: Request, res: Response) => {

        const {
            page,
            limit,
            skip
        } = req.pagination!;


        const where = {
            event_status: {
                in: [
                    job_event_status.UPCOMING,
                    job_event_status.COMPLETED
                ]
            }
        };


        const [jobEvents, total] = await Promise.all([
            prisma.job_events.findMany({
                where,
                skip,
                take: limit,

                orderBy: [
                    {
                        event_date: "asc"
                    },
                    {
                        event_start_time: "asc"
                    },
                    {
                        job_event_id: "asc"
                    }
                ],

                select: {
                    job_event_id: true,
                    event_type: true,
                    event_name: true,
                    event_date: true,
                    event_start_time: true,
                    event_end_time: true,
                    address: true,
                    google_map_link: true,
                    description: true,
                    jobevent_photos: true,
                    event_status: true
                }
            }),

            prisma.job_events.count({
                where
            })
        ]);


        const jobFairs = jobEvents.filter(
            (event) => event.event_type === "JOB_FAIR"
        );


        const jobDrives = jobEvents.filter(
            (event) => event.event_type === "JOB_DRIVE"
        );


        const totalPages = Math.ceil(total / limit);


        const hasNextPage = page < totalPages;


        const hasPreviousPage = page > 1;


        res.status(200).json(
            new ApiResponse(
                200,
                {
                    jobFairs,
                    jobDrives,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages,
                        hasNextPage,
                        hasPreviousPage
                    }
                },
                "Job fairs and job drives fetched successfully"
            )
        );
    }
);

