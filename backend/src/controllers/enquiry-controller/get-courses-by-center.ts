import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const getCoursesByCenter = asyncHandler(
  async (req: Request, res: Response) => {
    const { centerId } = req.body;

    if (!centerId) {
      throw new ApiError(400, "Center ID is required");
    }

    // Validate center exists
    const center = await prisma.center_details.findUnique({
      where: { center_id: centerId },
      select: { center_id: true, center_name: true }
    });

    if (!center) {
      throw new ApiError(404, "Center not found");
    }

    // Fetch companies associated with this center
    const centerCompanies = await prisma.center_company.findMany({
      where: { center_id: centerId },
      select: { company_id: true }
    });

    const companyIds = centerCompanies.map(cc => cc.company_id);

    if (companyIds.length === 0) {
      return res.status(200).json(
        new ApiResponse(
          200,
          { center, courses: [] },
          "No companies associated with this center"
        )
      );
    }

    // Fetch courses for these companies
    const courses = await prisma.course_details.findMany({
      where: {
        company_id: { in: companyIds }
      },
      select: {
        course_id: true,
        course_name: true,
        course_desc: true,
        course_duration: true,
        course_mode: true,
        company_id: true,
        created_at: true,
        updated_at: true
      },
      orderBy: { created_at: "desc" }
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { center, courses },
        "Courses fetched successfully for the center"
      )
    );
  }
);