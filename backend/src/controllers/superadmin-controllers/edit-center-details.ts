import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";

import { prisma } from "../../lib/prisma";

export const updateCenter = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const center_id  = req.params.center_id as string;

        const {
            center_name,
            center_address,
            center_contact,
            center_email,
            city_name,
        } = req.body;

        // Check if center exists
        const existingCenter = await prisma.center_details.findUnique({
            where: {
                center_id,
            },
        });

        if (!existingCenter) {
            throw new ApiError(404, "Center not found");
        }

        // Update center
        const updatedCenter = await prisma.center_details.update({
            where: {
                center_id,
            },
            data: {
                ...(center_name !== undefined && {
                    center_name,
                }),

                ...(center_address !== undefined && {
                    center_address,
                }),

                ...(center_contact !== undefined && {
                    center_contact,
                }),

                ...(center_email !== undefined && {
                    center_email,
                }),

                ...(city_name !== undefined && {
                    city_name,
                }),
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedCenter,
                "Center details updated successfully"
            )
        );
    }
);