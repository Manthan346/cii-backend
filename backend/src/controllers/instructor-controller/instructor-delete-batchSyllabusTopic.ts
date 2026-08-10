import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export const deleteBatchSyllabusTopic = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const batch_syllabus_id = req.params.batch_syllabus_id;
        const company_id = req.instructor?.company_id;

        if (!company_id) {
            throw new ApiError(
                403,
                "You don't belong to a valid company."
            );
        }

        if (!batch_syllabus_id) {
            throw new ApiError(
                400,
                "Batch syllabus id is required."
            );
        }

        const parsedBatchSyllabusId =
            z.string().uuid().safeParse(batch_syllabus_id);

        if (!parsedBatchSyllabusId.success) {
            throw new ApiError(
                400,
                "Invalid batch syllabus id."
            );
        }

        const topic = await prisma.batch_syllabus.findUnique({
            where: {
                batch_syllabus_id: parsedBatchSyllabusId.data,
            },
            select: {
                batch_syllabus_id: true,
                batch_details: {
                    select: {
                        course_details: {
                            select: {
                                company_id: true,
                            },
                        },
                    },
                },
            },
        });

        if (!topic) {
            throw new ApiError(
                404,
                "Syllabus topic not found."
            );
        }

        if (
            topic.batch_details.course_details.company_id !==
            company_id
        ) {
            throw new ApiError(
                403,
                "You don't have access to this syllabus topic."
            );
        }

        const deletedTopic = await prisma.batch_syllabus.delete({
            where: {
                batch_syllabus_id: parsedBatchSyllabusId.data,
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    syllabus: deletedTopic,
                },
                "Syllabus topic deleted successfully."
            )
        );
    }
);