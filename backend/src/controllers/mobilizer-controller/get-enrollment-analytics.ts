import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { withCache } from "../../lib/cache-helper";
import { MOBILIZER_REDIS_KEYS } from "../../constants/mobilizer-keys/mobilizer-keys";

const ENROLLMENT_ANALYTICS_TTL = 60; // seconds

interface EnrollmentAnalyticsFilters {
  courseId?: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
}

interface EnrollmentAnalyticsResult {
  course_wise_enrollment: Array<{ course_id: string; course: string; enrollment: number }>;
  monthly_enrollment: Array<{ month: string; month_key: string; enrollment: number }>;
  course_monthly_breakdown: Array<{ course_id: string; course: string; monthly_data: Array<{ month_key: string; enrollment: number }> }>;
  available_courses: Array<{ course_id: string; course_name: string }>;
  date_range: { from: { month: number; year: number }; to: { month: number; year: number } };
  total_enrollment: number;
}

async function computeEnrollmentAnalytics(
  centerId: string,
  filters: EnrollmentAnalyticsFilters
): Promise<EnrollmentAnalyticsResult> {
  const { courseId, fromMonth, fromYear, toMonth, toYear } = filters;

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
    // Generate months for consistent response
    const months: Array<{ key: string; label: string }> = [];
    let current = new Date(fromDate);
    while (current <= toDate) {
      const year = current.getUTCFullYear();
      const month = current.getUTCMonth();
      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      const label = current.toLocaleString('default', { month: 'short' });
      months.push({ key, label });
      current = new Date(Date.UTC(year, month + 1, 1));
    }
    return {
      course_wise_enrollment: [],
      monthly_enrollment: months.map(m => ({ month: m.label, month_key: m.key, enrollment: 0 })),
      course_monthly_breakdown: [],
      available_courses: [],
      date_range: { from: { month: fromMonth, year: fromYear }, to: { month: toMonth, year: toYear } },
      total_enrollment: 0,
    };
  }

  // Build enrollment where clause
  const enrollmentWhere: any = {
    batch_details: {
      center_id: centerId,
      course_details: { company_id: { in: centerCompanyIds } },
    },
    enrollment_date: { gte: fromDate, lte: toDate },
    enrollment_status: "ACTIVE",
  };

  if (courseId) {
    enrollmentWhere.batch_details.course_id = courseId;
  }

  // Fetch enrollments with course info
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

  // Generate months array for consistent chart rendering
  const months: Array<{ key: string; label: string }> = [];
  let current = new Date(fromDate);
  while (current <= toDate) {
    const year = current.getUTCFullYear();
    const month = current.getUTCMonth();
    const key = `${year}-${String(month + 1).padStart(2, '0')}`;
    const label = current.toLocaleString('default', { month: 'short' });
    months.push({ key, label });
    current = new Date(Date.UTC(year, month + 1, 1));
  }

  if (enrollments.length === 0) {
    return {
      course_wise_enrollment: [],
      monthly_enrollment: months.map(m => ({ month: m.label, month_key: m.key, enrollment: 0 })),
      course_monthly_breakdown: [],
      available_courses: [],
      date_range: { from: { month: fromMonth, year: fromYear }, to: { month: toMonth, year: toYear } },
      total_enrollment: 0,
    };
  }

  // --- 1. COURSE-WISE ENROLLMENT ---
  const courseStats = new Map<string, { course_name: string; enrollment: number }>();

  for (const e of enrollments) {
    const courseId = e.batch_details.course_id;
    const courseName = e.batch_details.course_details.course_name;
    const existing = courseStats.get(courseId) || { course_name: courseName, enrollment: 0 };
    existing.enrollment++;
    courseStats.set(courseId, existing);
  }

  const courseWiseEnrollment = Array.from(courseStats.entries())
    .map(([course_id, data]) => ({
      course_id,
      course: data.course_name,
      enrollment: data.enrollment,
    }))
    .sort((a, b) => b.enrollment - a.enrollment);

  const availableCourses = Array.from(courseStats.entries()).map(([course_id, data]) => ({
    course_id,
    course_name: data.course_name,
  }));

  // --- 2. MONTHLY ENROLLMENT ---
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

  const monthlyEnrollment = months.map(m => ({
    month: m.label,
    month_key: m.key,
    enrollment: monthStats.get(m.key) || 0,
  }));

  // --- 3. COURSE-MONTHLY BREAKDOWN ---
  const courseMonthlyMap = new Map<string, Map<string, number>>();

  for (const e of enrollments) {
    const date = new Date(e.enrollment_date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const courseId = e.batch_details.course_id;

    if (!courseMonthlyMap.has(courseId)) {
      const courseMonthMap = new Map<string, number>();
      for (const m of months) {
        courseMonthMap.set(m.key, 0);
      }
      courseMonthlyMap.set(courseId, courseMonthMap);
    }
    const courseMonthMap = courseMonthlyMap.get(courseId)!;
    courseMonthMap.set(monthKey, (courseMonthMap.get(monthKey) || 0) + 1);
  }

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

  return {
    course_wise_enrollment: courseWiseEnrollment,
    monthly_enrollment: monthlyEnrollment,
    course_monthly_breakdown: courseMonthlyBreakdown,
    available_courses: availableCourses,
    date_range: { from: { month: fromMonth, year: fromYear }, to: { month: toMonth, year: toYear } },
    total_enrollment: enrollments.length,
  };
}

export const getEnrollmentAnalytics = asyncHandler(async (req: MobilizerAuthRequest, res: Response) => {
  const centerId = req.mobilizer?.center_id;
  const { course_id, from_month, from_year, to_month, to_year } = req.query;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Parse date filters (optional - defaults to current year Jan-Dec)
  const fromMonth = from_month ? parseInt(from_month as string) : 1;
  const fromYear = from_year ? parseInt(from_year as string) : new Date().getFullYear();
  const toMonth = to_month ? parseInt(to_month as string) : 12;
  const toYear = to_year ? parseInt(to_year as string) : new Date().getFullYear();

  const filters: EnrollmentAnalyticsFilters = {
    courseId: course_id as string | undefined,
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  };

  const cacheKey = MOBILIZER_REDIS_KEYS.enrollment_analytics(centerId, filters);

  const analytics = await withCache(
    cacheKey,
    ENROLLMENT_ANALYTICS_TTL,
    () => computeEnrollmentAnalytics(centerId, filters)
  );

  return res.status(200).json(
    new ApiResponse(200, analytics, "Enrollment analytics data fetched successfully")
  );
});