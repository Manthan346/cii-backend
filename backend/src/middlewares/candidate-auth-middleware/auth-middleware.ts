import { TokenPayload } from "../../interfaces/jwt-interface";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

export const verifyCandidateUsingAccessToken = asyncHandler(
    async (
        req: CandidateAuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(401, "unauthorized");
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        if (decoded.role !== "candidate") {
            throw new ApiError(
                401,
                "you are not a candidate"
            );
        }

        const candidateUser = await prisma.user_login.findUnique({
            where: {
                user_id: decoded.user_id,
            },
            select: {
                user_id: true,
                admin_approval: true,
            },
        });

        if (!candidateUser) {
            throw new ApiError(
                401,
                "user not found"
            );
        }

        if (!candidateUser.admin_approval) {
            throw new ApiError(
                403,
                "Your account has been frozen by the administrator."
            );
        }

        req.candidate = {
            candidate_id: decoded.candidate_id,
        };

        req.user = {
            user_id: decoded.user_id,
            role: decoded.role,
        };

        console.log("=== GUARDIAN DEBUG ===", decoded)

        next();
    }
);