import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getCoursePerformance = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Single query: get all enrollments with batch.course_id, b_status, certificate_url
  const enrollments = await prisma.batch_enrollment.findMany({
    where: {
      batch_details: { center_id: centerId },
    },
    select: {
      batch_details: { select: { course_id: true, b_status: true } },
      certificate_url: true,
    },
  });

  if (enrollments.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { course_performance: [] }, "No enrollments found for this center")
    );
  }

  // One-pass aggregation by course_id
  const courseStats = new Map<string, { enrolled: number; active: number; certified: number }>();

  for (const e of enrollments) {
    const courseId = e.batch_details.course_id;
    const stat = courseStats.get(courseId) || { enrolled: 0, active: 0, certified: 0 };
    stat.enrolled++;
    if (e.batch_details.b_status === "ACTIVE") stat.active++;
    if (e.certificate_url) stat.certified++;
    courseStats.set(courseId, stat);
  }

  // Get course names for the course_ids found
  const courseIds = Array.from(courseStats.keys());
  const courses = await prisma.course_details.findMany({
    where: { course_id: { in: courseIds } },
    select: { course_id: true, course_name: true },
  });

  const coursePerformance = courses.map((course) => ({
    course_id: course.course_id,
    course: course.course_name,
    enrolled_candidates: courseStats.get(course.course_id)?.enrolled || 0,
    active_candidates: courseStats.get(course.course_id)?.active || 0,
    certificates: courseStats.get(course.course_id)?.certified || 0,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      { course_performance: coursePerformance },
      "Course performance fetched successfully"
    )
  );
});

export { getCoursePerformance };