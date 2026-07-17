import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

export const candidateAttendanceCalendar = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;
    const courseId = req.query.courseId as string | undefined;
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1; // 1-12
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();

    // Course list is always useful for the frontend's course selector,
    // regardless of whether a courseId is selected yet.
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

    // ---------- CASE 1: no courseId -> overall summary, no calendar ----------
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

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            summary: { totalSessions, attendedSessions, missedSessions, attendancePercentage },
            courses,
            calendar: null,
          },
          "overall attendance summary fetched successfully"
        )
      );
    }

    // ---------- CASE 2: courseId selected -> course-scoped summary + calendar ----------
    const batches = enrollments
      .map((e) => e.batch_details)
      .filter((b) => b.course_details?.course_id === courseId);

    if (batches.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            summary: { totalSessions: 0, attendedSessions: 0, missedSessions: 0, attendancePercentage: 0 },
            courses,
            calendar: [],
          },
          "not enrolled in this course"
        )
      );
    }

    const batchIds = batches.map((b) => b.batch_id);
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0));

    const sessions = await prisma.attendance_sessions.findMany({
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
    for (const session of sessions) {
      const key = session.session_date.toISOString().slice(0, 10);
      const record = session.attendance_records[0];
      console.log(record)
      if (record) statusByDate.set(key, record.attendance_status as any);
    }

    let totalSessions = 0;
    let attendedSessions = 0;
    for (const status of statusByDate.values()) {
      totalSessions++;
      if (status === "present" || status === "late") attendedSessions++;
    }
    const missedSessions = totalSessions - attendedSessions;
    const attendancePercentage =
      totalSessions === 0 ? 0 : Number(((attendedSessions / totalSessions) * 100).toFixed(2));

    // Day-by-day grid. ASSUMPTION (no holiday table exists yet): a weekday
    // inside the batch's date range with no session row is treated as a holiday.
    const calendar: { date: string; status: "present" | "absent" | "late" | "holiday" | null }[] = [];
    const cursor = new Date(monthStart);

    while (cursor <= monthEnd) {
      const dateKey = cursor.toISOString().slice(0, 10);
      const dayOfWeek = cursor.getUTCDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const withinAnyBatch = batches.some(
        (b) => cursor >= b.batch_start_date && cursor <= b.batch_end_date
      );

     const today = new Date();
const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

// ... inside the loop:
const isFuture = cursor > todayUTC;

let status: typeof calendar[number]["status"] = null;
if (statusByDate.has(dateKey)) {
  status = statusByDate.get(dateKey)!;
} else if (withinAnyBatch && !isWeekend && !isFuture) {
  status = "holiday";
}

      calendar.push({ date: dateKey, status });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return res.status(200).json(
      new ApiResponse(
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
      )
    );
  }
);