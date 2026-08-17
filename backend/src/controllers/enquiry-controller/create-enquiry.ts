import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { createEnquirySchema } from "../../services/zod/enquiry-schema/enquiryValidation";

export const createEnquiry = asyncHandler(
  async (req: Request, res: Response) => {
    // Parse and validate request body
    const data = createEnquirySchema.parse(req.body);

    // Set default enquiry status to CALL_RECIEVED, center_id comes from body
    const enquiryData = {
      ...data,
      enq_status: "CALL_RECIEVED" as const, // Default status for new enquiries
    };

    // Create the enquiry record
    const enquiry = await prisma.enquiry_records.create({
      data: enquiryData,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        enquiry,
        "Enquiry created successfully"
      )
    );
  }
);