import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";


function getMonthRange(year: number, monthIndex: number) {
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));
  return { start, end };
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }
  return Number((((current - previous) / previous) * 100).toFixed(2));
}

type StatWithComparison = {
  current: number;
  previous: number;
  changePercent: number;
};

function buildStat(current: number, previous: number): StatWithComparison {
  return { current, previous, changePercent: percentChange(current, previous) };
}

const adminDashboardData = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;

  if (!centerId) {
    throw new ApiError(404, "center id not found");
  }

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonthIndex = now.getUTCMonth();

  const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const prevMonthYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

  const currentMonthRange = getMonthRange(currentYear, currentMonthIndex);
  const prevMonthRange = getMonthRange(prevMonthYear, prevMonthIndex);

  // "Total as of end of last month" = every account created on or before
  // the last moment of the previous month.
  const asOfEndOfLastMonth = prevMonthRange.end;

  const [
    // ---- Running totals, right now ----
    totalUsers,
    totalCandidates,
    totalStaff,

    // ---- Same running totals, but as they stood at the end of last month ----
    totalUsersLastMonth,
    totalCandidatesLastMonth,
    totalStaffLastMonth,

    // ---- Monthly enrollment flow (this month vs last month, not cumulative) ----
    currentMonthEnrollments,
    prevMonthEnrollments,
  ] = await Promise.all([
    prisma.user_login.count({ where: { center_id: centerId } }),

    prisma.user_login.count({ where: { center_id: centerId, user_role: "candidate" } }),

    prisma.user_login.count({ where: { center_id: centerId, user_role: { in: ["admin", "instructor"] } } }),

    prisma.user_login.count({
      where: { center_id: centerId, created_at: { lte: asOfEndOfLastMonth } },
    }),

    prisma.user_login.count({
      where: { center_id: centerId, user_role: "candidate", created_at: { lte: asOfEndOfLastMonth } },
    }),

    prisma.user_login.count({
      where: { center_id: centerId, user_role: { in: ["admin", "instructor"] }, created_at: { lte: asOfEndOfLastMonth } },
    }),

    prisma.batch_enrollment.count({
      where: {
        enrollment_date: { gte: currentMonthRange.start, lte: currentMonthRange.end },
        candidates_details: { user_login: { center_id: centerId } },
      },
    }),

    prisma.batch_enrollment.count({
      where: {
        enrollment_date: { gte: prevMonthRange.start, lte: prevMonthRange.end },
        candidates_details: { user_login: { center_id: centerId } },
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers: buildStat(totalUsers, totalUsersLastMonth),
        totalCandidates: buildStat(totalCandidates, totalCandidatesLastMonth),
        totalStaff: buildStat(totalStaff, totalStaffLastMonth),
        monthlyEnrollment: buildStat(currentMonthEnrollments, prevMonthEnrollments),
      },
      "Admin dashboard data fetched successfully"
    )
  );
});

export { adminDashboardData };