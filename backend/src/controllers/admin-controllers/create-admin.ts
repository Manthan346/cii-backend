import { Request, Response, NextFunction } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";

import { ApiError } from "../../helpers/ApiError";
import { role_types } from "../../generated/prisma/enums";
import bcrypt from "bcrypt";
import { generateAdminUniqueId } from "../../helpers/generate-admin-id";
import { Prisma } from "../../generated/prisma/client";

export const createAdminByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const adminReq = req as adminAuthRequest;
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const adminUserId = adminReq.user.user_id;
            const {  first_name,
            last_name,
            email,
            phone_no,
            password,
             } = req.body;
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

            const admin = await prisma.user_login.findUnique({
                where: {
                    user_id: adminUserId,
                },
                select: {
                    user_id: true,
                    user_role: true,
                    center_id: true,
                    center_details: {
                        select: {
                            center_code: true,
                        },
                    },
                },
            });

            if (!admin) {
                throw new ApiError(404, "Admin user not found.");
            }

            if (admin.user_role !== role_types.admin) {
                throw new ApiError(403, "Unauthorized to create admin.");
            }

            if (!admin.center_details?.center_code) {
                throw new ApiError(
                    400,
                    "Admin center does not have a center code."
                );
            }

            const centerId = admin.center_id;
            const centerCode = admin.center_details.center_code;
            const hashedPassword = await bcrypt.hash(password, 10);
            const today = new Date();
            const formattedDate = [
                String(today.getDate()).padStart(2, "0"),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getFullYear()).slice(-2),
            ].join("");

            const prefix = `${centerCode}-${formattedDate}-A`;

            const result = await prisma.$transaction(async (tx) => {
                const admins = await tx.admin_details.findMany({
                    orderBy: {
                        admin_id: "desc",
                    },
                    select: {
                        admin_id: true,
                    },
                });

                const latestAdmin = admins.find((admin) =>
                    admin.admin_id.startsWith(prefix)
                );

                let serialNumber = 1;

                if (latestAdmin?.admin_id) {
                    const lastSerial = latestAdmin.admin_id.split("-").pop();

                    if (lastSerial) {
                        serialNumber = parseInt(
                            lastSerial.replace(/^A/, ""),
                            10
                        ) + 1;
                    }
                }

                const adminUniqueId = generateAdminUniqueId(
                    centerCode,
                    today,
                    serialNumber
                );

                const user = await tx.user_login.create({
                    data: {
                        user_email: email,
                        user_password: hashedPassword,
                        user_role: role_types.admin,
                        center_id: centerId,
                    },
                    select: {
                        user_id: true,
                        user_email: true,
                        user_role: true,
                        center_id: true,
                    },
                });

                const adminDetail = await tx.admin_details.create({
                    data: {
                        admin_id: adminUniqueId,
                        admin_first_name: first_name,
                        admin_last_name: last_name,
                        user_id: user.user_id,
                        admin_phone_no: phone_no
                        
                    },
                    select: {
                        admin_id: true,
                        admin_first_name: true,
                        admin_last_name: true,
                    },
                });

                return {
                    user,
                    adminDetail,
                };
            });

            return res.status(201).json({
                statusCode: 201,
                message: "Admin created successfully.",
                data: result,
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                const target = error.meta?.target;

                const isAdminIdConflict =
                    Array.isArray(target) &&
                    target.includes("admin_id");

                if (isAdminIdConflict && attempt < 2) {
                    continue;
                }

                if (Array.isArray(target)) {
                    if (target.includes("user_email")) {
                        throw new ApiError(
                            409,
                            "Email is already registered."
                        );
                    }
                }
            }

            throw error;
        }
    }

    throw new ApiError(
        409,
        "Unable to generate a unique admin ID. Please try again."
    );
};