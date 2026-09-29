import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { role_types } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type SuperAdminAccessTokenPayload = {
    super_admin_id: string;
    first_name: string;
    last_name: string;
    user_id: string;
    role: string;
    email: string;
};

export const verifySuperAdminUsingAccessToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(401, "unauthorized");
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        ) as SuperAdminAccessTokenPayload;

        if (decoded.role !== role_types.super_admin) {
            throw new ApiError(401, "you are not a Super Admin");
        }


        const superAdminReq = req as SuperAdminAuthRequest;

        superAdminReq.user = {
            user_id: decoded.user_id,
            role: decoded.role,
            email: decoded.email,
        };

        superAdminReq.superadmin = {
            super_admin_id: decoded.super_admin_id,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
        };

        next();
    }
);