import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { role_types } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const fetchAllCenterDetails = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const getCenters = await prisma.center_details.findMany({
            select:{
                center_name:true,
                center_id:true,
                city_name:true,
                center_address:true,
                center_code:true,
                center_contact:true,
                center_email:true,
                user_login: {
                    where: {
                        user_role: role_types.candidate
                    },
                    select: {
                        user_id: true
                    }
                }
            },
        })

        if (!getCenters) {
            throw new ApiError(404, "Cannot load centers.");
        }

        const centers = getCenters.map((center) => ({
            center_name: center.center_name,
            center_id: center.center_id,
            city_name: center.city_name,
            center_address: center.center_address,
            center_code: center.center_code,
            center_contact: center.center_contact,
            center_email: center.center_email,
            candidate_count: center.user_login.length
        }));

        return res.status(200).json(
        new ApiResponse(200, {
            centers
        }, "Center details fetched successfully")
    )
       
    }
);