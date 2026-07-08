import { Express, Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { success } from "zod";


const getAllCandidate = asyncHandler(async(req: Request, res:Response ) => {
    const allCandidates = await prisma.candidates_details.findMany()
    return res.status(200).json(
        new ApiResponse(200, {
            
            candidates: allCandidates
        }, "all candidates found successfully")

    )



})

export {
    getAllCandidate
}