import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { generateAccessToken, generateRefreshToken } from "../../utils/candidate-jwt-auth/candidate-auth";
import { generateInstructorAccessToken, generateInstructorRefreshToken } from "../../utils/instructor-jwt-auth/instructor-auth";

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, centerId,role } = req.body;

  // 1. Fetch the base user record — role-agnostic
  //common login endpoint for all the roles
  const user = await prisma.user_login.findUnique({
    where: { user_email: email },
    select: {
      user_password: true,
      user_id: true,
      user_role: true,
      user_email: true,
      center_details: {
        select: { center_name: true, center_id: true },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if(user.user_role !== role){
    throw new ApiError(404, "invalid role")
  }

  if (user.center_details.center_id !== centerId) {
    throw new ApiError(404, "user doesn't exist at this center, please select the right center");
  }

  const passwordMatches = await bcrypt.compare(password, user.user_password);
  if (!passwordMatches) {
    throw new ApiError(401, "invalid password");
  }

  // 2. Fetch role-specific details + generate role-specific tokens
  let roleDetails: Record<string, any> = {};
  let accessToken: string;
  let refreshToken: string;



  switch (role) {
    case "candidate": {
      const candidate = await prisma.candidates_details.findUnique({
        where: { user_id: user.user_id },
        select: {
          candidate_id: true,
          candidate_first_name: true,
          candidate_last_name: true,
        },
      });
      if (!candidate) throw new ApiError(404, "candidate details not found");

      accessToken = generateAccessToken({
        candidate_id: candidate.candidate_id,
        user_id: user.user_id,
        candidate_first_name: candidate.candidate_first_name,
        candidate_last_name: candidate.candidate_last_name ?? "",
        center_id: user.center_details.center_id,
        centre_name: user.center_details.center_name ?? "",
        email: user.user_email,
        role: user.user_role
      });

      refreshToken = generateRefreshToken({
        candidate_id: candidate.candidate_id,
        user_id: user.user_id,
        role: user.user_role,
        candidate_first_name: candidate.candidate_first_name,
        candidate_last_name: candidate.candidate_last_name ?? "",
        center_id: user.center_details.center_id,
      });

      roleDetails = {
        candidateId: candidate.candidate_id,
        candidateFirstName: candidate.candidate_first_name,
        candidateLastName: candidate.candidate_last_name,
      };
      break;
    }

    case "instructor": {
      const instructor = await prisma.instructor_details.findUnique({
        where: { user_id: user.user_id },
        select: {
          instructor_id: true,
          instructor_first_name: true,
          instructor_last_name: true,
        },
      });
      if (!instructor) throw new ApiError(404, "instructor details not found");

      accessToken = generateInstructorAccessToken({
        instructor_id: instructor.instructor_id,
        user_id: user.user_id,
        instructor_first_name: instructor.instructor_first_name,
        instructor_last_name: instructor.instructor_last_name ?? "",
        center_id: user.center_details.center_id,
        centre_name: user.center_details.center_name ?? "",
        email: user.user_email,
        role
      });

      refreshToken = generateInstructorRefreshToken({
        instructor_id: instructor.instructor_id,
        user_id: user.user_id,
        role: user.user_role,
        instructor_first_name: instructor.instructor_first_name,
        instructor_last_name: instructor.instructor_last_name ?? "",
        center_id: user.center_details.center_id,
      });

      roleDetails = {
        instructorId: instructor.instructor_id,
        instructorFirstName: instructor.instructor_first_name,
        instructorLastName: instructor.instructor_last_name,
        
      };
      break;
    }

    // 🔺 admin / super_admin: no token generators yet — see note below
    // case "admin":
    // case "super_admin": {
    //   accessToken = generateAdminAccessToken({ ... });
    //   refreshToken = generateAdminRefreshToken({ ... });
    //   roleDetails = { userId: user.user_id, email: user.user_email };
    //   break;
    // }

    default:
      throw new ApiError(401, "invalid role");
  }

  // 3. Set cookies — same shape for every role
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userDetails: {
          userId: user.user_id,
          email: user.user_email,
          role: user.user_role,
          centerDetails: user.center_details,
        },
        roleDetails,
        accessToken,
      },
      "user login successfully"
    )
  );
});

export { login };