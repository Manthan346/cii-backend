import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { prisma } from "../../lib/prisma";

export const editHrProfile = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const hr_id = req.hr?.hr_id;

    if (!hr_id) {
      throw new ApiError(401, "HR authentication required.");
    }

    const {
      hr_first_name,
      hr_last_name,
      hr_phone_no,
    } = req.body;

    // Validate that at least one editable field is provided
    if (
      hr_first_name === undefined &&
      hr_last_name === undefined &&
      hr_phone_no === undefined
    ) {
      throw new ApiError(
        400,
        "At least one profile field is required to update."
      );
    }

    // Validate first name
    if (
      hr_first_name !== undefined &&
      (typeof hr_first_name !== "string" ||
        hr_first_name.trim().length === 0)
    ) {
      throw new ApiError(400, "First name cannot be empty.");
    }

    // Validate last name
    if (
      hr_last_name !== undefined &&
      hr_last_name !== null &&
      typeof hr_last_name !== "string"
    ) {
      throw new ApiError(400, "Last name must be a string.");
    }

    // Validate phone number
    if (
      hr_phone_no !== undefined &&
      !/^\d{10}$/.test(hr_phone_no)
    ) {
      throw new ApiError(
        400,
        "Phone number must be exactly 10 digits."
      );
    }

    // Check HR exists
    const existingHr = await prisma.hr_details.findUnique({
      where: {
        hr_id,
      },
      select: {
        hr_id: true,
      },
    });

    if (!existingHr) {
      throw new ApiError(404, "HR profile not found.");
    }

    // Check whether phone number is already used by another HR
    if (hr_phone_no !== undefined) {
      const existingPhone = await prisma.hr_details.findFirst({
        where: {
          hr_phone_no,
          NOT: {
            hr_id,
          },
        },
        select: {
          hr_id: true,
        },
      });

      if (existingPhone) {
        throw new ApiError(
          409,
          "This phone number is already registered with another HR."
        );
      }
    }

    // Build update object with only editable fields
    const updateData: {
      hr_first_name?: string;
      hr_last_name?: string | null;
      hr_phone_no?: string;
    } = {};

    if (hr_first_name !== undefined) {
      updateData.hr_first_name = hr_first_name.trim();
    }

    if (hr_last_name !== undefined) {
      updateData.hr_last_name =
        hr_last_name === null
          ? null
          : hr_last_name.trim();
    }

    if (hr_phone_no !== undefined) {
      updateData.hr_phone_no = hr_phone_no;
    }

    const updatedHr = await prisma.hr_details.update({
      where: {
        hr_id,
      },
      data: updateData,
      select: {
        hr_first_name: true,
        hr_last_name: true,
        hr_phone_no: true,
        hr_designation: true,
      },
    });

    const name = updatedHr.hr_last_name
      ? `${updatedHr.hr_first_name} ${updatedHr.hr_last_name}`
      : updatedHr.hr_first_name;

    return res.status(200).json({
      statusCode: 200,
      message: "HR profile updated successfully.",
      data: {
        name,
        designation: updatedHr.hr_designation,
        phone_no: updatedHr.hr_phone_no,
      },
    });
  }
);