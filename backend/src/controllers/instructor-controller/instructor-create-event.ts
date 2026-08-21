import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import {
    batch_status,
    event_target_type,
    batch_enrollment_status_type,
    notification_reference_type,
    notification_type
} from "../../generated/prisma/enums";
import { ApiError } from "../../helpers/ApiError";
import { createEventSchema } from "../../services/zod/event-schema/eventValidation";

export const createInstructorEvent = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {

        const { company_id } = req.instructor!;

        if (!company_id) {
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        let targetBatchIds: string[] = [];
        let instructorUserIds: string[] = [];

        const data = createEventSchema.parse(req.body);

        const instructors =
                    await prisma.instructor_details.findMany({
                        where: {
                            company_id
                        },
                        select: {
                            user_id: true
                        }
                    });

                instructorUserIds = instructors.map(
                    instructor => instructor.user_id
                );

        switch (data.target_type) {

            case event_target_type.PUBLIC: {
                throw new ApiError(
                    403,
                    "Instructors cannot create PUBLIC events. contact mobilizer instead."
                );
            }

            case event_target_type.BATCH: {

                if (!data.batch_ids) {
                    throw new ApiError(
                        400,
                        "Please select at least one batch."
                    );
                }

                const batches = await prisma.batch_details.findMany({
                    where: {
                        batch_id: {
                            in: data.batch_ids
                        },
                        course_details: {
                            company_id
                        },
                        b_status: {
                            in: [
                                batch_status.ACTIVE,
                                batch_status.COMPLETED
                            ]
                        }
                    },
                    select: {
                        batch_id: true
                    }
                });

                if (batches.length !== data.batch_ids.length) {
                    throw new ApiError(
                        400,
                        "One or more selected batches are invalid, inactive, or do not belong to your company."
                    );
                }

                targetBatchIds = batches.map(
                    batch => batch.batch_id
                );

                break;
            }

            case event_target_type.ALL_BATCHES: {

                const batches = await prisma.batch_details.findMany({
                    where: {
                        course_details: {
                            company_id
                        },
                        b_status: batch_status.ACTIVE
                    },
                    select: {
                        batch_id: true
                    }
                });

                if (batches.length === 0) {
                    throw new ApiError(
                        404,
                        "No batches found for your company."
                    );
                }

                targetBatchIds = batches.map(
                    batch => batch.batch_id
                );

                break;
            }

            case event_target_type.COMPLETED: {

                const batches = await prisma.batch_details.findMany({
                    where: {
                        course_details: {
                            company_id
                        },
                        b_status: batch_status.COMPLETED
                    },
                    select: {
                        batch_id: true
                    }
                });

                if (batches.length === 0) {
                    throw new ApiError(
                        404,
                        "No batches found for your company."
                    );
                }

                targetBatchIds = batches.map(
                    batch => batch.batch_id
                );

                break;
                
            }

            

            case event_target_type.A_C_BATCHES: {

                const batches = await prisma.batch_details.findMany({
                    where: {
                        course_details: {
                            company_id
                        },
                        b_status: {
                            in: [
                                batch_status.ACTIVE,
                                batch_status.COMPLETED
                            ]
                        }
                    },
                    select: {
                        batch_id: true
                    }
                });

                if (batches.length === 0) {
                    throw new ApiError(
                        404,
                        "No batches found for your company."
                    );
                }

                targetBatchIds = batches.map(
                    batch => batch.batch_id
                );

                

                break;
            }
        }

        const createdEvent = await prisma.$transaction(
            async (tx) => {

                const event = await tx.event_details.create({
                    data: {
                        center_id: req.user.center_id,
                        event_title: data.event_title,
                        event_description: data.event_description,
                        event_date: new Date(data.event_date),
                        event_time: new Date(
                            `1970-01-01T${data.event_time}:00`
                        ),
                        
                        venue: data.venue,
                        event_link: data.event_link,
                        event_mode: data.event_mode,
                        event_type: data.event_type,
                        target_type: data.target_type,
                        created_by: req.user.user_id,
                        updated_by: req.user.user_id
                    }
                });

                await tx.event_batches.createMany({
                    data: targetBatchIds.map(batchId => ({
                        event_id: event.event_id,
                        batch_id: batchId
                    }))
                });

                const enrollments =
                    await tx.batch_enrollment.findMany({
                        where: {
                            batch_id: {
                                in: targetBatchIds
                            },
                            enrollment_status:
                                batch_enrollment_status_type.ACTIVE
                        },
                        select: {
                            candidates_details: {
                                select: {
                                    user_id: true
                                }
                            }
                        }
                    });

                const studentUserIds = enrollments.map(
                    enrollment =>
                        enrollment.candidates_details.user_id
                );

                const recipientUserIds = [
                    ...new Set([
                        req.user.user_id,
                        ...studentUserIds,
                        ...instructorUserIds
                    ])
                ];

                const notification =
                    await tx.notifications.create({
                        data: {
                            title: data.event_title,
                            notification_message:
                                `${data.event_title} has been scheduled on ${data.event_date}.`,
                            notification_type:
                                notification_type.EVENT_CREATED,
                            reference_type:
                                notification_reference_type.EVENT,
                            reference_id:
                                event.event_id
                        }
                    });

                if (recipientUserIds.length > 0) {
                    await tx.user_notifications.createMany({
                        data: recipientUserIds.map(userId => ({
                            user_id: userId,
                            notification_id:
                                notification.notification_id
                        }))
                    });
                }

                return event;
            }
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                createdEvent,
                "Event created successfully."
            )
        );
    }
);