import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getDashboardEnrollment = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;
  const { course_id, from_month, from_year, to_month, to_year } = req.query;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Parse date filters (optional - if not provided, use sensible defaults)
  const fromMonth = from_month ? parseInt(from_month as string) : 1;
  const fromYear = from_year ? parseInt(from_year as string) : new Date().getFullYear();
  const toMonth = to_month ? parseInt(to_month as string) : 12;
  const toYear = to_year ? parseInt(to_year as string) : new Date().getFullYear();

  // Validate months
  if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  // Build date range - from start of from_month to end of to_month
  const fromDate = new Date(Date.UTC(fromYear, fromMonth - 1, 1));
  const toDate = new Date(Date.UTC(toYear, toMonth, 0, 23, 59, 59, 999));

  if (fromDate > toDate) {
    throw new ApiError(400, "From date must be before or equal to to date");
  }

  // Get center's companies for center isolation
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  if (centerCompanyIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { course_wise_enrollment: [], monthly_admissions: [] }, "No companies associated with this center")
    );
  }

  // Build enrollment where clause
  const enrollmentWhere: any = {
    batch_details: {
      center_id: centerId,
      course_details: { company_id: { in: centerCompanyIds } },
    },
    enrollment_date: { gte: fromDate, lte: toDate },
  };

  // Apply course filter if provided
  if (course_id) {
    enrollmentWhere.batch_details.course_id = course_id as string;
  }

  // Fetch enrollments with course info and batch status
  const enrollments = await prisma.batch_enrollment.findMany({
    where: enrollmentWhere,
    select: {
      enrollment_date: true,
      batch_details: {
        select: {
          course_id: true,
          b_status: true,
          course_details: { select: { course_name: true } },
        },
      },
    },
    orderBy: { enrollment_date: 'asc' },
  });

  // If no enrollments found
  if (enrollments.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { course_wise_enrollment: [], monthly_admissions: [] }, "No enrollments found for the selected filters")
    );
  }

  // --- COURSE-WISE ENROLLMENT ---
  // Aggregate enrollments by course
  const courseStats = new Map<string, { course_name: string; enrollment: number }>();

  for (const e of enrollments) {
    const courseId = e.batch_details.course_id;
    const courseName = e.batch_details.course_details.course_name;
    const existing = courseStats.get(courseId) || { course_name: courseName, enrollment: 0 };
    existing.enrollment++;
    courseStats.set(courseId, existing);
  }

  const courseWiseEnrollment = Array.from(courseStats.entries()).map(([course_id, data]) => ({
    course: data.course_name,
    enrollment: data.enrollment,
  }));

  // --- MONTHLY ADMISSIONS ---
  // Generate all months in range for consistent output
  const months: { key: string; label: string; start: Date; end: Date }[] = [];
  let current = new Date(fromDate);
  while (current <= toDate) {
    const year = current.getUTCFullYear();
    const month = current.getUTCMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const label = current.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", etc.
    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    months.push({ key, label, start, end });
    current = new Date(Date.UTC(year, month + 1, 1));
  }

  // Aggregate enrollments by month
  const monthStats = new Map<string, number>();
  for (const m of months) {
    monthStats.set(m.key, 0);
  }

  for (const e of enrollments) {
    const date = new Date(e.enrollment_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (monthStats.has(key)) {
      monthStats.set(key, (monthStats.get(key) || 0) + 1);
    }
  }

  const monthlyAdmissions = months.map(m => ({
    month: m.label,
    enrollment: monthStats.get(m.key) || 0,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course_wise_enrollment: courseWiseEnrollment,
        monthly_admissions: monthlyAdmissions,
      },
      "Dashboard enrollment data fetched successfully"
    )
  );
});

export { getDashboardEnrollment };