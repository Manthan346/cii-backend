import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const getCandidateJourney = asyncHandler(async (req: adminAuthRequest, res: Response) => {
  const centerId = req.user.center_id;

  if (!centerId) {
    throw new ApiError(404, "Center ID not found in token");
  }

  const [
    enquiryCount,
    enrolledCount,
    trainingCount,
    completedCount,
    certifiedCount,
  ] = await Promise.all([
    // 1. Enquiry count - from enquiry_records for this center
    prisma.enquiry_records.count({ where: { center_id: centerId } }),

    // 2. Enrolled count - from batch_enrollment for batches in this center
    prisma.batch_enrollment.count({
      where: { batch_details: { center_id: centerId } },
    }),

    // 3. Training count - batches with b_status = ACTIVE, count enrolled students
    prisma.batch_enrollment.count({
      where: {
        batch_details: { center_id: centerId, b_status: "ACTIVE" },
      },
    }),

    // 4. Completed count - batches with b_status = COMPLETED, count enrolled students
    prisma.batch_enrollment.count({
      where: {
        batch_details: { center_id: centerId, b_status: "COMPLETED" },
      },
    }),

    // 5. Certified count - batch_enrollment where certificate_url is not null
    prisma.batch_enrollment.count({
      where: {
        batch_details: { center_id: centerId },
        certificate_url: { not: null },
      },
    }),
  ]);

  const candidateJourney = [
    { stage: "Enquiry", count: enquiryCount },
    { stage: "Enrolled", count: enrolledCount },
    { stage: "Training", count: trainingCount },
    { stage: "Completed", count: completedCount },
    { stage: "Certified", count: certifiedCount },
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      { candidate_journey: candidateJourney },
      "Candidate journey fetched successfully"
    )
  );
});

export { getCandidateJourney };