import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { batch_enrollment_status_type } from "../../generated/prisma/enums";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client";

// uploads are infrequent, long TTL is fine
export const getAllCandidateStudyMaterial = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidate_id = req.candidate?.candidate_id;

    if (!candidate_id) {
      throw new ApiError(401, "Unauthorized");
    }

    const studyMaterialSchema = z.object({
      batch_id: z.string().uuid("Invalid Batch ID").optional(),
      search: z.string().trim().optional(),
    });

    const validation = studyMaterialSchema.safeParse(req.query);

    if (!validation.success) {
      throw new ApiError(
        400,
        validation.error.issues[0]?.message || "Invalid request",
      );
    }

    const { batch_id, search } = validation.data;

    const enrollments = await prisma.batch_enrollment.findMany({
      where: {
        candidate_id,
        enrollment_status: batch_enrollment_status_type.ACTIVE,
      },
      select: {
        batch_id: true,
      },
    });

    const enrolledBatchIds = enrollments.map(
      (enrollment) => enrollment.batch_id,
    );

    if (batch_id && !enrolledBatchIds.includes(batch_id)) {
      throw new ApiError(403, "You are not enrolled in this batch");
    }

    if (!req.pagination) {
      throw new ApiError(500, "Pagination middleware not found");
    }

    const { page, limit, skip } = req.pagination;

    if (page < 1) {
      throw new ApiError(400, "Page must be greater than or equal to 1");
    }

    if (limit < 1 || limit > 50) {
      throw new ApiError(400, "Limit must be between 1 and 50");
    }

    const where: Prisma.study_materialWhereInput = {
      is_show: true,
      batch_id: batch_id
        ? batch_id
        : {
            in: enrolledBatchIds,
          },
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [studyMaterials, totalItems] = await Promise.all([
      prisma.study_material.findMany({
        where,
        include: {
          batch_details: {
            select: {
              batch_name: true,
            },
          },
          user_login: {
            select: {
              instructor_details: {
                select: {
                  instructor_first_name: true,
                  instructor_last_name: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),

      prisma.study_material.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const responseBody = new ApiResponse(200, {
      studyMaterials,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });

    // ---- Populate the cache for next time (fail-open) ----
    /*
    try {
      await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CANDIDATE_REDIS_CACHE);
    } catch (err) {
      console.error("Redis SET failed, continuing without caching:", err);
    }

    return res.status(200).json(responseBody);*/
  },
);
