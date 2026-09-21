import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getEnrollmentAnalytics = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;
  const { course_id, from_month, from_year, to_month, to_year } = req.query;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Parse date filters (optional - if not provided, use sensible defaults: current year Jan-Dec)
  const fromMonth = from_month ? parseInt(from_month as string) : 1;
  const fromYear = from_year ? parseInt(from_year as string) : new Date().getFullYear();
  const toMonth = to_month ? parseInt(to_month as string) : 12;
  const toYear = to_year ? parseInt(to_year as string) : new Date().getFullYear();

  // Validate months
  if (fromMonth < 1 || fromMonth > 12 || toMonth < 1 || toMonth > 12) {
    throw new ApiError(400, "Month must be between 1 and 12");
  }

  // Build date range - from start of from_month to end of to_month (UTC)
  const fromDate = new Date(Date.UTC(fromYear, fromMonth - 1, 1));
  const toDate = new Date(Date.UTC(toYear, toMonth, 0, 23, 59, 59, 999));

  if (fromDate > toDate) {
    throw new ApiError(400, "From date must be before or equal to to date");
  }

  // Get center's companies for center isolation (through center_company join table)
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  if (centerCompanyIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { course_wise_enrollment: [], monthly_enrollment: [], course_monthly_breakdown: [] }, "No companies associated with this center")
    );
  }

  // Build enrollment where clause - enrollment comes from batch_enrollment
  const enrollmentWhere: any = {
    batch_details: {
      center_id: centerId,
      course_details: { company_id: { in: centerCompanyIds } },
    },
    enrollment_date: { gte: fromDate, lte: toDate },
    // Only count active enrollments for analytics
    enrollment_status: "ACTIVE",
  };

  // Apply course filter if provided (optional - if not provided, show all courses)
  if (course_id) {
    enrollmentWhere.batch_details.course_id = course_id as string;
  }

  // Fetch enrollments with course info, batch status, and enrollment date
  const enrollments = await prisma.batch_enrollment.findMany({
    where: enrollmentWhere,
    select: {
      enrollment_date: true,
      enrollment_status: true,
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

  // If no enrollments found, return empty arrays with all months for consistent chart rendering
  const monthLabels: string[] = [];
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
    monthLabels.push(label);
    current = new Date(Date.UTC(year, month + 1, 1));
  }

  if (enrollments.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          course_wise_enrollment: [],
          monthly_enrollment: months.map(m => ({ month: m.label, enrollment: 0 })),
          course_monthly_breakdown: [],
          available_courses: [],
          date_range: { from: { month: fromMonth, year: fromYear }, to: { month: toMonth, year: toYear } },
        },
        "No enrollments found for the selected filters"
      )
    );
  }

  // --- 1. COURSE-WISE ENROLLMENT (for horizontal bar chart) ---
  // Aggregate enrollments by course
  const courseStats = new Map<string, { course_name: string; enrollment: number }>();

  for (const e of enrollments) {
    const courseId = e.batch_details.course_id;
    const courseName = e.batch_details.course_details.course_name;
    const existing = courseStats.get(courseId) || { course_name: courseName, enrollment: 0 };
    existing.enrollment++;
    courseStats.set(courseId, existing);
  }

  // Sort by enrollment descending for better chart visualization
  const courseWiseEnrollment = Array.from(courseStats.entries())
    .map(([course_id, data]) => ({
      course_id,
      course: data.course_name,
      enrollment: data.enrollment,
    }))
    .sort((a, b) => b.enrollment - a.enrollment);

  // Get list of available courses for frontend filter dropdown
  const availableCourses = Array.from(courseStats.entries()).map(([course_id, data]) => ({
    course_id,
    course_name: data.course_name,
  }));

  // --- 2. MONTHLY ENROLLMENT (for horizontal/vertical bar chart - total per month) ---
  // Initialize all months with 0
  const monthStats = new Map<string, number>();
  for (const m of months) {
    monthStats.set(m.key, 0);
  }

  // Aggregate enrollments by month
  for (const e of enrollments) {
    const date = new Date(e.enrollment_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    if (monthStats.has(key)) {
      monthStats.set(key, (monthStats.get(key) || 0) + 1);
    }
  }

  const monthlyEnrollment = months.map(m => ({
    month: m.label,
    month_key: m.key,
    enrollment: monthStats.get(m.key) || 0,
  }));

  // --- 3. COURSE-MONTHLY BREAKDOWN (for stacked bar chart - enrollment per course per month) ---
  // This allows frontend to create stacked/grouped bar charts showing each course's monthly enrollment
  const courseMonthlyMap = new Map<string, Map<string, number>>(); // course_id -> (month_key -> count)

  for (const e of enrollments) {
    const date = new Date(e.enrollment_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const courseId = e.batch_details.course_id;

    if (!courseMonthlyMap.has(courseId)) {
      // Initialize all months for this course with 0
      const courseMonthMap = new Map<string, number>();
      for (const m of months) {
        courseMonthMap.set(m.key, 0);
      }
      courseMonthlyMap.set(courseId, courseMonthMap);
    }
    const courseMonthMap = courseMonthlyMap.get(courseId)!;
    courseMonthMap.set(monthKey, (courseMonthMap.get(monthKey) || 0) + 1);
  }

  // Convert to array format for frontend
  const courseMonthlyBreakdown = Array.from(courseMonthlyMap.entries()).map(([course_id, monthMap]) => {
    const courseName = courseStats.get(course_id)?.course_name || course_id;
    return {
      course_id,
      course: courseName,
      monthly_data: Array.from(monthMap.entries()).map(([month_key, count]) => ({
        month_key,
        enrollment: count,
      })),
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course_wise_enrollment: courseWiseEnrollment,
        monthly_enrollment: monthlyEnrollment,
        course_monthly_breakdown: courseMonthlyBreakdown,
        available_courses: availableCourses,
        date_range: { from: { month: fromMonth, year: fromYear }, to: { month: toMonth, year: toYear } },
        total_enrollment: enrollments.length,
      },
      "Enrollment analytics data fetched successfully"
    )
  );
});

export { getEnrollmentAnalytics };