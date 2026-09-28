import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    // If a refresh token exists, invalidate it in the database
    if (refreshToken) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_SECRET!
            ) as {
                user_id: string;
                role: string;
            };

            await prisma.user_login.update({
                where: {
                    user_id: decoded.user_id,
                },
                data: {
                    refresh_token_hash: null,
                },
            });
        } catch {
            // Even if the refresh token is already invalid/expired,
            // we still want to clear the browser cookies.
        }
    }

    // Remove authentication cookies from the browser
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "logged out successfully"
        )
    );
});