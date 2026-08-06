import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { role_types } from "../../generated/prisma/enums";




const adminDashboardData = asyncHandler(async(req: adminAuthRequest, res: Response) => {
    const centerId = req.user.center_id
    const [totalUser, totalCandidates, totalStaff, monthlyEnrollment] = await Promise.allSettled([
        prisma.user_login.count({
             where:{
                center_id: centerId
             }

        }),
        prisma.user_login.count({
             where:{
                center_id: centerId,
                user_role: {
                    in: ["admin", "instructor", "super_admin" ]
                }
             }

        }), 

        

    ])

    

    

})