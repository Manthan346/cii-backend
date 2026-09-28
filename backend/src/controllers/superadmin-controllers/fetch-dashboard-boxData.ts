import { Response } from "express";
import { role_types } from "../../generated/prisma/enums";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";

export const fetchDashboardData = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {

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

        return res.status(200).json(
        new ApiResponse(200, {
            center_count:centerCount,
            total_candidates:totalCandidates,
            total_staff: totalStaff,
            certificate_issued : certificatesIssued
        }, "Dashboard data fetched successfully")
    )
       
    }
);