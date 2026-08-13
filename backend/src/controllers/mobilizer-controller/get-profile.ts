import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

const getMobilizerProfile = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    console.log("===== MOBILIZER PROFILE CONTROLLER HIT =====");// 1. Get mobilizer ID from authenticated user
    const mobilizerId = req.mobilizer?.mobilizer_id;

    if (!mobilizerId) {
      throw new ApiError(404, "Mobilizer id not found");
    }

    // 2. Fetch mobilizer profile
    const mobilizer = await prisma.mobilizer_details.findUnique({
      where: {
        mobilizer_id: mobilizerId,
      },
      select: {
        mobilizer_unique_id: true,
        mobilizer_first_name: true,
        mobilizer_last_name: true,
        mobilizer_phone_no: true,
        mobilizer_designation:true,

        user_login: {
          select: {
            user_email: true,

            center_details: {
              select: {
                center_name: true,
              },
            },
          },
        },
      },
    });

    // 3. Check if mobilizer exists
    if (!mobilizer) {
      throw new ApiError(404, "Mobilizer not found");
    }

    // 4. Prepare profile response
    const profile = {
      name: `${mobilizer.mobilizer_first_name} ${mobilizer.mobilizer_last_name}`.trim(),
      mobilizer_unique_id: mobilizer.mobilizer_unique_id,
      email: mobilizer.user_login.user_email,
      center_name: mobilizer.user_login.center_details.center_name,
      mobile_number: mobilizer.mobilizer_phone_no,
      designation: mobilizer.mobilizer_designation,
    };

    // 5. Send response
    return res.status(200).json(
      new ApiResponse(
        200,
        { profile },
        "Mobilizer profile fetched successfully"
      )
    );
  }
);

export { getMobilizerProfile };