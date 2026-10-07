import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";
import { SUPER_ADMIN_REDIS_KEY } from "../../constants/superadmin-keys/superadmin-keys";
import { redis } from "../../lib/redis";

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

        const redisKey = SUPER_ADMIN_REDIS_KEY.superadmin_center_key()
                
        await redis.del(redisKey);

        const dashboardKey = SUPER_ADMIN_REDIS_KEY.superadmin_dashboard_key()
        await redis.del(dashboardKey)

        return res.status(200).json(
        new ApiResponse(200, {
            centerName:center.center_name,
            center_id:center.center_id
        }, "Center created successfully.")
    )
       
    }
);