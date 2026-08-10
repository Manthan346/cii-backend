import { Response} from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/client";

export const getAllEnquiry = asyncHandler(
    async(req:MobilizerAuthRequest,res:Response) =>{
        const centerId = req.mobilizer?.center_id;
        const { search, status, source, date } = req.query;
        const { page, limit, skip } = req.pagination!;
        if (!centerId) {
            throw new ApiError(401, "mobilizer center not found");
        }

        if (
            status &&
            !Object.values(enquiry_status).includes(status as enquiry_status)
        ) {
            throw new ApiError(400, "invalid enquiry status");
        }

        if (date) {
            const dateString = String(date);

            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                throw new ApiError(400, "invalid date format, use YYYY-MM-DD");
            }

            const [year, month, day] = dateString.split("-").map(Number);

            const parsedDate = new Date(Date.UTC(year, month - 1, day));

            if (
                parsedDate.getUTCFullYear() !== year ||
                parsedDate.getUTCMonth() !== month - 1 ||
                parsedDate.getUTCDate() !== day
            ) {
                throw new ApiError(400, "invalid date");
            }
        }

        const whereCondition = {
            center_id: centerId,
            ...(search
                ? {
                    OR: [
                        {
                            enquiry_first_name: {
                                contains: String(search),
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            enquiry_last_name: {
                                contains: String(search),
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                }
                : {}),

            ...(status
                ? {
                    enq_status: status as enquiry_status,
                }
                : {}),

            ...(source
                ? {
                    enquiry_source: {
                        equals: String(source),
                        mode: "insensitive" as const,
                    },
                }
                : {}),

            ...(date
                ? {
                    created_at: {
                        gte: new Date(`${String(date)}T00:00:00.000Z`),
                        lt: new Date(`${String(date)}T23:59:59.999Z`),
                    },
                }
                : {}),
        };
        
        const enquiries = await prisma.enquiry_records.findMany({
            where: whereCondition,
            skip,
            take: limit,
            orderBy: {
                created_at: "desc",
            },
        });

        const totalEnquiries = await prisma.enquiry_records.count({
            where: whereCondition,
        });

        const totalPages = Math.ceil(totalEnquiries / limit);


        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    enquiries,
                    pagination: {
                        page,
                        limit,
                        totalEnquiries,
                        totalPages,
                    },
                },
                "enquiries fetched successfully"
            )
        );
    }
)