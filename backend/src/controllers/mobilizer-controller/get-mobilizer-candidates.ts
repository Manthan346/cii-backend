import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

import type { pagination } from "../../interfaces/pagination-interface";

const getMobilizerCandidates = asyncHandler(async (req: MobilizerAuthRequest, res: Response) => {
  const mobilizerId = req.mobilizer?.mobilizer_id;
  const centerId = req.mobilizer?.center_id;

  if (!mobilizerId || !centerId) {
    throw new ApiError(401, "Mobilizer not authenticated or center not assigned");
  }

  const page = req.pagination?.page ?? 1;
  const limit = req.pagination?.limit ?? 20;
  const skip = (page - 1) * limit;

  // First, get all candidates in this center
  const [candidates, totalCandidates] = await Promise.all([
    // Get all candidates in the center
    prisma.candidates_details.findMany({
      where: {
        user_login: {
          center_id: centerId,
        },
      },
      select: {
        candidate_id: true,
        candidate_first_name: true,
        candidate_last_name: true,
        candidate_unique_id: true,
        contact_number: true,
      
        user_login: {
          select: {
          user_email: true,
          },
        },
      },
      orderBy: {
        candidate_first_name: "asc",
      },
      skip,
      take: limit,
    }),

    // Count total candidates for pagination
    prisma.candidates_details.count({
      where: {
        user_login: {
          center_id: centerId,
        },
      },
    }),
  ]);

  // Get all batch enrollments for this center to map course info
  const enrollments = await prisma.batch_enrollment.findMany({
    where: {
      batch_details: {
        center_id: centerId,
      },
    },
    select: {
      candidate_id: true,
      batch_details: {
        select: {
          batch_id: true,
          batch_name: true,
          batch_code: true,
          course_id: true,
          course_details: {
            select: {
              course_name: true,
            },
          },
        },
      },
      enrollment_status: true,
    },
  });

  // Build a map of candidate_id -> enrollment info
  const enrollmentMap = new Map();
  enrollments.forEach((enrollment: any) => {
    const candidateId = enrollment.candidate_id;
    const courseName = enrollment.batch_details?.course_details?.course_name;
    const batchName = enrollment.batch_details?.batch_name;

    if (enrollmentMap.has(candidateId)) {
      // If already enrolled, keep existing info (or could merge)
      const existing = enrollmentMap.get(candidateId);
      if (!existing.course_name && courseName) existing.course_name = courseName;
      if (!existing.batch_name && batchName) existing.batch_name = batchName;
    } else {
      enrollmentMap.set(candidateId, {
        course_name: courseName,
        batch_name: batchName,
        enrollment_status: enrollment.enrollment_status,
      });
    }
  });

  // Transform candidates response
  const candidatesData = candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id,
    candidate_unique_id: candidate.candidate_unique_id,
    full_name: `${candidate.candidate_first_name} ${candidate.candidate_last_name}`.trim(),
    contact_number: candidate.contact_number,
    email_id: candidate.user_login?.user_email || "", // Email from user_login
   

    // Enrollment info
    course_name: enrollmentMap.get(candidate.candidate_id)?.course_name || "Not Enrolled",
    batch_name: enrollmentMap.get(candidate.candidate_id)?.batch_name || "Not Enrolled",
    enrollment_status: enrollmentMap.get(candidate.candidate_id)?.enrollment_status || "Not Enrolled",
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        candidates: candidatesData,
        pagination: {
          page,
          limit,
          totalRecords: totalCandidates,
          totalPages: Math.ceil(totalCandidates / limit),
        },
      },
      "Mobilizer candidates fetched successfully"
    )
  );
});

export { getMobilizerCandidates };