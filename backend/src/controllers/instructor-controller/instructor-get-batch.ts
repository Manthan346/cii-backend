import { Response } from "express";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";



//to get particular get details

const getBatchDetails = asyncHandler(async(req: InstructorAuthRequest, res: Response) => {
    const instructorId =  req.instructor?.instructor_id
    

    const batchId = req.params.batchId as string
    const batch = await prisma.batch_details.findUnique({
        where: {
            batch_id: batchId,
            

        }, 
        select: {
             batch_name: true,
             batch_code: true,
             batch_desc: true,
             batch_start_date: true,
             batch_end_date: true,
             max_candidates: true,
             batch_type: true,
             b_status: true
        }
    })

    return res.json(
        new ApiResponse(200, {
            batchDetails: batch
        }, "batch updated successfully")
    )


    

})

export {
    getBatchDetails
}