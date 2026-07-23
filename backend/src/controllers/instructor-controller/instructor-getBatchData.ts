import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";






const instructorBatchCardData  = asyncHandler(async(req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id
    if (!instructorId) {
        throw new ApiError(404, "instructor id not found")
        
    }

    const [totalBatch, ActiveBatches, upcomingBatches] = await Promise.all([
        prisma.batch_details.count({
            where: {
                instructor_id: instructorId
            }
        }),
        prisma.batch_details.count({
            where: {
                instructor_id: instructorId,
                b_status: "ACTIVE"
            }
        }),
        prisma.batch_details.count({
            where: {
                instructor_id: instructorId,
                batch_start_date: {
                    gt: new Date()
                }
        }
})
    ]) 

   


    return res.status(200).json(
        new ApiResponse(200, {
            totalBatch,
            ActiveBatches,
            upcomingBatches

        }, "batch card data found successfully")
    )

})

export {
    instructorBatchCardData
}