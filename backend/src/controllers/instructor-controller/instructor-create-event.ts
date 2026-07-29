import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { batch_status,event_target_type } from "../../generated/prisma/enums";
import { ApiError } from "../../helpers/ApiError";
import { createEventSchema } from "../../services/zod/event-schema/eventValidation";

export const createInstructorEvent = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{
        const {company_id,instructor_id} = req.instructor!;
        let targetBatchIds: string [] = [];
        const data = createEventSchema.parse(req.body);

        switch (data.target_type) {
            case event_target_type.BATCH:
                if (!data.batch_ids) {
                    throw new ApiError(400, "Please select at least one batch.");
                }

                const batches = await prisma.batch_details.findMany({
                    where: {
                        batch_id: {
                            in: data.batch_ids,
                        },
                        course_details:{
                            company_id
                        },
                        b_status: batch_status.ACTIVE,
                    },
                    select: {
                        batch_id: true,
                    },
                });

                if (batches.length !== data.batch_ids.length) {
                    throw new ApiError(
                        400,
                        "One or more selected batches are invalid, inactive, or do not belong to your company."
                    );
                }

                targetBatchIds = batches.map(batch => batch.batch_id);
            break;
            case event_target_type.ALL_BATCHES:{
               const batches = await prisma.batch_details.findMany({
                    where:{
                        course_details:{
                            company_id
                        },
                        instructor_id
                    },
                    select:{
                        batch_id:true
                    }
                }) 
            }
            break;

            case event_target_type.DEPARTMENT:{
                const batches = await prisma.batch_details.findMany({
                    where: {
                        course_details: {
                            company_id,
                        },
                    },
                    select: {
                        batch_id: true,
                    },
                });

                if (batches.length === 0) {
                    throw new ApiError(404, "No batches found for your company.");
                }

                targetBatchIds = batches.map(batch => batch.batch_id);
            }
                break;
        }

        await prisma.$transaction(async (tx) => {
            const event = await tx.event_details.create({
                data: {
                    center_id: req.user.center_id,
                    event_title: data.event_title,
                    event_description: data.event_description,
                    event_date: new Date(data.event_date),
                    event_time: new Date(`1970-01-01T${data.event_time}:00`),
                    venue: data.venue,
                    event_link: data.event_link,
                    event_mode: data.event_mode,
                    event_type: data.event_type,
                    target_type: data.target_type,
                    created_by: req.user.user_id,
                    updated_by: req.user.user_id,
                },
            });
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                event,
                "Event created successfully."
            )
        );


    }
)