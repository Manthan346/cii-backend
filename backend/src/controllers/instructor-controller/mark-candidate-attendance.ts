import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { INSTRUCTOR_REDIS_KEYS } from "../../constants/instructor-keys/instructor-keys";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";
import { addAttendanceBodySchema } from "../../services/zod/instructor/mark-attendance-schema";

const addCandidateAttendance = asyncHandler(async (req: InstructorAuthRequest, res: Response) => {
  const instructorId = req.instructor?.instructor_id;
  const attendanceSessionId = req.params.attendanceSessionId as string;

  if (!instructorId) {
    throw new ApiError(404, "instructor id not found");
  }

  if (!attendanceSessionId) {
    throw new ApiError(400, "attendanceSessionId is required in the URL");
  }

  const validation = addAttendanceBodySchema.safeParse(req.body);
  if (!validation.success) {
    throw new ApiError(400, validation.error.issues.map((i) => i.message).join("; "));
  }

  const { attendance } = validation.data;

  const session = await prisma.attendance_sessions.findUnique({
    where: { attendance_session_id: attendanceSessionId },
    select: {
      instructor_id: true,
      batch_id: true,
      batch_details: {
        select: {
          course_id: true,
        },
      },
    },
  });

  if (!session) {
    throw new ApiError(404, "attendance session not found");
  }

  if (session.instructor_id !== instructorId) {
    throw new ApiError(403, "you don't have permission to mark attendance for this session");
  }

  const courseId = session.batch_details.course_id;

  const candidateIds = attendance.map((a) => a.candidateId);
  const enrollments = await prisma.batch_enrollment.findMany({
    where: {
      batch_id: session.batch_id,
      candidate_id: { in: candidateIds },
    },
    select: {
      enrollment_id: true,
      candidate_id: true,
      enrollment_status: true,
      candidates_details: {
        select: {
          candidate_unique_id: true,
          candidate_first_name: true,
          candidate_last_name: true,
        },
      },
    },
  });

  // Map for quick lookup: candidate_id -> enrollment record
  const enrollmentMap = new Map(enrollments.map((e) => [e.candidate_id, e]));

  // Candidates not in batch_enrollment at all → fetch from candidates_details
  const missingFromEnrollment = candidateIds.filter((id) => !enrollmentMap.has(id));
  const extraDetails = new Map(
    (
      await prisma.candidates_details.findMany({
        where: { candidate_id: { in: missingFromEnrollment } },
        select: { candidate_id: true, candidate_unique_id: true, candidate_first_name: true, candidate_last_name: true },
      })
    ).map((c) => [c.candidate_id, c])
  );

  // Find invalid: not enrolled OR not ACTIVE
  const invalidCandidates = candidateIds
    .filter((id) => {
      const e = enrollmentMap.get(id);
      return !e || e.enrollment_status !== "ACTIVE";
    })
    .map((id) => {
      const e = enrollmentMap.get(id);
      const d = e?.candidates_details ?? extraDetails.get(id);
      return {
        candidateId: id,
        uniqueCode: d?.candidate_unique_id ?? "N/A",
        name: d ? `${d.candidate_first_name} ${d.candidate_last_name ?? ""}`.trim() : "Unknown",
      };
    });

  if (invalidCandidates.length > 0) {
    throw new ApiError(
      400,
      `The following candidates are not actively enrolled in this batch: ${invalidCandidates
        .map((c) => `${c.name} (${c.uniqueCode})`)
        .join(", ")}`
    );
  }

  const record = await prisma.$transaction(
    attendance.map((entry) =>
      prisma.attendance_records.upsert({
        where: {
          attendance_session_id_candidate_id: {
            attendance_session_id: attendanceSessionId,
            candidate_id: entry.candidateId,
          },
        },
        update: {
          attendance_status: entry.attendanceStatus,
          remarks: entry.remarks,
        },
        create: {
          attendance_session_id: attendanceSessionId,
          candidate_id: entry.candidateId,
          attendance_status: entry.attendanceStatus,
          remarks: entry.remarks,
        },
      })
    )
  );

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
    const currentYear = now.getFullYear();

    await Promise.all(
      enrollments.flatMap((e) => [
        // Delete instructor-side attendance marking cache
        redis.del(INSTRUCTOR_REDIS_KEYS.mark_attendance_key(e.candidate_id)),
        // Delete candidate profile cache so frontend gets fresh attendance data
        // Delete attendance-specific cache keys
        redis.del(CANDIDATE_REDIS_KEYS.candidate_all_courses_attendance_key(e.candidate_id)),
        redis.del(CANDIDATE_REDIS_KEYS.candidate_attendance_calendar_key(e.candidate_id, courseId, currentMonth, currentYear)),
        redis.del(CANDIDATE_REDIS_KEYS.candidate_recent_attendance_log_key(e.candidate_id)),
      ])
    );
  } catch (err) {
    console.error("Redis DEL failed after marking attendance:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, { markedCount: attendance.length, record }, "Attendance marked successfully")
  );
});

export { addCandidateAttendance };