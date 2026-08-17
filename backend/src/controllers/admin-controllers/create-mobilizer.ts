import { Request,Response, NextFunction } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { role_types } from "../../generated/prisma/enums";
import { generateMobilizerUniqueId } from "../../helpers/generate-mobilizer-id";
import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client";

export const createMobilizerByAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const adminReq = req as adminAuthRequest;
    for(let attempt = 0; attempt<3;attempt++){
    try {
        const adminUserId = adminReq.user.user_id;
        const {
            first_name,
            last_name,
            email,
            phone_no,
            password,
            designation,
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
        const existingMobilizer = await prisma.mobilizer_details.findUnique({
            where: {
                mobilizer_phone_no: phone_no,
            },
            select: {
                mobilizer_id: true,
            },
        });

        if (existingMobilizer) {
            throw new ApiError(409, "Phone number is already registered.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Admin creating mobilizer:", adminUserId);
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
            throw new ApiError(403, "Unauthorized to create mobilizer.");
        }
        if (!admin.center_details?.center_code) {
            throw new ApiError(
                400,
                "Admin center does not have a center code."
            );
        }
        const centerId = admin.center_id;
        const centerCode = admin.center_details.center_code;
        const today = new Date();
        const formattedDate = [
            String(today.getDate()).padStart(2, "0"),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getFullYear()).slice(-2),
        ].join("");

        const prefix = `${centerCode}-${formattedDate}-`;


        const result = await prisma.$transaction(async (tx) => {

            const latestMobilizer = await tx.mobilizer_details.findFirst({
                where: {
                    mobilizer_unique_id: {
                        startsWith: prefix,
                    },
                    user_login: {
                        center_id: centerId,
                    },
                },
                orderBy: {
                    mobilizer_unique_id: "desc",
                },
                select: {
                    mobilizer_unique_id: true,
                },
            });

            let serialNumber = 1;

            if (latestMobilizer?.mobilizer_unique_id) {
                const lastSerial = latestMobilizer.mobilizer_unique_id
                    .split("-")
                    .pop();

                if (lastSerial) {
                    serialNumber = parseInt(lastSerial, 10) + 1;
                }
            }

            const mobilizerUniqueId = generateMobilizerUniqueId(
                centerCode,
                today,
                serialNumber
            );

            const user = await tx.user_login.create({
                data: {
                    user_email: email,
                    user_password: hashedPassword,
                    user_role: role_types.mobilizer,
                    center_id: centerId,
                },
                select: {
                    user_id: true,
                    user_email: true,
                    user_role: true,
                    center_id: true,
                },
            });

            const mobilizer = await tx.mobilizer_details.create({
                data: {
                    user_id: user.user_id,
                    mobilizer_first_name: first_name,
                    mobilizer_last_name: last_name,
                    mobilizer_phone_no: phone_no,
                    mobilizer_designation: designation,
                    mobilizer_unique_id: mobilizerUniqueId,
                },
                select: {
                    mobilizer_id: true,
                    mobilizer_unique_id: true,
                    mobilizer_first_name: true,
                    mobilizer_last_name: true,
                    mobilizer_phone_no: true,
                    mobilizer_designation: true,
                    user_id: true,
                },
            });

            return {
                user,
                mobilizer,
            };
        });

        return res.status(201).json({
            statusCode: 201,
            message: "Mobilizer created successfully.",
            data: result,
        });

    } catch (error) {
         if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    ) {
        const target = error.meta?.target;

        const isMobilizerIdConflict =
            Array.isArray(target) &&
            target.includes("mobilizer_unique_id");

        if (isMobilizerIdConflict && attempt < 3) {
            continue;
        }

        if (Array.isArray(target)) {
            if (target.includes("user_email")) {
                throw new ApiError(
                    409,
                    "Email is already registered."
                );
            }

            if (target.includes("mobilizer_phone_no")) {
                throw new ApiError(
                    409,
                    "Phone number is already registered."
                );
            }
        }
    }

    throw error;    
    }
    }
};