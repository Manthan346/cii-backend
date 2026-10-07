import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { SUPER_ADMIN_REDIS_CACHE } from "../../lib/redis";
import { SUPER_ADMIN_REDIS_KEY } from "../../constants/superadmin-keys/superadmin-keys";

export const fetchCentersforDropdown = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const redisKey = SUPER_ADMIN_REDIS_KEY.superadmin_center_key()
        const cachedCenter = await redis.get(redisKey)

        if(cachedCenter){
            return res.status(200).json({
                statusCode: 200,
                message: "center found successfully successfully.",
                data: JSON.parse(cachedCenter),
            });
        }

        const getCenters = await prisma.center_details.findMany({
            select:{
                center_name:true,
            }
        })

        if (!getCenters) {
            throw new ApiError(404, "Cannot load centers.");
        }

        await redis.set(
            redisKey,
            JSON.stringify(getCenters),
            "EX",
            SUPER_ADMIN_REDIS_CACHE
        );

        return res.status(200).json(
        new ApiResponse(200, {
            getCenters
        }, "center found successfully")
    )
       
    }
);