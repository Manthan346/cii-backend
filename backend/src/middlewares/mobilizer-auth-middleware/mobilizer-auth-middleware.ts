import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { MobilizerTokenPayload } from "../../interfaces/jwt-interface";

export const verifyMobilizerUsingAccessToken = asyncHandler(
    async (
        req: MobilizerAuthRequest,
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
        ) as MobilizerTokenPayload;

        if (decoded.role !== "mobilizer") {
            throw new ApiError(401, "You are not a mobilizer");
        }

        req.mobilizer = {
            mobilizer_id: decoded.mobilizer_id,
            email: decoded.email,
            center_id: decoded.center_id
        };

        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            is_active: decoded.is_active ?? true,
        };

        next();
    }
);