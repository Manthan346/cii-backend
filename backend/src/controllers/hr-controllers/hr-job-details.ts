import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

export const getPlacementJobDetails = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {
        const { placement_id } = req.params;

        if (!placement_id || Array.isArray(placement_id)) {
            throw new ApiError(400, "Invalid placement ID");
        }

        const placement = await prisma.placement.findUnique({
            where: {
                placement_id,
            },
            select: {
                placement_id: true,
                company_name: true,
                vacancy: true,
                location: true,
                job_role: true,
                job_description: true,
                last_date_to_apply: true,
                is_active: true,
                work_mode: true,
                eligible_qualification: true,
                eligible_percentage_cgpa: true,
                salary_min:true,
                salary_max:true,
                employment_type: true,
                sector: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!placement) {
            throw new ApiError(404, "Placement not found");
        }

        const [
            totalApplications,
            shortlisted,
            interview,
            selected,
        ] = await Promise.all([
            prisma.placement_applications.count({
                where: {
                    placement_id,
                },
            }),

            prisma.placement_applications.count({
                where: {
                    placement_id,
                    application_status: "SHORTLISTED",
                },
            }),

            prisma.placement_applications.count({
                where: {
                    placement_id,
                    application_status: "INTERVIEW",
                },
            }),

            prisma.placement_applications.count({
                where: {
                    placement_id,
                    application_status: "SELECTED",
                },
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Placement details fetched successfully.",
            data: {
                jobDetails: placement,

                applicationSummary: {
                    totalApplications,
                    shortlisted,
                    interview,
                    selected,
                },
            },
        });
    }
);