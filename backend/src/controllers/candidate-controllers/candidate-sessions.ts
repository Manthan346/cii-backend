import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

const candidateUpcomingSessions = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const enrollments = await prisma.batch_enrollment.findMany({
    where: {
      candidate_id: candidateId,
      enrollment_status: "Active",
    },
    select: {
      batch_details: {
        select: {
          batch_name: true,
          attendance_sessions: {
            where: {
            //   session_date: { gte: today },
            },
            orderBy: { session_date: "asc" },
            select: {
              attendance_session_id: true,
              session_date: true,
              session_time: true,
              topic_name: true,
              room_no: true,
              attendance_mode: true,
              instructor_details: {
                select: {
                  instructor_first_name: true,
                  instructor_last_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const sessions = enrollments
    .flatMap((enrollment) =>
      enrollment.batch_details.attendance_sessions.map((session) => ({
        session_id: session.attendance_session_id,
        batch_name: enrollment.batch_details.batch_name,
        session_date: session.session_date,
        session_time: session.session_time,
        topic_name: session.topic_name,
        room_no: session.room_no,
        attendance_mode: session.attendance_mode,
        instructor: session.instructor_details
          ? `${session.instructor_details.instructor_first_name} ${session.instructor_details.instructor_last_name ?? ""}`.trim()
          : null,
      }))
    )
    .sort((a, b) => a.session_date.getTime() - b.session_date.getTime());

  return res.status(200).json(
    new ApiResponse(200, { totalSessions: sessions.length, sessions }, "sessions fetched successfully")
  );
});

export default candidateUpcomingSessions;