import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { InstructorProfileResponse } from "../../types/instructor-types/instructor-type";

export const instructorProfileDetails = asyncHandler(
  async (req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id;
    const email = req.instructor?.email;

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

    const excludedFields = ["instructor_id", "user_id", "created_at", "updated_at"];

    const values = Object.entries(profile)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([_, value]) => value);

    const completedFields = values.filter((value) => value !== null && value !== "").length;

    const profileCompletion = Math.round((completedFields / values.length) * 100);

    const response: InstructorProfileResponse = {
      profileCompletion,
      basicInformation: {
        personalInformation: {
          name: `${profile.instructor_first_name} ${profile.instructor_last_name ?? ""}`.trim(),
          gender: profile.gender,
          dateOfBirth: profile.date_of_birth,
          bloodGroup: profile.instructor_blood_group,
          highestQualification: profile.highest_qualification,
          profilePhoto: profile.profile_photo,
          designation: profile.instructor_designation
          
        },
        contactDetails: {
          mobileNumber: profile.contact_number,
          emergencyContact: profile.emergency_contact,
          email,
        },
        currentAddress: {
          currentState: profile.current_state,
          currentDistrict: profile.current_district,
          currentTaluka: profile.current_taluka,
          currentCity: profile.current_city,
          currentPincode: profile.current_pincode,
          currentAddress: profile.current_address,
          
        },
        permanentAddress: {
          permanenetCity: profile.permanent_city,
          permanenetState: profile.permanent_state,
          permanentTaluka: profile.permanent_taluka,
          permanentDistrict: profile.permanent_district,
          permanentPincode: profile.permanent_pincode,
          permanentAddress: profile.permanent_address
        },
      },
    };

    return res.status(200).json(
      new ApiResponse(200, {
        response,
        profileCompletion
      }, "Instructor profile fetched successfully.")
    ); 
  }
);