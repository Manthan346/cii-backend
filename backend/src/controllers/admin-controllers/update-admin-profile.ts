import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";

import { ApiError } from "../../helpers/ApiError";

import { adminAuthRequest } from "../../interfaces/admin-auth-interface";

import { prisma } from "../../lib/prisma";

import { updateAdminProfileSchema } from "../../services/zod/admin/admin-profile-validation";

export const updateAdminProfile = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const validationResult = updateAdminProfileSchema.safeParse(
            req.body
        );

        if (!validationResult.success) {
            throw new ApiError(
                400,
                validationResult.error.issues[0].message
            );
        }

        const {
            admin_first_name,
            admin_last_name,
            blood_group,
            admin_phone_no,
            date_of_birth
        } = validationResult.data;

        const userId = req.user.user_id;

        const adminProfile = await prisma.admin_details.findUnique({
            where: {
                user_id: userId
            }
        });

        if (!adminProfile) {
            throw new ApiError(404, "Admin profile not found.");
        }

        const updateData: {
            admin_first_name?: string;
            admin_last_name?: string;
            blood_group?: string;
            admin_phone_no?: string;
            date_of_birth?: Date;
        } = {};

        if (admin_first_name !== undefined) {
            updateData.admin_first_name = admin_first_name;
        }

        if (admin_last_name !== undefined) {
            updateData.admin_last_name = admin_last_name;
        }

        if (blood_group !== undefined) {
            updateData.blood_group = blood_group;
        }

        if (admin_phone_no !== undefined) {
            updateData.admin_phone_no = admin_phone_no;
        }

        if (date_of_birth !== undefined) {
            updateData.date_of_birth = new Date(
                `${date_of_birth}T00:00:00.000Z`
            );
        }

        const updatedProfile = await prisma.admin_details.update({
            where: {
                user_id: userId
            },

            data: updateData,

            select: {
                admin_first_name: true,
                admin_last_name: true,
                date_of_birth: true,
                blood_group: true,
                admin_phone_no: true,

                user_login: {
                    select: {
                        user_email: true
                    }
                }
            }
        });

        const profileData = {
            admin_first_name: updatedProfile.admin_first_name,

            admin_last_name: updatedProfile.admin_last_name,

            date_of_birth: updatedProfile.date_of_birth
                ? updatedProfile.date_of_birth
                    .toISOString()
                    .split("T")[0]
                : null,

            blood_group: updatedProfile.blood_group,

            email: updatedProfile.user_login.user_email,

            phone_no: updatedProfile.admin_phone_no
        };

        res.status(200).json({
            statusCode: 200,
            message: "Admin profile updated successfully.",
            data: profileData
        });
    }
);