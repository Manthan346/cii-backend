import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { role_types } from "../../generated/prisma/enums";
import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client";
import { generateInstructorUniqueId } from "../../helpers/generate-instructor-id";
import { ApiResponse } from "../../helpers/ApiResponse";

export const createInstructorByAdmin = asyncHandler(
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
            gender,
            date_of_birth,
            specialization,
            experience_years,
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
                center_details:{
                    select:{
                        center_code:true
                    }
                }
            },
        });

        if (!admin) {
            throw new ApiError(
                404,
                "Admin user not found."
            );
        }

        if (admin.user_role !== role_types.admin) {
            throw new ApiError(
                403,
                "Unauthorized to create instructor."
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

        // Company-center validation will go here

        const company = await prisma.center_company.findUnique({
            where: {
                center_id_company_id: {
                    center_id: centerId,
                    company_id: company_id,
                },
            },
            select: {
                company_id: true,
                company_details: {
                    select: {
                        company_name: true,
                    },
                },
            },
        });

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

        const existingInstructor = await prisma.instructor_details.findUnique({
            where: {
                contact_number: phone_no,
            },
            select: {
                instructor_id: true,
            },
        });

        if (existingInstructor) {
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

        const prefix = `${centerCode}-${formattedDate}-I`;

        let result;

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                result = await prisma.$transaction(async (tx) => {

                    const latestInstructor =
                        await tx.instructor_details.findFirst({
                            where: {
                                instructor_unique_id: {
                                    startsWith: prefix,
                                },
                                user_login: {
                                    center_id: centerId,
                                },
                            },
                            orderBy: {
                                instructor_unique_id: "desc",
                            },
                            select: {
                                instructor_unique_id: true,
                            },
                        });

                    let serialNumber = 1;

                    if (latestInstructor?.instructor_unique_id) {
                        const lastSerial =
                            latestInstructor.instructor_unique_id
                                .split("-")
                                .pop();

                        if (lastSerial) {
                            serialNumber =
                                parseInt(
                                    lastSerial.replace("I", ""),
                                    10
                                ) + 1;
                        }
                    }

                    const instructorUniqueId =
                        generateInstructorUniqueId(
                            centerCode,
                            today,
                            serialNumber
                        );

                    const user = await tx.user_login.create({
                        data: {
                            user_email: email,
                            user_password: hashedPassword,
                            user_role: role_types.instructor,
                            center_id: centerId,
                        },
                        select: {
                            user_id: true,
                            user_email: true,
                            user_role: true,
                            center_id: true,
                        },
                    });

                    const instructor = await tx.instructor_details.create({
                        data: {
                            instructor_unique_id: instructorUniqueId,
                            instructor_first_name: first_name,
                            instructor_last_name: last_name,
                            contact_number: phone_no,
                            gender: gender,
                            date_of_birth: date_of_birth
                                ? new Date(date_of_birth)
                                : undefined,
                            specialization: specialization,
                            experience_years: experience_years,
                            company_id: company_id,
                            user_id: user.user_id,
                        },
                        select: {
                            instructor_id: true,
                            instructor_unique_id: true,
                            instructor_first_name: true,
                            instructor_last_name: true,
                            contact_number: true,
                            gender: true,
                            date_of_birth: true,
                            specialization: true,
                            experience_years: true,
                            company_id: true,
                            user_id: true,
                            created_at: true,
                            updated_at: true,
                        },
                    });
                    return {
                        user,
                        instructor,
                    };
                });
                break;

            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    const target = error.meta?.target;

                    const isInstructorIdConflict =
                        Array.isArray(target) &&
                        target.includes("instructor_unique_id");

                    if (isInstructorIdConflict && attempt < 2) {
                        continue;
                    }

                    if (Array.isArray(target)) {
                        if (target.includes("user_email")) {
                            throw new ApiError(
                                409,
                                "Email is already registered."
                            );
                        }

                        if (target.includes("contact_number")) {
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
                "Unable to generate a unique instructor ID. Please try again."
            );
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                result,
                "Instructor created successfully."
            )
        );
    }
);