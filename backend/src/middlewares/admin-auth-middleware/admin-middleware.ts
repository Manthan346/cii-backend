import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { role_types } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type AdminAccessTokenPayload = {
    user_id: string;
    center_id: string;
    role: string;
    centre_name?: string;
    email: string;
    is_active?: boolean;
};

export const verifyAdminUsingAccessToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(401, "unauthorized");
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        ) as AdminAccessTokenPayload;

        if (decoded.role !== role_types.admin) {
            throw new ApiError(401, "you are not an admin");
        }


        const adminReq = req as adminAuthRequest;

        adminReq.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            email: decoded.email,
            center_id: decoded.center_id,
            is_active: decoded.is_active ?? true,
        };

        next();
    }
);