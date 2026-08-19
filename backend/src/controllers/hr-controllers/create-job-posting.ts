import { Response } from "express";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { createPlacementSchema } from "../../services/zod/hr/placement-validation";

export const createPlacement = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const validation = createPlacementSchema.safeParse(req.body);

        if (!validation.success) {
            throw new ApiError(
                400,
                validation.error.issues[0]?.message ||
                    "Invalid placement information"
            );
        }

        const {
            company_name,
            sector,
            vacancy,
            location,
            job_role,
            job_description,
            salary,
            employment_type,
            work_mode,
            eligible_qualification,
            eligible_percentage_cgpa,
            application_link,
            last_date_to_apply,
            experience
        } = validation.data;

        const hrId = req.hr?.hr_id;
        const companyId = req.hr?.company_id;

        if (!hrId || !companyId) {
            throw new ApiError(
                401,
                "HR information is missing"
            );
        }

        const [year, month, day] =
            last_date_to_apply.split("-").map(Number);

                const applicationDeadline = new Date(
            `${last_date_to_apply}T12:00:00.000Z`
        );

        if (isNaN(applicationDeadline.getTime())) {
            throw new ApiError(
                400,
                "Invalid application deadline"
            );
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const deadlineDate = new Date(applicationDeadline);
        deadlineDate.setUTCHours(0, 0, 0, 0);

        if (deadlineDate < today) {
            throw new ApiError(
                400,
                "Last date to apply cannot be in the past"
            );
        }

        const result = await prisma.$transaction(async (tx) => {

            const placement = await tx.placement.create({
                data: {
                    company_name: company_name.trim(),
                    sector:sector.trim(),

                    vacancy,

                    location: location.trim(),

                    job_role: job_role.trim(),

                    job_description:
                        job_description?.trim() || null,

                    salary:
                        salary?.trim() || null,

                    employment_type:
                        employment_type?.trim() || null,

                    work_mode,

                    eligible_qualification:
                        eligible_qualification?.trim() || null,

                    eligible_percentage_cgpa:
                        eligible_percentage_cgpa?.trim() || null,

                    application_link:
                        application_link?.trim() || null,

                    last_date_to_apply:
                        applicationDeadline,

                    is_active: true,

                    created_by: hrId,
                    experience:experience
                },
            });

            const notification =
                await tx.notifications.create({
                    data: {
                        title: "New Job Opportunity",

                        notification_message:
                            `A new ${placement.job_role} position is available at ${placement.company_name}.`,

                        notification_type:
                            "JOB_OPPORTUNITY",

                        reference_type:
                            "JOB_POSTING",

                        reference_id:
                            placement.placement_id,
                    },
                });

            const users = await tx.user_login.findMany({
                where: {
                    user_role: {
                        in: [
                            "hr",
                            "mobilizer",
                            "admin",
                            "candidate",
                        ],
                    },
                },

                select: {
                    user_id: true,
                },
            });

            if (users.length > 0) {
                await tx.user_notifications.createMany({
                    data: users.map((user) => ({
                        notification_id:
                            notification.notification_id,

                        user_id:
                            user.user_id,
                    })),

                    skipDuplicates: true,
                });
            }

            return {
                placement,

                notification_id:
                    notification.notification_id,

                notified_users:
                    users.length,
            };
        });

        res.status(201).json(
            new ApiResponse(
                201,
                result,
                "Job posting created successfully"
            )
        );
  
    }
);