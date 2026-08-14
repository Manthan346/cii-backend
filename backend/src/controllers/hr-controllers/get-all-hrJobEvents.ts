import { Response} from "express";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { prisma } from "../../lib/prisma";

export const getAllHrJobEvents = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const { page, limit, skip } = req.pagination!;

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

    const {
      search,
      event_type,
      event_status,
      date,
      sort_order,
    } = req.query;

    // Validate event type
    if (
      event_type &&
      !["JOB_FAIR", "JOB_DRIVE"].includes(String(event_type))
    ) {
      throw new ApiError(400, "Invalid event type.");
    }

    // Validate event status
    if (
      event_status &&
      !["UPCOMING", "COMPLETED", "CANCELLED"].includes(
        String(event_status)
      )
    ) {
      throw new ApiError(400, "Invalid event status.");
    }

    // Validate sort order
    if (
      sort_order &&
      !["asc", "desc"].includes(String(sort_order))
    ) {
      throw new ApiError(
        400,
        "Sort order must be either asc or desc."
      );
    }

    // Validate date
    if (date && isNaN(Date.parse(String(date)))) {
      throw new ApiError(400, "Invalid date format.");
    }

    const where: any = {};

    // Search
    if (search) {
      where.OR = [
        {
          event_name: {
            contains: String(search),
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: String(search),
            mode: "insensitive",
          },
        },
      ];
    }

    // Event type
    if (event_type) {
      where.event_type = String(event_type);
    }

    // Event status
    if (event_status) {
      where.event_status = String(event_status);
    }

    // Exact date
    if (date) {
      const selectedDate = new Date(String(date));

      const startOfDay = new Date(selectedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      where.event_date = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const totalRecords = await prisma.job_events.count({
      where,
    });

    const jobEvents = await prisma.job_events.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        event_date:
          String(sort_order) === "desc"
            ? "desc"
            : "asc",
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      statusCode: 200,
      message: "Job events fetched successfully.",
      data: {
        jobEvents,
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