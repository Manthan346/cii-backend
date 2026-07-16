import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiError } from "../../helpers/ApiError";





export const candidateRoleMiddleware = asyncHandler(async(req: CandidateAuthRequest, res: Response, next: NextFunction) => {

        const candidateRole =  req.candidate?.role
        if (candidateRole !== "candidate") {
            throw new ApiError(403, "you are not a candidate")
            
        }

        next()
})

