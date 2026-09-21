import { Response } from "express";

import { asyncHandler } from "../../helpers/asyncHandler";

import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";

import { prisma } from "../../lib/prisma";

import { redis } from "../../lib/redis";

import { ApiError } from "../../helpers/ApiError";

import { ApiResponse } from "../../helpers/ApiResponse";

import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";


const COURSE_STATS_CACHE_TTL_SECONDS = 60 * 10;


const candidateCourseStats = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;

    if (!candidateId) {
      throw new ApiError(404, "candidate id not found");
    }

    const cacheKey =
      CANDIDATE_REDIS_KEYS.candidate_course_stats_key(candidateId);

    // ---------------------------------------------------------
    // 1. Try Redis first
    // ---------------------------------------------------------

    let cached: string | null = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error(
        "Redis GET failed, falling back to DB:",
        err
      );
    }

    if (cached) {
      const courseStats = JSON.parse(cached);

      return res.status(200).json(
        new ApiResponse(
          200,
          { courseStats },
          "candidate course stats fetched successfully"
        )
      );
    }
    // ---------------------------------------------------------
    // 2. Get total enrolled courses
    // ---------------------------------------------------------
    const totalEnrolledCourses =
      await prisma.batch_enrollment.count({
        where: {
          candidate_id: candidateId,
        },
      });
    // ---------------------------------------------------------
    // 3. Get completed courses
    //
    // certificate_url exists = completed
    // ---------------------------------------------------------
    const completedCourses =
      await prisma.batch_enrollment.count({
        where: {
          candidate_id: candidateId,
          certificate_url: {
            not: null,
          },
        },
      });
    // ---------------------------------------------------------
    // 4. Calculate in-progress courses
    //
    // Total = Completed + In Progress
    // ---------------------------------------------------------
    const inProgressCourses =
      totalEnrolledCourses - completedCourses;
    // ---------------------------------------------------------
    // 5. Prepare stats
    // ---------------------------------------------------------
    const courseStats = {
      total_enrolled_courses: totalEnrolledCourses,
      in_progress_courses: inProgressCourses,
      completed_courses: completedCourses,
    };
    // ---------------------------------------------------------
    // 6. Store in Redis
    // ---------------------------------------------------------
    try {
      await redis.set(
        cacheKey,
        JSON.stringify(courseStats),
        "EX",
        COURSE_STATS_CACHE_TTL_SECONDS
      );
    } catch (err) {
      console.error(
        "Redis SET failed, continuing without caching:",
        err
      );
    }
    // ---------------------------------------------------------
    // 7. Response
    // ---------------------------------------------------------
    return res.status(200).json(
      new ApiResponse(
        200,
        { courseStats },
        "candidate course stats fetched successfully"
      )
    );
  }
);

export { candidateCourseStats };