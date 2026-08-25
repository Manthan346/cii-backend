import { InstructorTokenPayload } from "../../interfaces/jwt-interface";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

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

        if (decoded.role !== "instructor") {
            throw new ApiError(
                401,
                "You are not an instructor"
            );
        }

        const instructorUser = await prisma.user_login.findUnique({
            where: {
                user_id: decoded.user_id,
            },
            select: {
                user_id: true,
                is_active: true,
            },
        });

        if (!instructorUser) {
            throw new ApiError(
                401,
                "User not found"
            );
        }

        if (!instructorUser.is_active) {
            throw new ApiError(
                403,
                "Your account has been frozen by the administrator."
            );
        }

        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            center_id: decoded.center_id!
        };

        req.instructor = {
            instructor_id: decoded.instructor_id,
            email: decoded.email,
            company_id: decoded.company_id
        };

        next();
    }
);