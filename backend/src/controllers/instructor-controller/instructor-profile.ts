import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const instructorProfileDetails = asyncHandler(
  async (req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id;

    if (!instructorId) {
      throw new ApiError(404, "Instructor id not found");
    }

    const profile = await prisma.instructor_details.findUnique({
      where: {
        instructor_id: instructorId,
      },
    });

    if (!profile) {
      throw new ApiError(404, "Instructor profile not found");
    }

    // Fields that should not be considered for profile completion
    const excludedFields = [
      "instructor_id",
      "user_id",
      "created_at",
      "updated_at",
    ];

    const values = Object.entries(profile)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([_, value]) => value);

    const completedFields = values.filter(
      (value) => value !== null && value !== ""
    ).length;


    //this is for all the fields in instructor 
    const profileCompletion = Math.round(
      (completedFields / values.length) * 100
    );

    //filtering as per the need of information
    const basicInformation = {
      personalInformation: {
        name: `${profile.instructor_first_name} ${profile.instructor_last_name}`,
        gender: profile.gender,
        dateOfBirth: profile.date_of_birth,
        bloodGroup: profile.instructor_blood_group,
        highestQualification: profile.highest_qualification,
      },

      guardianInformation: {
        name: profile.instructor_guardian_name,
        relationship: profile.instructor_guardian_relationship,
        mobileNo: profile.instructor_guardian_contact_no,
        occupation: profile.instructor_guardian_occupation,
        address: profile.instructor_guardian_address,
      },
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          profileCompletion,
          basicInformation,
        },
        "Instructor profile fetched successfully."
      )
    );
  }
);