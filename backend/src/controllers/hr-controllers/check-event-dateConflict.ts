import { asyncHandler } from "../../helpers/asyncHandler";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { Response } from "express";
import { prisma } from "../../lib/prisma";

export const checkJobEventDate = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const { date } = req.query;

    // Validate date is provided
    if (!date) {
      throw new ApiError(
        400,
        "Date is required."
      );
    }

    // Validate date format
    if (isNaN(Date.parse(String(date)))) {
      throw new ApiError(
        400,
        "Invalid date format."
      );
    }

    const selectedDate = new Date(String(date));

    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const eventCount = await prisma.job_events.count({
      where: {
        event_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Job events checked successfully.",
      data: {
        eventCount,
        hasExistingEvents: eventCount > 0,
      },
    });
  }
);