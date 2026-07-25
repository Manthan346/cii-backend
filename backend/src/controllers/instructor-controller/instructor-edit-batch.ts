import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";


//to edit particular batch details
const editBatchDetails  = asyncHandler(async(req: Request, res: Response) => {
    const {batch_name, batch_code, batch_desc, batch_start_date, batch_end_date, max_candidates, batch_type, batch_status} = req.body
    const batchId = req.params.batchId as string
    if (!batchId) {
        throw new ApiError(404, "batch id not found please provide a batch id")
        
    }
    const batch = await prisma.batch_details.update({
        where: {
            batch_id: batchId

        }, 
        data: {
            batch_name,
            batch_code,
            batch_desc,
            batch_start_date,
            batch_end_date,
            max_candidates,
            batch_type,
            b_status: batch_status




        }
    })
    return res.status(200).json(
        new ApiResponse(200, {
            updatedBatchDetails : batch
        }, "batch updated successfully")

    )
})

export {
    editBatchDetails
}