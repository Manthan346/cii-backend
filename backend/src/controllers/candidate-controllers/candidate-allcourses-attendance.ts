import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

const allCoursesAttendance = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

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

  // Group by course_id (a course can span multiple batches/enrollments)
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

  return res.status(200).json(new ApiResponse(200, { courses }, "success"));
});

export default allCoursesAttendance;