import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

/**
 * GET /admin/batches?courseId=xxx
 * Returns all batches for a specific course with enrollment counts - center-scoped
 */
const getBatchesByCourse = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;
  const { courseId } = req.query as {
    courseId?: string;
  };

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  if (!courseId) {
    throw new ApiError(400, "courseId query parameter is required");
  }

  // Validate courseId is a valid UUID
  const validCourseId = courseId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId)
    ? courseId
    : undefined;

  if (!validCourseId) {
    throw new ApiError(400, "Invalid courseId format. Must be a valid UUID.");
  }

  // Get companies associated with this center
  const centerCompanies = await prisma.center_company.findMany({
    where: { center_id: centerId },
    select: { company_id: true },
  });
  const centerCompanyIds = centerCompanies.map(c => c.company_id);

  // Build where clause: batches must belong to the specified course and center
  const batchWhere: any = {
    course_id: validCourseId,
    center_id: centerId,
  };

  // Also filter by company if center has companies
  // if (centerCompanyIds.length > 0) {
  //   batchWhere. = { in: centerCompanyIds };
  // }

  // Get all batches (no pagination - return all)
  const batches = await prisma.batch_details.findMany({
    where: batchWhere,
    select: {
      batch_id: true,
      batch_name: true,
      batch_code: true,
     
      max_candidates: true,
      b_status: true,
      course_id: true,
      // Include enrollment count for this batch
      _count: {
        select: {
          batch_enrollment: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // Transform response - include enrollment count and capacity
  const batchesData = batches.map(batch => ({
    batch_id: batch.batch_id,
    batch_name: batch.batch_name,
    batch_code: batch.batch_code,
    max_candidates: batch.max_candidates,
    current_enrollment: batch._count.batch_enrollment,
    status: batch.b_status,
    course_id: batch.course_id,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        batches: batchesData,
        totalBatches: batchesData.length,
      },
      "Batches fetched successfully"
    )
  );
});

export { getBatchesByCourse };