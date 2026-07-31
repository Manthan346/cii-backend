import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

const ATTENDANCE_CACHE_TTL_SECONDS = 60 * 10;

const allCoursesAttendance = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

  if (!candidateId) {
    throw new ApiError(404, "candidate id not found");
  }

  const cacheKey = CANDIDATE_REDIS_KEYS.candidate_all_courses_attendance_key(candidateId);

  // ---- 1. Try Redis first (fail-open) ----
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (err) {
    console.error("Redis GET failed, falling back to DB:", err);
  }

  if (cached) {
    const courses = JSON.parse(cached);
    return res.status(200).json(new ApiResponse(200, { courses }, "success"));
  }

  // ---- 2. Cache miss — fall back to the database ----
  const enrollments = await prisma.batch_enrollment.findMany({
    where: { candidate_id: candidateId },
    select: {
      batch_details: {
        select: {
          course_details: {
            select: {
              course_id: true,
              course_name: true,
            },
          },
          attendance_sessions: {
            select: {
              attendance_records: {
                where: { candidate_id: candidateId },
                select: { attendance_status: true },
              },
            },
          },
        },
      },
    },
  });

  const courseMap = new Map<string, { course_name: string; total: number; attended: number }>();

  for (const enrollment of enrollments) {
    const course = enrollment.batch_details.course_details;
    if (!course) continue;

    if (!courseMap.has(course.course_id)) {
      courseMap.set(course.course_id, {
        course_name: course.course_name,
        total: 0,
        attended: 0,
      });
    }

    const entry = courseMap.get(course.course_id)!;
    const allRecords = enrollment.batch_details.attendance_sessions.flatMap(
      (s) => s.attendance_records
    );

    entry.total += allRecords.length;
    entry.attended += allRecords.filter(
      (r) => r.attendance_status === "present" || r.attendance_status === "late"
    ).length;
  }

  const courses = Array.from(courseMap.entries()).map(([course_id, c]) => ({
    course_id,
    course_name: c.course_name,
    totalSessions: c.total,
    attendedSessions: c.attended,
    attendancePercentage:
      c.total === 0 ? 0 : Number(((c.attended / c.total) * 100).toFixed(2)),
  }));

  // ---- 3. Populate the cache for next time (fail-open) ----
  try {
    await redis.set(cacheKey, JSON.stringify(courses), "EX", ATTENDANCE_CACHE_TTL_SECONDS);
  } catch (err) {
    console.error("Redis SET failed, continuing without caching:", err);
  }

  return res.status(200).json(new ApiResponse(200, { courses }, "success"));
});

export default allCoursesAttendance;