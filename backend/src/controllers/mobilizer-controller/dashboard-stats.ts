import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";
import { withCache } from "../../lib/cache-helper";
import { MOBILIZER_REDIS_KEYS } from "../../constants/mobilizer-keys/mobilizer-keys";

const DASHBOARD_STATS_TTL = 30; // seconds

async function computeDashboardStats(centerId: string) {
  // 1) Total leads — all enquiries for this center
  const totalLeads = await prisma.enquiry_records.count({
    where: { center_id: centerId },
  });

  // 2) Counts per enquiry_status (center-scoped)
  const [
    interested,
    notConnected,
    connected,
    followUpPending,
    counselingDone,
    documentPending,
    documentVerificationDone,
  ] = await Promise.all([
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.INTERESTED } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.NOT_CONNECTED } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.CONNECTED } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.FOLLOW_UP_PENDING } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.COUNSELING_DONE } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.DOCUMENT_VERIFICATION_PENDING } }),
    prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.DOCUMENT_VERIFICATION_DONE } }),
  ]);

  // 3) Batch Assigned / Admission
  const batchAssigned = await prisma.batch_enrollment.count({
    where: { batch_details: { center_id: centerId } },
  });

  return [
    { count: totalLeads, status: "Total Leads" },
    { count: interested, status: "Interested" },
    { count: notConnected, status: "Not Connected Leads" },
    { count: connected, status: "Connected Leads" },
    { count: followUpPending, status: "Follow Up Pending" },
    { count: counselingDone, status: "Counseling Done" },
    { count: documentPending, status: "Document Pending" },
    { count: documentVerificationDone, status: "Document Verification" },
    { count: batchAssigned, status: "Batch Assigned/Admission" },
  ];
}

export const getDashboardStats = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const centerId = req.mobilizer?.center_id;

    if (!centerId) {
      throw new ApiError(401, "Mobilizer center not found");
    }

    const stats = await withCache(
      MOBILIZER_REDIS_KEYS.dashboard_stats(centerId),
      DASHBOARD_STATS_TTL,
      () => computeDashboardStats(centerId)
    );

    return res.status(200).json(
      new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
  }
);
