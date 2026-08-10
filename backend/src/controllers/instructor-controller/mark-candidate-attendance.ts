import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { INSTRUCTOR_REDIS_KEYS } from "../../constants/instructor-keys/instructor-keys";
import { addAttendanceBodySchema } from "../../services/zod/instructor/mark-attendance-schema";

const addCandidateAttendance = asyncHandler(async (req: InstructorAuthRequest, res: Response) => {
  const instructorId = req.instructor?.instructor_id;
  const attendanceSessionId = req.params.attendanceSessionId as string

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
    },
  });

  if (!session) {
    throw new ApiError(404, "attendance session not found");
  }

  if (session.instructor_id !== instructorId) {
    throw new ApiError(403, "you don't have permission to mark attendance for this session");
  }

  const candidateIds = attendance.map((a) => a.candidateId);
  const enrollments = await prisma.batch_enrollment.findMany({
    where: {
      batch_id: session.batch_id,
      candidate_id: { in: candidateIds },
      enrollment_status: "ACTIVE",
    },
    select: { candidate_id: true },
  });
  const enrolledCandidateIds = new Set(enrollments.map((e) => e.candidate_id));

  const invalidCandidateIds = candidateIds.filter((id) => !enrolledCandidateIds.has(id));
  if (invalidCandidateIds.length > 0) {
    throw new ApiError(
      400,
      `The following candidates are not actively enrolled in this batch: ${invalidCandidateIds.join(", ")}`
    );
  }

  await prisma.$transaction(
    attendance.map((entry) =>
      prisma.attendance_records.upsert({
        where: {
          uq_session_candidate: {
            attendance_session_id: attendanceSessionId,
            candidate_id: entry.candidateId,
          },
        } as any,
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
    await Promise.all(
      candidateIds.map((id) =>
        redis.del(INSTRUCTOR_REDIS_KEYS.mark_attendance_key(id))
      )
    );
  } catch (err) {
    console.error("Redis DEL failed after marking attendance:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, { markedCount: attendance.length }, "Attendance marked successfully")
  );
});

export { addCandidateAttendance };