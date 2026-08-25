import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { HrTokenPayload } from "../../interfaces/jwt-interface";
import { prisma } from "../../lib/prisma";

export const verifyHrUsingAccessToken = asyncHandler(
    async (
        req: HrAuthRequest,
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
        ) as HrTokenPayload;

        if (decoded.role !== "hr") {
            throw new ApiError(401, "You are not an HR");
        }

        const hrUser = await prisma.user_login.findUnique({
            where: {
                user_id: decoded.user_id,
            },
            select: {
                user_id: true,
                is_active: true,
            },
        });

        if (!hrUser) {
            throw new ApiError(401, "User not found");
        }

        if (!hrUser.is_active) {
            throw new ApiError(
                403,
                "Your account has been frozen by the administrator."
            );
        }

        req.hr = {
            hr_id: decoded.hr_id,
            email: decoded.email,
            company_id: decoded.company_id,
        };

        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            is_active: decoded.is_active ?? true,
        };

        next();
    }
);