import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";

export const createCenter = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const {center_name,center_address,center_email,center_contact,center_code,city_name} = req.body

        const center = await prisma.center_details.create({
            data:{
                center_name,
                center_address,
                center_email,
                center_contact,
                center_code,
                city_name
            }
        })

        return res.status(200).json(
        new ApiResponse(200, {
            centerName:center.center_name,
            center_id:center.center_id
        }, "Center created successfully.")
    )
       
    }
);