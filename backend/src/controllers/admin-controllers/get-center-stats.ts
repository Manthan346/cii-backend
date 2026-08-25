import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getCenterStats = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  // Calculate start of current month (UTC)
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  const [
    totalUsers,
    totalInstructors,
    totalCandidates,
    newUsersThisMonth,
  ] = await Promise.all([
    // 1. Total users in this center (all roles)
    prisma.user_login.count({ where: { center_id: centerId } }),

    // 2. Total instructors in this center
    prisma.user_login.count({ where: { center_id: centerId, user_role: "instructor" } }),

    // 3. Total candidates in this center
    prisma.user_login.count({ where: { center_id: centerId, user_role: "candidate" } }),

    // 4. New users created this month in this center (all roles)
    prisma.user_login.count({
      where: {
        center_id: centerId,
        created_at: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalInstructors,
        totalCandidates,
        newUsersThisMonth,
      },
      "Center stats fetched successfully"
    )
  );
});

export { getCenterStats };