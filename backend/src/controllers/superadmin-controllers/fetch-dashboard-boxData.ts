import { Response } from "express";
import { role_types } from "../../generated/prisma/enums";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";
import { SUPER_ADMIN_REDIS_CACHE } from "../../lib/redis";
import { SUPER_ADMIN_REDIS_KEY } from "../../constants/superadmin-keys/superadmin-keys";
import { redis } from "../../lib/redis";

export const fetchDashboardData = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

        const redisKey = SUPER_ADMIN_REDIS_KEY.superadmin_dashboard_key()

        const cachedSuperAdminDashboardData = await redis.get(redisKey)

        if(cachedSuperAdminDashboardData){
            return res.status(200).json({
                statusCode: 200,
                message: "Super Admin dashboard data fetched successfully.",
                data: JSON.parse(cachedSuperAdminDashboardData),
            });
        }

        const [centerCount,totalCandidates,totalStaff,certificatesIssued] = await Promise.all([
            prisma.center_details.count(),
            prisma.user_login.count({where:{
                user_role: role_types.candidate
            }}),
            prisma.user_login.count({where:{
                user_role:{
                    in:[role_types.admin,role_types.hr,role_types.instructor,role_types.mobilizer]
                }
            }}),
            prisma.batch_enrollment.count({
                where:{
                    certificate_url:{
                        not : null
                    }
                }
            })
        ])

        
        const data = {
            centerCount,
            totalCandidates,
            totalStaff,
            certificatesIssued
        }

        await redis.set(
            redisKey,
            JSON.stringify(data),
            "EX",
            SUPER_ADMIN_REDIS_CACHE
        );

        return res.status(200).json(
        new ApiResponse(200, {
            center_count:data.centerCount,
            total_candidates:data.totalCandidates,
            total_staff: data.totalStaff,
            certificate_issued : data.certificatesIssued
        }, "Dashboard data fetched successfully")
    )
       
    }
);