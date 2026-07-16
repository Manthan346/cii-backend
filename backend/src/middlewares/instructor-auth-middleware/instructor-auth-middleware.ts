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

        req.instructor = {
            instructor_id: decoded.instructor_id,
            role:"instructor"
        };

        next();

    }
);