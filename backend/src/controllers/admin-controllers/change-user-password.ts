import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import * as bcrypt from "bcrypt";
import { changePasswordSchema } from "../../services/zod/admin/change-password-schema";
import { validateBody } from "../../middlewares/zod-middleware/zod-body-validator";

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const adminReq = req as adminAuthRequest;
    const adminUserId = adminReq.user.user_id;
    const targetUserId = req.params.userId as string;

    // Validate admin is authenticated
    if (!adminUserId) {
      throw new ApiError(401, "Admin not authenticated");
    }

    // Validate target user ID format
    const parsedUserId = targetUserId;
    if (!parsedUserId || typeof parsedUserId !== 'string' || parsedUserId.trim() === '') {
      throw new ApiError(400, "Valid user ID is required");
    }

    // Validate new password using schema
    const { password } = req.body;
    const validationResult = changePasswordSchema.safeParse({ password });
    if (!validationResult.success) {
      throw new ApiError(400, validationResult.error.issues[0].message);
    }

    // Prevent admin from changing their own password through this endpoint
    if (adminUserId === targetUserId) {
      throw new ApiError(
        400,
        "Admins cannot change their own password through this endpoint. Use the profile edit endpoint instead."
      );
    }

    // Find admin to verify permissions and get center_id
    const admin = await prisma.user_login.findUnique({
      where: { user_id: adminUserId },
      select: {
        user_id: true,
        user_role: true,
        center_id: true,
      },
    });

    if (!admin) {
      throw new ApiError(404, "Admin user not found");
    }

    if (admin.user_role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    // Check if target user exists and belongs to admin's center
    const targetUser = await prisma.user_login.findUnique({
      where: { user_id: targetUserId },
      select: {
        user_id: true,
        user_email: true,
        user_role: true,
        center_id: true,
        is_active: true,
      },
    });

    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Verify center isolation - admin can only change passwords for users in their center
    if (targetUser.center_id !== admin.center_id) {
      throw new ApiError(
        403,
        "You are not authorized to change password for this user"
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    const updatedUser = await prisma.user_login.update({
      where: { user_id: targetUserId },
      data: { user_password: hashedPassword },
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
        {
          user_id: updatedUser.user_id,
          email: updatedUser.user_email,
          role: updatedUser.user_role,
          updated_at: updatedUser.updated_at,
        },
        "User password changed successfully"
      )
    );
  }
);