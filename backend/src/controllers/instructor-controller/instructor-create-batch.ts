import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";



const createBatch = asyncHandler(async(req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id
    const centerId = req.user.center_id
    if (!instructorId) {
        throw new ApiError(404, "instructor id not found")
        
    }
    const {batch_name, batch_code, batch_desc, course_id, batch_start_date, batch_end_date, max_candidates, batch_type, b_status, center_id} = req.body
    const batch = await prisma.batch_details.create({
        data: {
            batch_name,
            batch_code,
            batch_desc,
            course_id,
            batch_start_date,
            batch_end_date,
            max_candidates,
            batch_type,
            b_status,
            instructor_id: instructorId,
            center_id: centerId
            
            



        }
    })
    return res.status(200).json(
        new ApiResponse(200, {
            batchDetails: batch
        }, "batch created successfully")
    )

})

export {
    createBatch
}