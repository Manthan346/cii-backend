import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { CandidateAcademicDetails } from "../../types/candidate-types/candidate-type";


const ACADEMIC_CACHE_TTL_SECONDS = 60 * 10;

const candidateAcademicDetails = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

  if (!candidateId) {
    throw new ApiError(404, "candidate id not found");
  }

  const cacheKey = CANDIDATE_REDIS_KEYS.candidate_academic_key(candidateId);

  // ---- 1. Try Redis first (fail-open) ----
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (err) {
    console.error("Redis GET failed, falling back to DB:", err);
  }

  if (cached) {
    const academicDetails: CandidateAcademicDetails = JSON.parse(cached);
    return res.status(200).json(
      new ApiResponse(200, { academicDetails }, "candidate Profile fetched successfully")
    );
  }

  // ---- 2. Cache miss — fall back to the database ----
  const academics = await prisma.candidates_details.findUnique({
    where: { candidate_id: candidateId },
    select: {
      candidate_id: true,
      candidate_first_name: true,
      candidate_last_name: true,
      user_login: {
        select: {
          center_details: { select: { center_name: true } },
        },
      },
      batch_enrollment: {
        select: {
          enrollment_id: true,
          enrollment_date: true,
          enrollment_status: true,
          batch_details: {
            select: {
              batch_id: true,
              batch_name: true,
              batch_start_date: true,
              batch_type: true,
              batch_end_date: true,
              instructor_details: {
                select: {
                  instructor_first_name: true,
                  instructor_last_name: true,
                },
              },
              course_details: {
                select: {
                  course_id: true,
                  course_name: true,
                  course_duration: true,
                  course_desc: true,
                  course_mode: true,
                  company_details: { select: { company_name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  // Guard explicitly instead of chaining `?.` inconsistently — every
  // field below can now safely assume `academics` is non-null.
  if (!academics) {
    throw new ApiError(404, "candidate not found");
  }

  const centerName = academics.user_login.center_details.center_name;

  const academicDetails: CandidateAcademicDetails = {
    candidate_id: academics.candidate_id,
    candidate_name: `${academics.candidate_first_name} ${academics.candidate_last_name ?? ""}`.trim(),
    center_name: centerName,
    courses: academics.batch_enrollment.map((enrollment) => {
      const instructorName = enrollment.batch_details.instructor_details
        ? `${enrollment.batch_details.instructor_details.instructor_first_name} ${enrollment.batch_details.instructor_details.instructor_last_name ?? ""}`.trim()
        : null;

      return {
        title: enrollment.batch_details.batch_name,
        course: enrollment.batch_details.course_details.course_name,
        company: enrollment.batch_details.course_details.company_details.company_name,
        mode: enrollment.batch_details.course_details.course_mode,
        course_type: enrollment.batch_details.batch_type,
        location: centerName,
        enrolled_date: enrollment.enrollment_date,
        starting_date: enrollment.batch_details.batch_start_date,
        end_date: enrollment.batch_details.batch_end_date,
        trainer_name: instructorName,
        supervisor_name: instructorName,
        description: enrollment.batch_details.course_details.course_desc,
      };
    }),
  };

  // ---- 3. Populate the cache for next time (fail-open) ----
  try {
    await redis.set(cacheKey, JSON.stringify(academicDetails), "EX", ACADEMIC_CACHE_TTL_SECONDS);
  } catch (err) {
    console.error("Redis SET failed, continuing without caching:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, { academicDetails }, "candidate Profile fetched successfully")
  );
});

export { candidateAcademicDetails };