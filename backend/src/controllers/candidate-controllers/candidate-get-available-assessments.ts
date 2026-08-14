import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { batch_enrollment_status_type } from "../../generated/prisma/enums";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { CANDIDATE_REDIS_CACHE } from "../../lib/redis";

 // short — drops off the list the moment it's attempted
 CANDIDATE_REDIS_CACHE

export const getAllAssessments = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;

    if (!req.pagination) {
      throw new ApiError(500, "Pagination middleware not found");
    }
    const { page, limit, skip } = req.pagination;

    if (!candidateId) {
      throw new ApiError(401, "Candidate not found");
    }

    const cacheKey = CANDIDATE_REDIS_KEYS.candidate_available_assessments_key(candidateId, page, limit);

    // ---- Try Redis first (fail-open) ----
    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed, falling back to DB:", err);
    }

    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // ---- Cache miss — compute as before ----
    const enrollments = await prisma.batch_enrollment.findMany({
      where: {
        candidate_id: candidateId,
        enrollment_status: batch_enrollment_status_type.ACTIVE,
      },
      select: {
        batch_id: true,
      },
    });

    const batchIds = enrollments.map((e) => e.batch_id);

    if (batchIds.length === 0) {
      const responseBody = new ApiResponse(
        200,
        {
          totalAvailable: 0,
          assessments: [],
        },
        "No active batch enrollments found."
      );

      try {
        await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CANDIDATE_REDIS_CACHE);
      } catch (err) {
        console.error("Redis SET failed, continuing without caching:", err);
      }

      return res.status(200).json(responseBody);
    }

    const attemptedAssessments = await prisma.candidate_assessment.findMany({
      where: {
        candidate_id: candidateId,
      },
      select: {
        assessment_id: true,
      },
    });

    const attemptedIds = attemptedAssessments.map((assessment) => assessment.assessment_id);

    const [assessments, totalAvailable] = await Promise.all([
      prisma.assessments.findMany({
        where: {
          batch_id: { in: batchIds },
          is_show: true,
          assessment_id: { notIn: attemptedIds },
        },
        orderBy: {
          assessment_date: "asc",
        },
        skip,
        take: limit,
        select: {
          assessment_id: true,
          title: true,
          assessment_desc: true,
          assessment_type: true,
          assessment_date: true,
          assessment_duration: true,
          assessment_link: true,
          batch_details: {
            select: {
              batch_name: true,
              batch_code: true,
            },
          },
        },
      }),
      prisma.assessments.count({
        where: {
          batch_id: { in: batchIds },
          is_show: true,
          assessment_id: { notIn: attemptedIds },
        },
      }),
    ]);

    const responseBody = new ApiResponse(
      200,
      {
        page,
        limit,
        totalAvailable,
        totalPages: Math.ceil(totalAvailable / limit),
        assessments,
      },
      "Available assessments fetched successfully"
    );

    // ---- Populate the cache for next time (fail-open) ----
    try {
      await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CANDIDATE_REDIS_CACHE);
    } catch (err) {
      console.error("Redis SET failed, continuing without caching:", err);
    }

    return res.status(200).json(responseBody);
  }
);
