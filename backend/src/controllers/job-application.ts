import { Request,Response } from "express";

import { prisma } from "../lib/prisma";
import { asyncHandler } from "../helpers/asyncHandler";
import { ApiError } from "../helpers/ApiError";
import { createPlacementApplicationSchema } from "../services/zod/hr/placement-application-validation";

export const createPlacementApplication = asyncHandler(
    async (req: Request, res: Response) => {

        const { placementId } = req.params;
        if (!placementId || Array.isArray(placementId)) {
            throw new ApiError(400, "Invalid placement ID");
        }

        const {
            applicant_name,
            email,
            contact_no,
            resume,
            source,
        } = req.body;

        const placement = await prisma.placement.findUnique({
            where: {
                placement_id: placementId,
            },
        });

        if (!placement) {
            throw new ApiError(404, "Placement not found");
        }

        if (!placement.is_active) {
            throw new ApiError(
                400,
                "This placement is no longer accepting applications"
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastDate = new Date(placement.last_date_to_apply);
        lastDate.setHours(0, 0, 0, 0);

        if (today > lastDate) {
            throw new ApiError(
                400,
                "The application deadline for this placement has passed"
            );
        }

        const existingApplication =
            await prisma.placement_applications.findFirst({
                where: {
                    placement_id: placementId,
                    email: email,
                },
            });

        if (existingApplication) {
            throw new ApiError(
                409,
                "You have already applied for this placement"
            );
        }

        const application =
            await prisma.placement_applications.create({
                data: {
                    placement_id: placementId,
                    applicant_name,
                    email,
                    contact_no,
                    resume,
                    source,
                    application_status: "SCREENING",
                },
            });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: {
                application_id: application.application_id,
            },
        });
    }
);