
import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const candidateDashboardData = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;
  if (!candidateId) {
    return new ApiError(404, "candidate not found");
  }

  // 1️ Distinct enrolled courses + 2️ attendance stats + 3️ pending assessments, in parallel
  const [enrolledCoursesResult, totalSessions, pendingAssesment] = await Promise.all([
    await prisma.batch_details.findMany({
  where: {
    batch_enrollment: {
      every: { candidate_id: candidateId }
    }
  },
  distinct: ["course_id"],
  select: { course_id: true },
}),
    prisma.attendance_records.count({
      where: {
        candidate_id: candidateId,
      },
    }),
    prisma.assessments.count({
      where: {
        candidate_assessments: {
          none: {
            candidate_id: candidateId,
          },
        },
      },
    }),
  ]);

  const enrolledCourses = enrolledCoursesResult.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        dasbhoardData: {
          enrolledCourses,
          totalSessions,
          pendingAssesment,
        },
      },
      "successful"
    )
  );
});

export default candidateDashboardData;