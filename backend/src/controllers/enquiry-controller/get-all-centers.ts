import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

/**
 * GET endpoint for all centers - public access (no auth required)
 * Returns only center_id and center_name for dropdown selection in enquiry form
 * Usage: GET /api/v1/enquiry/centers
 */
export const getAllCenters = asyncHandler(
  async (req: Request, res: Response) => {
    // Fetch all centers with only id and name
    const centers = await prisma.center_details.findMany({
      select: {
        center_id: true,
        center_name: true,
      },
      orderBy: { center_name: "asc" } // Alphabetical for better UX in dropdowns
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { centers },
        "Centers fetched successfully"
      )
    );
  }
);