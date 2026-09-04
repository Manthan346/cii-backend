import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const instructorGetMyBatches = asyncHandler(
  async (req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id;

    if (!instructorId) {
      throw new ApiError(401, "Instructor not authenticated");
    }

    // Fetch all batches assigned to the instructor
    const batches = await prisma.batch_details.findMany({
      where: {
        instructor_id: instructorId,
      },
      select: {
        batch_id: true,
        batch_name: true,
        batch_code: true,
        batch_start_date: true,
        b_status: true,
        course_details: {
          select: {
            course_id: true,
            course_name: true,
            course_mode: true,
          },
        },
      
      },
      orderBy: {
        batch_start_date: "desc",
      },
    });

    const data = batches.map((batch: any) => ({
      batch_id: batch.batch_id,
      batch_name: batch.batch_name,
      batch_code: batch.batch_code,
      batch_start_date: batch.batch_start_date,
      status: batch.b_status,
  
     
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          batches: data,
        },
        "Instructor batches fetched successfully"
      )
    );
  }
);