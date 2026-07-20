import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

export const candidateRecentAttendanceLog = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id;

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const fourDaysAgo = new Date(todayUTC);
    fourDaysAgo.setUTCDate(todayUTC.getUTCDate() - 3); // today + previous 3 days = 4 days total

    const recentLogRecords = await prisma.attendance_records.findMany({
      where: {
        candidate_id: candidateId,
        attendance_sessions: {
          session_date: { gte: fourDaysAgo, lte: todayUTC },
        },
      },
      select: {
        attendance_status: true,
        attendance_sessions: {
          select: {
            session_date: true,
            batch_details: {
              select: {
                course_details: { select: { course_id: true, course_name: true } },
              },
            },
          },
        },
      },
      orderBy: { attendance_sessions: { session_date: "desc" } },
    });

    const recentLogs = recentLogRecords.map((r) => ({
      date: r.attendance_sessions.session_date.toISOString().slice(0, 10),
      status: r.attendance_status,
      course_id: r.attendance_sessions.batch_details.course_details?.course_id ?? null,
      course_name: r.attendance_sessions.batch_details.course_details?.course_name ?? null,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, { recentLogs }, "recent attendance log fetched successfully"));
  }
);