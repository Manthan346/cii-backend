import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { batch_status } from "../../generated/prisma/enums";


export const getInstructorDashboard = asyncHandler(

    async (req: InstructorAuthRequest, res: Response) => {

        const instructorId = req.instructor?.instructor_id;
        console.log(instructorId);

        if (!instructorId) {

            throw new ApiError(
                401,
                "Unauthorized access."
            );

        }


        // Find instructor id using user id

        


        // Fetch all batches assigned to the instructor
        console.log("Before query");
        const batches = await prisma.batch_details.findMany({

            where: {
                instructor_id: instructorId
            },

            select: {

                batch_id: true,

                batch_name: true,

                b_status: true,

                course_details: {
                    select: {
                        course_name: true
                    }
                },

                _count: {
                    select: {
                        batch_enrollment: true
                    }
                }

            }

        });
        console.log("After query");

        // Dashboard calculations

        let totalCandidates = 0;

        let activeBatches = 0;


        const batchOverview = batches.map((batch: any) => {

            const candidateCount =
                batch._count.batch_enrollment;


            totalCandidates += candidateCount;


            if (batch.b_status === batch_status.ACTIVE) {

                activeBatches++;

            }


            return {

                batchId: batch.batch_id,

                batchName: batch.batch_name,

                courseName:
                    batch.course_details?.course_name,

                candidateCount,

                batchStatus:
                    batch.b_status

            };

        });


        const dashboard = {

            summary: {

                totalCandidates,

                activeBatches

            },

            batchOverview

        };


        return res.status(200).json(

            new ApiResponse(

                200,

                dashboard,

                "Instructor dashboard fetched successfully."

            )

        );

    }

);