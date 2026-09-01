import { Response } from "express";

import { prisma } from "../../lib/prisma";

import { asyncHandler } from "../../helpers/asyncHandler";

import { ApiError } from "../../helpers/ApiError";

import { ApiResponse } from "../../helpers/ApiResponse";

import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

import { updatePlacementSchema } from "../../services/zod/hr/placement-validation";

export const updateJobPosting = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {

        const placementId = req.params.placement_id;

        if (!placementId || Array.isArray(placementId)) {
            throw new ApiError(
                400,
                "Invalid placement ID"
            );
        }

        const validation =
            updatePlacementSchema.safeParse(req.body);

        if (!validation.success) {
            throw new ApiError(
                400,
                validation.error.issues[0]?.message ||
                    "Invalid placement information"
            );
        }

        const data = validation.data;

        const hrId = req.hr?.hr_id;

        if (!hrId) {
            throw new ApiError(
                401,
                "HR information is missing"
            );
        }

        const existingPlacement =
            await prisma.placement.findUnique({
                where: {
                    placement_id: placementId,
                },
            });

        if (!existingPlacement) {
            throw new ApiError(
                404,
                "Job posting not found"
            );
        }

        const updateData: any = {};

        if (data.company_name !== undefined) {
            updateData.company_name =
                data.company_name.trim();
        }

        if (data.sector !== undefined) {
            updateData.sector =
                data.sector.trim();
        }

        if (data.vacancy !== undefined) {
            updateData.vacancy =
                data.vacancy;
        }

        if (data.location !== undefined) {
            updateData.location =
                data.location.trim();
        }

        if (data.job_role !== undefined) {
            updateData.job_role =
                data.job_role.trim();
        }

        if (data.job_description !== undefined) {
            updateData.job_description =
                data.job_description.trim();
        }

        // Salary
        if (data.salary_min !== undefined) {
            updateData.salary_min =
                data.salary_min;
        }

        if (data.salary_max !== undefined) {
            updateData.salary_max =
                data.salary_max;
        }

        /*
         * Validate the final salary range.
         *
         * If only one salary value is being updated,
         * use the existing value for the other side.
         */
        const finalSalaryMin =
            data.salary_min !== undefined
                ? data.salary_min
                : existingPlacement.salary_min;

        const finalSalaryMax =
            data.salary_max !== undefined
                ? data.salary_max
                : existingPlacement.salary_max;

        if (
            finalSalaryMin !== null &&
            finalSalaryMax !== null &&
            finalSalaryMax < finalSalaryMin
        ) {
            throw new ApiError(
                400,
                "Maximum salary must be greater than or equal to minimum salary"
            );
        }

        if (data.employment_type !== undefined) {
            updateData.employment_type =
                data.employment_type.trim();
        }

        if (data.work_mode !== undefined) {
            updateData.work_mode =
                data.work_mode;
        }

        if (data.eligible_qualification !== undefined) {
            updateData.eligible_qualification =
                data.eligible_qualification.trim();
        }

        if (data.eligible_percentage_cgpa !== undefined) {
            updateData.eligible_percentage_cgpa =
                data.eligible_percentage_cgpa.trim();
        }

        if (data.experience !== undefined) {
            updateData.experience =
                data.experience.trim();
        }

        if (data.last_date_to_apply !== undefined) {

            const applicationDeadline = new Date(
                `${data.last_date_to_apply}T12:00:00.000Z`
            );

            if (isNaN(applicationDeadline.getTime())) {
                throw new ApiError(
                    400,
                    "Invalid application deadline"
                );
            }

            const today = new Date();

            today.setUTCHours(0, 0, 0, 0);

            const deadlineDate =
                new Date(applicationDeadline);

            deadlineDate.setUTCHours(0, 0, 0, 0);

            if (deadlineDate < today) {
                throw new ApiError(
                    400,
                    "Last date to apply cannot be in the past"
                );
            }

            updateData.last_date_to_apply =
                applicationDeadline;
        }

        const updatedPlacement =
            await prisma.placement.update({
                where: {
                    placement_id: placementId,
                },
                data: updateData,
            });

        res.status(200).json(
            new ApiResponse(
                200,
                updatedPlacement,
                "Job posting updated successfully"
            )
        );
    }
);