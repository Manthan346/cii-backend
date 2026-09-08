
// controllers/instructor/assessment.controller.ts

import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";

import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";

import { ApiError } from "../../helpers/ApiError";

import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import {
    batch_status,
    notification_type,
    notification_reference_type
} from "../../generated/prisma/enums";

export const createAssessment = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {

        const {
            batch_id,
            title,
            assessment_desc,
            assessment_type,
            assessment_date,
            questions,
            assessment_duration,
            assessment_link
        } = req.body;

        if (!title?.trim()) {
            throw new ApiError(
                400,
                "Assessment title is required."
            );
        }

        if (!assessment_date) {
            throw new ApiError(
                400,
                "Assessment date is required."
            );
        }

        const trimmedTitle = title.trim();

        const trimmedDescription =
            assessment_desc?.trim() ?? null;

        const trimmedAssessmentLink =
            assessment_link?.trim() ?? null;

        const company_id = req.instructor?.company_id;

        if (!company_id) {
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        const user_id = req.user?.user_id;

        if (!user_id) {
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        const user = await prisma.user_login.findUnique({
            where: {
                user_id
            },
            select: {
                user_role: true,
                center_id: true
            }
        });

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        const batch = await prisma.batch_details.findUnique({
            where: {
                batch_id
            },
            include: {
                course_details: {
                    include: {
                        company_details: true
                    }
                }
            }
        });

        if (!batch) {
            throw new ApiError(
                404,
                "Batch not found."
            );
        }

        if (batch.b_status !== batch_status.ACTIVE) {
            throw new ApiError(
                400,
                "Assessment can only be created for active batches."
            );
        }

        /*
         * Fetch enrolled students before beginning the transaction.
         *
         * Only active enrolled students will receive
         * the assessment notification.
         */
        const enrolledStudents =
            await prisma.batch_enrollment.findMany({
                where: {
                    batch_id,
                    enrollment_status: "ACTIVE"
                },
                select: {
                    candidates_details: {
                        
                        select: {
                            user_id: true,
                            candidate_id: true
                        }
                    }
                }
            });

        /*
         * Authorization
         */
        switch (user.user_role) {

            case "instructor":

                if (
                    batch.course_details.company_id !==
                    req.instructor?.company_id
                ) {
                    throw new ApiError(
                        403,
                        "You are not authorized to create assessment for this batch."
                    );
                }

                break;

            case "admin":

                if (
                    batch.center_id !==
                    user.center_id
                ) {
                    throw new ApiError(
                        403,
                        "You are not authorized to create assessment for this batch."
                    );
                }

                break;

            case "super_admin":

                // Super admin validations can be added here.

                break;

            default:

                throw new ApiError(
                    403,
                    "You are not authorized to create assessment."
                );
        }

        /*
         * Assessment Date Handling
         *
         * assessment_date comes from the frontend as:
         *
         * YYYY-MM-DD
         *
         * Example:
         *
         * Instructor selects:
         * 2026-09-08
         *
         * Database stores:
         * 2026-09-09
         *
         * The stored date is treated as the exclusive
         * expiry date.
         *
         * Therefore:
         *
         * 2026-09-08 -> assessment is available
         * 2026-09-09 -> assessment has expired
         *
         * This works with the existing Prisma field:
         *
         * assessment_date DateTime @db.Date
         */

        const dateParts = assessment_date
            .split("-")
            .map(Number);

        if (
            dateParts.length !== 3 ||
            dateParts.some(Number.isNaN)
        ) {
            throw new ApiError(
                400,
                "Invalid assessment date. Expected format YYYY-MM-DD."
            );
        }

        const [year, month, day] = dateParts;

        /*
         * Store the next calendar date.
         *
         * Example:
         *
         * 2026-09-08
         *       +
         *      1 day
         *       =
         * 2026-09-09
         *
         * Date.UTC is used so that the stored calendar date
         * is not affected by the server timezone.
         */
        const assessmentDate = new Date(
            Date.UTC(
                year,
                month - 1,
                day + 1
            )
        );

        /*
         * Create assessment and notifications
         * inside a single transaction.
         */
        const result = await prisma.$transaction(
            async (tx) => {
                const assessment = await tx.assessments.create({
                    data: {
                        batch_id,
                        title: trimmedTitle,
                        assessment_desc: trimmedDescription,
                        assessment_link: trimmedAssessmentLink,
                        is_show: true,
                        assessment_date: assessmentDate,
                        assessment_type,
                        assessment_duration,
                        questions
                    }
                });

                // Invalidate candidate available assessments cache for all enrolled candidates in this batch
                const pipeline = [];
                for (const enrollment of enrolledStudents) {
                    pipeline.push(
                        redis.del(CANDIDATE_REDIS_KEYS.candidate_available_assessments_key(
                            enrollment.candidates_details.candidate_id,
                            1, // default page
                            10 // default limit
                        ))
                    );
                }
                await Promise.all(pipeline);

                // Notifications are sent only to active enrolled students.
                const notification = await tx.notifications.create({
                    data: {
                        title: "New Assessment Created",
                        notification_message: `New Assessment "${trimmedTitle}" has been created for batch "${batch.batch_name}".`,
                        notification_type: notification_type.ASSESSMENT_CREATED,
                        reference_type: notification_reference_type.ASSESSMENT,
                        reference_id: assessment.assessment_id
                    }
                });

                const userNotifications = enrolledStudents.map((student) => ({
                    notification_id: notification.notification_id,
                    user_id: student.candidates_details.user_id,
                }));

                // Skip user notification creation if no students are enrolled.
                if (userNotifications.length > 0) {
                    await tx.user_notifications.createMany({
                        data: userNotifications
                    });
                }

                return { assessment, notification };
            }
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    assessment_id: result.assessment.assessment_id,
                    title: result.assessment.title,
                    created_by: user_id
                },
                "Assessment created successfully."
            )
        );
    }
);
