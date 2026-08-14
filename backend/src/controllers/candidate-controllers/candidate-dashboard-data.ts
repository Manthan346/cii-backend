import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { CANDIDATE_REDIS_CACHE } from "../../lib/redis";



const candidateDashboardData = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;
  
  if (!candidateId) {
    throw new ApiError(404, "candidate not found");
  }

  const cacheKey = CANDIDATE_REDIS_KEYS.candidate_dashboard_key(candidateId);

  // ---- Try Redis first (fail-open) ----
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (err) {
    console.error("Redis GET failed, falling back to DB:", err);
  }

  if (cached) {
    const dasbhoardData = JSON.parse(cached);
    return res.status(200).json(new ApiResponse(200, { dasbhoardData }, "successful"));
  }

  // ---- Cache miss — compute as before ----
  const [enrolledCoursesResult, totalSessions, pendingAssesment] = await Promise.all([
    prisma.batch_details.findMany({
      where: {
        batch_enrollment: {
          some: { candidate_id: candidateId },
        },
      },
      distinct: ["course_id"],
      select: { course_id: true },
    }),
    prisma.attendance_records.count({
      where: { candidate_id: candidateId },
    }),
    prisma.assessments.count({
      where: {
        batch_details: {
          batch_enrollment: {
            some: { candidate_id: candidateId },
          },
        },
        candidate_assessment: {
          none: { candidate_id: candidateId },
        },
      },
    }),
  ]);

  const enrolledCourses = enrolledCoursesResult.length;

  const dasbhoardData = {
    enrolledCourses,
    totalSessions,
    pendingAssesment,
  };

  // ---- Populate the cache for next time (fail-open) ----
  try {
    await redis.set(cacheKey, JSON.stringify(dasbhoardData), "EX", CANDIDATE_REDIS_CACHE);
  } catch (err) {
    console.error("Redis SET failed, continuing without caching:", err);
  }

  return res.status(200).json(new ApiResponse(200, { dasbhoardData }, "successful"));
});

export default candidateDashboardData;