import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";

export const getDashboardStats = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const centerId = req.mobilizer?.center_id;

    if (!centerId) {
      throw new ApiError(401, "Mobilizer center not found");
    }

    // 1) Total leads — all enquiries for this center
    const totalLeads = await prisma.enquiry_records.count({
      where: { center_id: centerId },
    });

    // 2) Counts per enquiry_status (center-scoped)
    //    Each status run in parallel via Promise.all.
    const [
      interested,
      notConnected,
      connected,
      followUpPending,
      counselingDone,
      documentPending,
      documentVerificationDone,
    ] = await Promise.all([
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.INTERESTED },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.NOT_CONNECTED },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.CONNECTED },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.FOLLOW_UP_PENDING },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.COUNSELING_DONE },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.DOCUMENT_VERIFICATION_PENDING },
      }),
      prisma.enquiry_records.count({
        where: { center_id: centerId, enq_status: enquiry_status.DOCUMENT_VERIFICATION_DONE },
      }),
    ]);

    // 3) Batch Assigned / Admission — count candidates enrolled in a batch
    //    whose batch belongs to the mobilizer's center.
    //    Path: batch_enrollment -> batch_details.center_id
    //    (batch_enrollment itself has no center_id column.)
    const batchAssigned = await prisma.batch_enrollment.count({
      where: {
        batch_details: { center_id: centerId },
      },
    });

    const stats = [
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

    return res.status(200).json(
      new ApiResponse(200, stats, "Dashboard stats fetched successfully")
    );
  }
);
