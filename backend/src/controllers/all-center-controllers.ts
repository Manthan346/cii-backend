import { Request, Response } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../helpers/ApiResponse";
import { ApiError } from "../helpers/ApiError";




const allCenters = asyncHandler( async(req: Request, res: Response) => {


    const centers = await prisma.center_details.findMany({
        select: {
            center_id: true,
            center_name: true,
            
        }
    })

    if (!centers) {
        throw new ApiError(404, "no centers found")
        
    }

    return res.status(200).json(
        new ApiResponse(200, {
            centers
        }, "center found successfully")
    )
})

export {
    allCenters
}