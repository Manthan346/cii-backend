import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { z } from "zod";

export const updateUserApproval = asyncHandler(
    async (req: Request, res: Response) => {

        const adminReq = req as adminAuthRequest;

        const adminUserId = adminReq.user.user_id;
        const userIdSchema = z.string().uuid("Invalid user ID");
        const result = userIdSchema.safeParse(req.params.userId);
        if (!result.success) {
            throw new ApiError(400, "Invalid user ID");
        }
        const targetUserId = result.data;
        const { is_active } = req.body;

        // Prevent admin from freezing their own account
        if (adminUserId === targetUserId) {
            throw new ApiError(
                400,
                "You cannot change your own account status."
            );
        }

        const admin = await prisma.user_login.findUnique({
            where: {
                user_id: adminUserId,
            },
            select: {
                user_id: true,
                user_role: true,
                center_id: true,
            },
        });

        if (!admin) {
            throw new ApiError(
                404,
                "Admin user not found."
            );
        }

        const targetUser = await prisma.user_login.findUnique({
            where: {
                user_id: targetUserId,
            },
            select: {
                user_id: true,
                user_email: true,
                user_role: true,
                center_id: true,
                is_active: true,
            },
        });

        if (!targetUser) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        if (targetUser.center_id !== admin.center_id) {
            throw new ApiError(
                403,
                "You are not authorized to manage this user."
            );
        }

        const updatedUser = await prisma.user_login.update({
            where: {
                user_id: targetUserId,
            },
            data: {
                is_active: is_active,
            },
            select: {
                user_id: true,
                user_email: true,
                user_role: true,
                center_id: true,
                is_active: true,
                updated_at: true,
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedUser,
                is_active
                    ? "User account activated successfully."
                    : "User account frozen successfully."
            )
        );
    }
);