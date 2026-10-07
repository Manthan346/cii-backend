import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { SuperAdminAuthRequest } from "../../interfaces/superadmin-auth-interface";
import { prisma } from "../../lib/prisma";
import { role_types } from "../../generated/prisma/enums";
import bcrypt from "bcrypt";
import { redis } from "../../lib/redis";
import { SUPER_ADMIN_REDIS_KEY } from "../../constants/superadmin-keys/superadmin-keys";

export const createAdminBySuperAdmin = asyncHandler(
    async (req: SuperAdminAuthRequest, res: Response) => {
        const { first_name, last_name, email, password, center_id } = req.body;

        // Check if email already exists
        const existingUser = await prisma.user_login.findUnique({
            where: {
                user_email: email,
            },
            select: {
                user_id: true,
            },
        });

        if (existingUser) {
            throw new ApiError(409, "Email is already registered.");
        }

        // Verify center exists
        const center = await prisma.center_details.findUnique({
            where: {
                center_id: center_id,
            },
            select: {
                center_id: true,
                center_name: true,
                center_code: true,
            },
        });

        if (!center) {
            throw new ApiError(404, "Center not found.");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user and admin details in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user_login entry
            const user = await tx.user_login.create({
                data: {
                    user_email: email,
                    user_password: hashedPassword,
                    user_role: role_types.admin,
                    center_id: center_id,
                    is_active: true,
                },
                select: {
                    user_id: true,
                    user_email: true,
                    user_role: true,
                    center_id: true,
                    is_active: true,
                    created_at: true,
                },
            });

            // Create admin_details entry
            const adminDetail = await tx.admin_details.create({
                data: {
                    admin_first_name: first_name,
                    admin_last_name: last_name ?? null,
                    user_id: user.user_id,
                },
                select: {
                    admin_id: true,
                    admin_first_name: true,
                    admin_last_name: true,
                    user_id: true,
                },
            });

            return {
                user,
                adminDetail,
                center: {
                    center_id: center.center_id,
                    center_name: center.center_name,
                    center_code: center.center_code,
                },
            };
        });

        await redis.del(
            SUPER_ADMIN_REDIS_KEY.superadmin_dashboard_key()
        );

        return res.status(201).json(
            new ApiResponse(201, {
                admin: {
                    admin_id: result.adminDetail.admin_id,
                    first_name: result.adminDetail.admin_first_name,
                    last_name: result.adminDetail.admin_last_name,
                    email: result.user.user_email,
                    role: result.user.user_role,
                    is_active: result.user.is_active,
                    created_at: result.user.created_at,
                },
                center: result.center,
            }, "Admin created successfully.")
        );
    }
);