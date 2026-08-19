import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";

export const getPlacementApplications = asyncHandler(
    async (req: Request, res: Response) => {
        const {
            search,
            company_name,
            job_role,
            from_date,
            to_date,
        } = req.query;

        const { page, limit, skip } = req.pagination!;

        const where = {
            AND: [
                ...(typeof search === "string"
                    ? [
                          {
                              OR: [
                                  {
                                      applicant_name: {
                                          contains: search,
                                          mode: "insensitive" as const,
                                      },
                                  },
                                  {
                                      placement: {
                                          job_role: {
                                              contains: search,
                                              mode: "insensitive" as const,
                                          },
                                      },
                                  },
                              ],
                          },
                      ]
                    : []),

                ...(typeof company_name === "string"
                    ? [
                          {
                              placement: {
                                  company_name: {
                                      contains: company_name,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                      ]
                    : []),

                ...(typeof job_role === "string"
                    ? [
                          {
                              placement: {
                                  job_role: {
                                      contains: job_role,
                                      mode: "insensitive" as const,
                                  },
                              },
                          },
                      ]
                    : []),

                ...(typeof from_date === "string" ||
                typeof to_date === "string"
                    ? [
                          {
                              applied_date: {
                                  ...(typeof from_date === "string"
                                      ? {
                                            gte: new Date(from_date),
                                        }
                                      : {}),

                                  ...(typeof to_date === "string"
                                      ? {
                                            lte: new Date(to_date),
                                        }
                                      : {}),
                              },
                          },
                      ]
                    : []),
            ],
        };

        const [applications, totalItems] = await Promise.all([
            prisma.placement_applications.findMany({
                where,
                skip,
                take: limit,

                orderBy: {
                    applied_date: "desc",
                },

                select: {
                    application_id: true,
                    applicant_name: true,
                    email: true,
                    contact_no: true,
                    applied_date: true,
                    resume: true,
                    source: true,
                    application_status: true,

                    placement: {
                        select: {
                            job_role: true,
                            company_name: true,
                        },
                    },
                },
            }),

            prisma.placement_applications.count({
                where,
            }),
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return res.status(200).json({
            success: true,
            message: "Placement applications fetched successfully.",
            data: applications,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
            },
        });
    }
);