import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

const CALENDAR_CACHE_TTL_SECONDS = 60 * 5;

export const candidateAttendanceCalendar = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;
    const courseId = req.query.courseId as string | undefined;
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    if (!candidateId) {
      throw new ApiError(404, "candidate id not found");
    }

    const cacheKey = CANDIDATE_REDIS_KEYS.candidate_attendance_calendar_key(
      candidateId,
      courseId ?? "all",
      month,
      year
    );

    let cached: string | null = null;
    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis GET failed, falling back to DB:", err);
    }

    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const enrollments = await prisma.batch_enrollment.findMany({
      where: { candidate_id: candidateId },
      select: {
        batch_details: {
          select: {
            batch_id: true,
            batch_start_date: true,
            batch_end_date: true,
            course_details: { select: { course_id: true, course_name: true } },
          },
        },
      },
    });

    const courses = Array.from(
      new Map(
        enrollments
          .map((e) => e.batch_details.course_details)
          .filter((c): c is NonNullable<typeof c> => !!c)
          .map((c) => [c.course_id, c])
      ).values()
    );

    if (!courseId) {
      const whereClause = { candidate_id: candidateId };

      const [totalSessions, attendedSessions] = await Promise.all([
        prisma.attendance_records.count({ where: whereClause }),
        prisma.attendance_records.count({
          where: { ...whereClause, attendance_status: { in: ["present", "late"] } },
        }),
      ]);

      const missedSessions = totalSessions - attendedSessions;
      const attendancePercentage =
        totalSessions === 0 ? 0 : Number(((attendedSessions / totalSessions) * 100).toFixed(2));

      const responseBody = new ApiResponse(
        200,
        {
          summary: { totalSessions, attendedSessions, missedSessions, attendancePercentage },
          courses,
          calendar: null,
        },
        "overall attendance summary fetched successfully"
      );

      try {
        await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CALENDAR_CACHE_TTL_SECONDS);
      } catch (err) {
        console.error("Redis SET failed, continuing without caching:", err);
      }

      return res.status(200).json(responseBody);
    }

    const batches = enrollments
      .map((e) => e.batch_details)
      .filter((b) => b.course_details?.course_id === courseId);

    if (batches.length === 0) {
      const responseBody = new ApiResponse(
        200,
        {
          summary: { totalSessions: 0, attendedSessions: 0, missedSessions: 0, attendancePercentage: 0 },
          courses,
          calendar: [],
        },
        "not enrolled in this course"
      );

      try {
        await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CALENDAR_CACHE_TTL_SECONDS);
      } catch (err) {
        console.error("Redis SET failed, continuing without caching:", err);
      }

      return res.status(200).json(responseBody);
    }

    const batchIds = batches.map((b) => b.batch_id);

    // ---------- Course-wide summary (ALL sessions for this course's
    // batches, regardless of month) — independent of the calendar's
    // month window below. ----------
    const allCourseSessions = await prisma.attendance_sessions.findMany({
      where: { batch_id: { in: batchIds } },
      select: {
        session_date: true,
        attendance_records: {
          where: { candidate_id: candidateId },
          select: { attendance_status: true },
        },
      },
    });

    let totalSessions = 0;
    let attendedSessions = 0;
    for (const session of allCourseSessions) {
      const record = session.attendance_records[0];
      const status = record ? record.attendance_status : "absent";
      totalSessions++;
      if (status === "present" || status === "late") attendedSessions++;
    }
    const missedSessions = totalSessions - attendedSessions;
    const attendancePercentage =
      totalSessions === 0 ? 0 : Number(((attendedSessions / totalSessions) * 100).toFixed(2));

    // ---------- Calendar grid — still scoped to the requested month ----------
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0));

    const monthSessions = await prisma.attendance_sessions.findMany({
      where: {
        batch_id: { in: batchIds },
        session_date: { gte: monthStart, lte: monthEnd },
      },
      select: {
        session_date: true,
        attendance_records: {
          where: { candidate_id: candidateId },
          select: { attendance_status: true },
        },
      },
    });

    const statusByDate = new Map<string, "present" | "absent" | "late">();
    const sessionDates = new Set<string>();
    for (const session of monthSessions) {
      const key = session.session_date.toISOString().slice(0, 10);
      const record = session.attendance_records[0];
      sessionDates.add(key);
      statusByDate.set(key, record ? (record.attendance_status as any) : "absent");
    }

    const calendar: { date: string; status: "present" | "absent" | "late" | "holiday" | "today" | "unmarked" | null }[] = [];
    const cursor = new Date(monthStart);
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    while (cursor <= monthEnd) {
      const dateKey = cursor.toISOString().slice(0, 10);
      const dayOfWeek = cursor.getUTCDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isFuture = cursor > todayUTC;

      const withinAnyBatch = batches.some(
        (b) => cursor >= b.batch_start_date && cursor <= b.batch_end_date
      );

      let status: typeof calendar[number]["status"] = null;
      if (statusByDate.has(dateKey)) {
        status = statusByDate.get(dateKey)!;
      } else if (sessionDates.has(dateKey)) {
        status = "absent";
      } else if (withinAnyBatch && !isFuture && !isWeekend) {
        status = "holiday";
      } else if (withinAnyBatch && isWeekend) {
        status = "holiday";
      }

      calendar.push({ date: dateKey, status });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    const responseBody = new ApiResponse(
      200,
      {
        month,
        year,
        courseId,
        summary: { totalSessions, attendedSessions, missedSessions, attendancePercentage },
        courses,
        calendar,
      },
      "course attendance calendar fetched successfully"
    );

    try {
      await redis.set(cacheKey, JSON.stringify(responseBody), "EX", CALENDAR_CACHE_TTL_SECONDS);
    } catch (err) {
      console.error("Redis SET failed, continuing without caching:", err);
    }

    return res.status(200).json(responseBody);
  }
);