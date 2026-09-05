import { Response } from "express";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";

export const getJobFairCandidates = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const { job_event_id } = req.params;

    const { page, limit, skip } = req.pagination!;

    // Validate job event ID
    if (!job_event_id) {
      throw new ApiError(400, "Job event ID is required.");
    }

    // Pagination validation
    if (!Number.isInteger(page) || page < 1) {
      throw new ApiError(
        400,
        "Page must be greater than or equal to 1."
      );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new ApiError(
        400,
        "Limit must be between 1 and 50."
      );
    }

    const where = {
      job_event_id: String(job_event_id),
    };

    // Get total number of candidates
    const totalRecords = await prisma.job_fair_candidates.count({
      where,
    });

    // No candidate data uploaded
    if (totalRecords === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Data is not uploaded.",
        data: {
          candidates: [],
          pagination: {
            page,
            limit,
            totalRecords: 0,
            totalPages: 0,
          },
        },
      });
    }

    // Fetch candidates
    const candidates = await prisma.job_fair_candidates.findMany({
      where,
      skip,
      take: limit,
      select: {
        candidate_name: true,
        contact_no: true,
        location: true,
        qualification: true,
        college_institute: true,
        age: true,
        gender: true,
        candidate_experience: true,
        area: true,
        ward_no: true,
        vidhansabha: true,
        candidate_application_status: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      statusCode: 200,
      message: "Job drive candidates fetched successfully.",
      data: {
        candidates,
        pagination: {
          page,
          limit,
          totalRecords,
          totalPages,
        },
      },
    });
  }
);