import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { batch_status,event_target_type,batch_enrollment_status_type,notification_reference_type,notification_type } from "../../generated/prisma/enums";
import { ApiError } from "../../helpers/ApiError";
import { updateEventSchema } from "../../services/zod/event-schema/eventValidation";

export const updateInstructorEvent = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{   
        const event_id = req.params.event_id as string;
        const user_id = req.user.user_id;
        const { company_id } = req.instructor!;
        const event = await prisma.event_details.findUnique({
            where: {
                event_id,
            },
            select: {
                created_by: true,
                target_type: true,
            },
        });

        if(!event){
            throw new ApiError(
                404,
                "Event not found."
            )
        }

        const instructor= await prisma.instructor_details.findUnique({
            where:{
                user_id:event.created_by
            }
        })

        if (!instructor) {
            throw new ApiError(
                404,
                "Event creator not found."
            );
        }

        if (
            instructor.company_id !== company_id
        ) {
            throw new ApiError(
                403,
                "You are not authorized to update this event."
            );
        }

        const data = updateEventSchema.parse(req.body);
        let targetBatchIds: string[] = [];
        let instructorUserIds: string[] = [];

        const instructors = await prisma.instructor_details.findMany({
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
                    "No active batches found."
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
                    "No completed batches found."
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
                    "No active or completed batches found."
                );
            }

            targetBatchIds = batches.map(
                batch => batch.batch_id
            );

            break;
        }

        default:
            throw new ApiError(
                400,
                "Invalid target type."
            );
    }

        const updatedEvent = await prisma.$transaction(async (tx) => {
            const updatedEvent = await tx.event_details.update({
            where: {
                event_id,
            },
            data: {
                event_title: data.event_title,
                event_description: data.event_description,
                event_date: new Date(data.event_date),
                event_time: new Date(`1970-01-01T${data.event_time}:00`),
                venue: data.venue,
                event_link: data.event_link,
                event_mode: data.event_mode,
                event_type: data.event_type,
                target_type: data.target_type,
                updated_by: user_id,
            },
        });

        await tx.event_batches.deleteMany({
            where: {
                event_id,
            },
        });

        await tx.event_batches.createMany({
            data: targetBatchIds.map(batchId => ({
                event_id,
                batch_id: batchId,
            })),
        });

        const enrollments = await tx.batch_enrollment.findMany({
            where: {
                batch_id: {
                    in: targetBatchIds,
                },
                enrollment_status: batch_enrollment_status_type.ACTIVE,
            },
            select: {
                candidates_details: {
                    select: {
                        user_id: true,
                    },
                },
            },
        });

        const studentUserIds = enrollments.map(
            enrollment => enrollment.candidates_details.user_id
        );

        const recipientUserIds = [
            ...new Set([
                   user_id,
                ...studentUserIds,
                ...instructorUserIds,
            ]),
        ];

        const notification = await tx.notifications.findFirst({
            where: {
                reference_type: notification_reference_type.EVENT,
                reference_id: event_id,
            },
            select: {
                notification_id: true,
            },
        });

        if (!notification) {
            throw new ApiError(
                404,
                "Notification not found for this event."
            );
        }

        await tx.notifications.update({
            where: {
                notification_id: notification.notification_id,
            },
            data: {
                title: data.event_title,
                notification_message: `The event "${data.event_title}" has been updated.`,
                notification_type: notification_type.EVENT_UPDATED
            },
        });

        await tx.user_notifications.deleteMany({
            where: {
                notification_id: notification.notification_id,
            },
        });

        if (recipientUserIds.length > 0) {
                        await tx.user_notifications.createMany({
                data: recipientUserIds.map(userId => ({
                    user_id: userId,
                    notification_id: notification.notification_id,
                    is_read: false,
                    read_at: null,
                })),
            });
        }
        
        return updatedEvent
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedEvent,
                "Event updated successfully."
            )
        );

    }
)