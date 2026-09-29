import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";

export const fetchCentersforDropdown = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const getCenters = await prisma.center_details.findMany({
            select:{
                center_name:true,
            }
        })

        if (!getCenters) {
            throw new ApiError(404, "Cannot load centers.");
        }

        return res.status(200).json(
        new ApiResponse(200, {
            getCenters
        }, "center found successfully")
    )
       
    }
);