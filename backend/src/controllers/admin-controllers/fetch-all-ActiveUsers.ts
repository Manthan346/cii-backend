import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { Prisma } from "../../generated/prisma/client";
import { role_types } from "../../generated/prisma/enums";
import { getUsersSchema } from "../../services/zod/admin/get-users-schema";

export const getAllUsers = asyncHandler(
    async (req: Request, res: Response) => {

        const adminReq = req as adminAuthRequest;

        const adminUserId = adminReq.user.user_id;

        // Pagination comes from paginationMiddleware
        const { page, limit, skip } = req.pagination!;

        // Validate query parameters
        const queryResult = getUsersSchema.safeParse(req.query);

        if (!queryResult.success) {
            throw new ApiError(
                400,
                "Invalid query parameters."
            );
        }

        const { role, search } = queryResult.data;

        // Find logged-in admin
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

        if (admin.user_role !== role_types.admin) {
            throw new ApiError(
                403,
                "Unauthorized to fetch users."
            );
        }

        /*
         * Build search conditions.
         */
        const searchConditions: Prisma.user_loginWhereInput[] = [];

        if (search) {

            const searchFilter = {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
            };

            // Search by email
            searchConditions.push({
                user_email: searchFilter,
            });

            // Search by name
            if (role === role_types.admin) {

                searchConditions.push({
                    admin_details: {
                        OR: [
                            {
                                admin_first_name: searchFilter,
                            },
                            {
                                admin_last_name: searchFilter,
                            },
                        ],
                    },
                });

            } else if (role === role_types.candidate) {

                searchConditions.push({
                    candidates_details: {
                        OR: [
                            {
                                candidate_first_name: searchFilter,
                            },
                            {
                                candidate_last_name: searchFilter,
                            },
                        ],
                    },
                });

            } else if (role === role_types.hr) {

                searchConditions.push({
                    hr_details: {
                        OR: [
                            {
                                hr_first_name: searchFilter,
                            },
                            {
                                hr_last_name: searchFilter,
                            },
                        ],
                    },
                });

            } else if (role === role_types.instructor) {

                searchConditions.push({
                    instructor_details: {
                        OR: [
                            {
                                instructor_first_name: searchFilter,
                            },
                            {
                                instructor_last_name: searchFilter,
                            },
                        ],
                    },
                });

            } else if (role === role_types.mobilizer) {

                searchConditions.push({
                    mobilizer_details: {
                        OR: [
                            {
                                mobilizer_first_name: searchFilter,
                            },
                            {
                                mobilizer_last_name: searchFilter,
                            },
                        ],
                    },
                });

            } else {

                // No role filter: search all roles
                searchConditions.push(
                    {
                        admin_details: {
                            OR: [
                                {
                                    admin_first_name: searchFilter,
                                },
                                {
                                    admin_last_name: searchFilter,
                                },
                            ],
                        },
                    },
                    {
                        candidates_details: {
                            OR: [
                                {
                                    candidate_first_name: searchFilter,
                                },
                                {
                                    candidate_last_name: searchFilter,
                                },
                            ],
                        },
                    },
                    {
                        hr_details: {
                            OR: [
                                {
                                    hr_first_name: searchFilter,
                                },
                                {
                                    hr_last_name: searchFilter,
                                },
                            ],
                        },
                    },
                    {
                        instructor_details: {
                            OR: [
                                {
                                    instructor_first_name: searchFilter,
                                },
                                {
                                    instructor_last_name: searchFilter,
                                },
                            ],
                        },
                    },
                    {
                        mobilizer_details: {
                            OR: [
                                {
                                    mobilizer_first_name: searchFilter,
                                },
                                {
                                    mobilizer_last_name: searchFilter,
                                },
                            ],
                        },
                    }
                );
            }
        }

        /*
         * Build ONE where object.
         *
         * We use this same object for:
         * 1. Fetching users
         * 2. Counting total users
         */
        const where: Prisma.user_loginWhereInput = {
            center_id: admin.center_id,
            is_active:true,

            ...(role && {
                user_role: role,
            }),

            ...(search && {
                OR: searchConditions,
            }),
        };

        /*
         * Fetch users + total count together.
         */
        const [users, activeUsers] = await prisma.$transaction([
            prisma.user_login.findMany({
                where,
                skip,
                take: limit,

                select: {
                    user_id: true,
                    user_email: true,
                    user_role: true,
                    center_id: true,
                    is_active: true,

                    admin_details: {
                        select: {
                            admin_first_name: true,
                            admin_last_name: true,
                        },
                    },

                    candidates_details: {
                        select: {
                            candidate_first_name: true,
                            candidate_last_name: true,
                            contact_number: true,
                        },
                    },

                    hr_details: {
                        select: {
                            hr_first_name: true,
                            hr_last_name: true,
                            hr_phone_no: true,
                        },
                    },

                    instructor_details: {
                        select: {
                            instructor_first_name: true,
                            instructor_last_name: true,
                            contact_number: true,
                        },
                    },

                    mobilizer_details: {
                        select: {
                            mobilizer_first_name: true,
                            mobilizer_last_name: true,
                            mobilizer_phone_no: true,
                        },
                    },
                },

                orderBy: {
                    created_at: "desc",
                },
            }),

            prisma.user_login.count({
                where,
            }),
        ]);

        /*
         * Calculate pagination information.
         */
        const totalPages = Math.ceil(
            activeUsers / limit
        );

        /*
         * Format role-specific details into one
         * consistent response structure.
         */
        const formattedUsers = users.map((user) => {

            let firstName: string | null = null;
            let lastName: string | null = null;
            let mobile: string | null = null;

            switch (user.user_role) {

                case role_types.admin:

                    firstName =
                        user.admin_details?.admin_first_name ?? null;

                    lastName =
                        user.admin_details?.admin_last_name ?? null;

                    break;

                case role_types.candidate:

                    firstName =
                        user.candidates_details?.candidate_first_name ?? null;

                    lastName =
                        user.candidates_details?.candidate_last_name ?? null;

                    mobile =
                        user.candidates_details?.contact_number ?? null;

                    break;

                case role_types.hr:

                    firstName =
                        user.hr_details?.hr_first_name ?? null;

                    lastName =
                        user.hr_details?.hr_last_name ?? null;

                    mobile =
                        user.hr_details?.hr_phone_no ?? null;

                    break;

                case role_types.instructor:

                    firstName =
                        user.instructor_details?.instructor_first_name ?? null;

                    lastName =
                        user.instructor_details?.instructor_last_name ?? null;

                    mobile =
                        user.instructor_details?.contact_number ?? null;

                    break;

                case role_types.mobilizer:

                    firstName =
                        user.mobilizer_details?.mobilizer_first_name ?? null;

                    lastName =
                        user.mobilizer_details?.mobilizer_last_name ?? null;

                    mobile =
                        user.mobilizer_details?.mobilizer_phone_no ?? null;

                    break;
            }

            return {
                user_id: user.user_id,

                name: [firstName, lastName]
                    .filter(Boolean)
                    .join(" "),

                email: user.user_email,

                mobile,

                role: user.user_role,

                is_active: user.is_active,
            };
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    users: formattedUsers,

                    pagination: {
                        page,
                        limit,
                        activeUsers,
                        totalPages,
                    },
                },
                "Users fetched successfully."
            )
        );
    }
);