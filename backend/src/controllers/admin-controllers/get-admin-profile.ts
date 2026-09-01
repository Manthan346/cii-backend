import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";

export const getAdminProfile = asyncHandler(
    async (req: adminAuthRequest, res: Response) => {

        const adminProfile = await prisma.admin_details.findUnique({
            where: {
                user_id: req.user.user_id
            },
            select: {
                admin_first_name: true,
                admin_last_name: true,
                date_of_birth: true,
                blood_group: true,
                admin_phone_no:true,
                user_login: {
                    select: {
                        user_email: true,
                    
                    }
                }
            }
        });

        if (!adminProfile) {
            throw new ApiError(404, "Admin profile not found.");
        }

        const profileData = {
            admin_first_name: adminProfile.admin_first_name,
            admin_last_name: adminProfile.admin_last_name,

            date_of_birth: adminProfile.date_of_birth
                ? adminProfile.date_of_birth.toISOString().split("T")[0]
                : null,

            blood_group: adminProfile.blood_group,

            email: adminProfile.user_login.user_email,

            phone_no: adminProfile.admin_phone_no
        };

        res.status(200).json({
            statusCode: 200,
            message: "Admin profile fetched successfully.",
            data: profileData
        });
    }
);