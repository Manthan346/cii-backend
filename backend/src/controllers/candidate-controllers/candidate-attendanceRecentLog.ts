import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

const RECENT_LOG_CACHE_TTL_SECONDS = 60 * 5;

export const candidateRecentAttendanceLog = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;

    if (!candidateId) {
      throw new ApiError(404, "candidate id not found");
    }

    const cacheKey = CANDIDATE_REDIS_KEYS.candidate_recent_attendance_log_key(candidateId);

    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed, falling back to DB:", err);
    }

    if (cached) {
      const recentLogs = JSON.parse(cached);
      return res
        .status(200)
        .json(new ApiResponse(200, { recentLogs }, "recent attendance log fetched successfully"));
    }

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const fourDaysAgo = new Date(todayUTC);
    fourDaysAgo.setUTCDate(todayUTC.getUTCDate() - 3);

    // Find which of this candidate's batches were active in this window,
    // so we know which sessions are even relevant to them.
    const enrollments = await prisma.batch_enrollment.findMany({
      where: { candidate_id: candidateId },
      select: { batch_id: true },
    });
    const batchIds = enrollments.map((e) => e.batch_id);

    // Start from SESSIONS (every class that happened), not attendance_records,
    // so a session with no record for this candidate still shows up.
    const sessionsInWindow = await prisma.attendance_sessions.findMany({
      where: {
        batch_id: { in: batchIds },
        session_date: { gte: fourDaysAgo, lte: todayUTC },
      },
      select: {
        session_date: true,
        batch_details: {
          select: {
            course_details: { select: { course_id: true, course_name: true } },
          },
        },
        attendance_records: {
          where: { candidate_id: candidateId },
          select: { attendance_status: true },
        },
      },
      orderBy: { session_date: "desc" },
    });

    const recentLogs = sessionsInWindow.map((session) => {
      const record = session.attendance_records[0];
      return {
        date: session.session_date.toISOString().slice(0, 10),
        status: record ? record.attendance_status : "absent", // no record = absent
        course_id: session.batch_details.course_details?.course_id ?? null,
        course_name: session.batch_details.course_details?.course_name ?? null,
      };
    });

    try {
      await redis.set(cacheKey, JSON.stringify(recentLogs), "EX", RECENT_LOG_CACHE_TTL_SECONDS);
    } catch (err) {
      console.error("Redis SET failed, continuing without caching:", err);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { recentLogs }, "recent attendance log fetched successfully"));
  }
);