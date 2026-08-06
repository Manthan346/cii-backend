import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { role_types } from "../../generated/prisma/enums";




const adminDashboardData = asyncHandler(async(req: adminAuthRequest, res: Response) => {
    const centerId = req.user.center_id
    const date = new Date()
    const month = date.getUTCMonth()
    const [totalUser, totalCandidates, totalStaff, monthlyEnrollment] = await Promise.allSettled([
        prisma.user_login.count({
             where:{
                center_id: centerId
             }

        }),

        prisma.user_login.count({
            where: {
                center_id: centerId,
                user_role: "candidate"

            }
        }),

        prisma.user_login.count({
             where:{
                center_id: centerId,
                user_role: {
                    in: ["admin", "instructor",  ]
                }
             }

        }), 

        prisma.batch_enrollment.count({
            where: {
                enrollment_date: month
            }
        })


       

        

    ])

    

    

})