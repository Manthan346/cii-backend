import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

/**
 * GET /mobilizer/courses/simple
 * Returns simple list of courses (id and name) for dropdowns - center-scoped
 */
const getMobilizerSimpleCourses = asyncHandler(async (req: MobilizerAuthRequest, res: Response) => {
  const centerId = req.mobilizer?.center_id;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Get companies associated with this center
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  if (centerCompanyIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { courses: [], total: 0 }, "No companies associated with this center")
    );
  }

  const courseWhere: any = {
    company_id: { in: centerCompanyIds },
  };

  const courses = await prisma.course_details.findMany({
    where: courseWhere,
    select: {
      course_id: true,
      course_name: true,
    },
    orderBy: { course_name: "asc" },
  });

  const coursesData = courses.map(course => ({
    course_id: course.course_id,
    course_name: course.course_name,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      { courses: coursesData, total: coursesData.length },
      "Courses fetched successfully"
    )
  );
});

export { getMobilizerSimpleCourses };