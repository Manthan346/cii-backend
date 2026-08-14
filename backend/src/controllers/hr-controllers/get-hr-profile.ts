import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { HrAuthRequest } from "../../interfaces/hr-auth-interface";
import { prisma } from "../../lib/prisma";

export const getHrProfile = asyncHandler(
  async (req: HrAuthRequest, res: Response) => {
    const hr_id = req.hr?.hr_id;

    if (!hr_id) {
      throw new ApiError(401, "HR authentication required.");
    }

    

    const hrProfile = await prisma.hr_details.findUnique({
      where: {
        hr_id,
      },
      select: {
        hr_first_name: true,
        hr_last_name: true,
        hr_designation: true,
        hr_phone_no: true,
        user_login: {
          select: {
            user_email: true,
            center_details:{
                select:{
                    center_name:true
                }
            }
          },
        },
        company_details:{
            select:{
                company_name:true
            }
        },
      },
    });

    if (!hrProfile) {
      throw new ApiError(404, "HR profile not found.");
    }

    const name = hrProfile.hr_last_name
      ? `${hrProfile.hr_first_name} ${hrProfile.hr_last_name}`
      : hrProfile.hr_first_name;

    return res.status(200).json({
      statusCode: 200,
      message: "HR profile fetched successfully.",
      data: {
        name,
        designation: hrProfile.hr_designation,
        organization_email: hrProfile.user_login.user_email,
        phone_no: hrProfile.hr_phone_no,
        organization_name: hrProfile.company_details.company_name
      },
    });
  }
);