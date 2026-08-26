import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getCourses = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;
  const {
    page = 1,
    limit = 10,
    search,
    company_id,
    course_mode
  } = req.query;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  // Get companies associated with this center
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  if (centerCompanyIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { courses: [], total: 0, page: pageNum, limit: limitNum }, "No companies associated with this center")
    );
  }

  // Build course where clause
  const courseWhere: any = {
    company_id: { in: centerCompanyIds },
  };

  if (company_id) {
    courseWhere.company_id = company_id;
  }

  if (search) {
    const searchStr = search as string;
    courseWhere.OR = [
      { course_name: { contains: searchStr, mode: 'insensitive' } },
      { company_details: { company_name: { contains: searchStr, mode: 'insensitive' } } },
    ];
  }

  if (course_mode) {
    courseWhere.course_mode = course_mode;
  }

  // Get courses with pagination
  const [courses, total] = await Promise.all([
    prisma.course_details.findMany({
      where: courseWhere,
      select: {
        course_id: true,
        course_name: true,
        course_duration: true,
        course_mode: true,
        company_id: true,
        company_details: { select: { company_name: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.course_details.count({ where: courseWhere }),
  ]);

  // Transform response
  const coursesData = courses.map(course => ({
    course_id: course.course_id,
    course_name: course.course_name,
    course_duration: course.course_duration,
    course_mode: course.course_mode,
    company_id: course.company_id,
    company_name: course.company_details.company_name,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses: coursesData,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Courses fetched successfully"
    )
  );
});

export { getCourses };