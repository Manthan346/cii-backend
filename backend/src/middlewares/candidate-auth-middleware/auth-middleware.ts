import { TokenPayload } from "../../interfaces/jwt-interface"
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"


export const verifyCandidateUsingAccessToken = asyncHandler(async(req: CandidateAuthRequest, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        throw new ApiError(401, "unauthorized")

    }
    //verify user
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as TokenPayload


    if (decoded.role !== "candidate") {
      throw new ApiError(401, "you are not an candidate")

    }
     req.candidate = {
        candidate_id: decoded.candidate_id,




     }
     req.user = {
        user_id: decoded.user_id,
        role: decoded.role,
        is_active: decoded.is_active ?? true
     }

     console.log("=== GUARDIAN DEBUG ===", decoded)


     next()

})