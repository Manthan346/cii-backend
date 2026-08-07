import { InstructorTokenPayload } from "../../interfaces/jwt-interface";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyInstructorUsingAccessToken = asyncHandler(
    async (
        req: InstructorAuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized");
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        ) as InstructorTokenPayload;
        // console.log("instructor",decoded)

        if (decoded.role !== "instructor") {
            throw new ApiError(401, "you are not an instructor")
            
        }

        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            center_id: decoded.center_id!
        }
        req.instructor = {
            instructor_id: decoded.instructor_id,
            email: decoded.email,
            company_id:decoded.company_id
        };

     

        next();

    }
);