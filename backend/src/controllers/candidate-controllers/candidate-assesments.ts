import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

const candidateAssessments = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

  const records = await prisma.candidate_assessment.findMany({
    where: { candidate_id: candidateId },
    select: {
      attempted_at: true,
      assessment_grade: true,
      assessments: {
        select: {
          title: true,
          assessment_type: true,
          assessment_date: true,
        },
      },
    },
  });

  const completed = records.filter((r) => r.assessment_grade !== null);
  const pending = records.filter((r) => r.assessment_grade === null);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        completedCount: completed.length,
        pendingCount: pending.length,
        completed,
        pending,
      },
      "assessments fetched successfully"
    )
  );
});

export default candidateAssessments;