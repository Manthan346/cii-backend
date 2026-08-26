import { Request, Response, NextFunction } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { role_types } from "../../generated/prisma/enums";
import bcrypt from "bcrypt";
import { generateHrUniqueId } from "../../helpers/generate-hr-id";
import { Prisma } from "../../generated/prisma/client";

export const createHrByAdmin = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const adminReq = req as adminAuthRequest;

        const adminUserId = adminReq.user.user_id;

        const {
            first_name,
            last_name,
            email,
            phone_no,
            password,
            designation,
            company_id,
        } = req.body;

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
            throw new ApiError(
                403,
                "Unauthorized to create HR."
            );
        }

        const centerId = admin.center_id;
        const centerCode = admin.center_details?.center_code;

        if (!centerCode) {
            throw new ApiError(
                400,
                "Admin center does not have a center code."
            );
        }

        const company = await prisma.company_details.findUnique({
            where: {
                company_id: company_id,
            },
            select: {
                company_id: true,
                company_name: true,
            },
        });

        if (!company) {
            throw new ApiError(
                404,
                "Company not found."
            );
        }

        const existingUser = await prisma.user_login.findUnique({
            where: {
                user_email: email,
            },
            select: {
                user_id: true,
            },
        });

        if (existingUser) {
            throw new ApiError(
                409,
                "Email is already registered."
            );
        }

        const existingHr = await prisma.hr_details.findUnique({
            where: {
                hr_phone_no: phone_no,
            },
            select: {
                hr_id: true,
            },
        });

        if (existingHr) {
            throw new ApiError(
                409,
                "Phone number is already registered."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const today = new Date();
        const formattedDate = [
            String(today.getDate()).padStart(2, "0"),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getFullYear()).slice(-2),
        ].join("");

        const prefix = `${centerCode}-${formattedDate}-H`;

        let result;

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                result = await prisma.$transaction(async (tx) => {

                    const latestHr = await tx.hr_details.findFirst({
                        where: {
                            hr_unique_id: {
                                startsWith: prefix,
                            },
                            user_login: {
                                center_id: centerId,
                            },
                        },
                        orderBy: {
                            hr_unique_id: "desc",
                        },
                        select: {
                            hr_unique_id: true,
                        },
                    });

                    let serialNumber = 1;

                    if (latestHr?.hr_unique_id) {
                        const lastSerial = latestHr.hr_unique_id
                            .split("-")
                            .pop();

                        if (lastSerial) {
                            serialNumber =
                                parseInt(lastSerial.replace(/^H/, ""), 10) + 1;
                        }
                    }

                    const hrUniqueId = generateHrUniqueId(
                        centerCode,
                        today,
                        serialNumber
                    );

                    const user = await tx.user_login.create({
                        data: {
                            user_email: email,
                            user_password: hashedPassword,
                            user_role: role_types.hr,
                            center_id: centerId,
                        },
                        select: {
                            user_id: true,
                            user_email: true,
                            user_role: true,
                            center_id: true,
                        },
                    });

                    const hr = await tx.hr_details.create({
                        data: {
                            hr_unique_id: hrUniqueId,
                            hr_first_name: first_name,
                            hr_last_name: last_name,
                            hr_designation: designation,
                            hr_phone_no: phone_no,
                            company_id: company_id,
                            user_id: user.user_id,
                        },
                        select: {
                            hr_id: true,
                            hr_unique_id: true,
                            hr_first_name: true,
                            hr_last_name: true,
                            hr_designation: true,
                            hr_phone_no: true,
                            company_id: true,
                            user_id: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });

                    return {
                        user,
                        hr,
                    };
                });

                break;

            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    const target = error.meta?.target;

                    const isHrIdConflict =
                        Array.isArray(target) &&
                        target.includes("hr_unique_id");

                    if (isHrIdConflict && attempt < 2) {
                        continue;
                    }

                    if (Array.isArray(target)) {
                        if (target.includes("user_email")) {
                            throw new ApiError(
                                409,
                                "Email is already registered."
                            );
                        }

                        if (target.includes("hr_phone_no")) {
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

        if (!result) {
            throw new ApiError(
                409,
                "Unable to generate a unique HR ID. Please try again."
            );
        }
        
        return res.status(201).json({
            statusCode: 201,
            message: "HR created successfully.",
            data: result,
        });
    }
);