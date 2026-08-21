import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";
import { Response} from "express";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";

export const updatePlacementApplicationStatus = asyncHandler(
    async (req: HrAuthRequest, res: Response) => {
        const { applicationId } = req.params;

        if (!applicationId || Array.isArray(applicationId)) {
            throw new ApiError(400, "Invalid application ID");
        }

        const { application_status } = req.body;

        const application =
            await prisma.placement_applications.findUnique({
                where: {
                    application_id: applicationId,
                },
            });

        if (!application) {
            throw new ApiError(404, "Placement application not found");
        }

        const updatedApplication =
            await prisma.placement_applications.update({
                where: {
                    application_id: applicationId,
                },
                data: {
                    application_status,
                },
            });

        return res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            data: {
                application_id: updatedApplication.application_id,
                application_status:
                    updatedApplication.application_status,
            },
        });
    }
);