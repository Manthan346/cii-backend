import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../../utils/candidate-jwt-auth/candidate-auth";
import { generateInstructorAccessToken, generateInstructorRefreshToken } from "../../utils/instructor-jwt-auth/instructor-auth";

type NewTokenPair = { accessToken: string; refreshToken: string };

// ---------- Per-role token builders ----------

async function buildCandidateTokens(
  userId: string,
  userRole: string,
  centerId: string,
  centreName: string,
  email: string
): Promise<NewTokenPair> {
  const candidate = await prisma.candidates_details.findUnique({
    where: { user_id: userId },
  });
  if (!candidate) {
    throw new ApiError(404, "candidate profile not found");
  }

  const accessToken = generateAccessToken({
    candidate_id: candidate.candidate_id,
    user_id: userId,
    candidate_first_name: candidate.candidate_first_name,
    candidate_last_name: candidate.candidate_last_name ?? "",
    center_id: centerId,
    centre_name: centreName,
    email,
    role: userRole,
  });

  const refreshToken = generateRefreshToken({
    candidate_id: candidate.candidate_id,
    user_id: userId,
    role: userRole,
    candidate_first_name: candidate.candidate_first_name,
    candidate_last_name: candidate.candidate_last_name ?? "",
    center_id: centerId,
  });

  return { accessToken, refreshToken };
}

async function buildInstructorTokens(
  userId: string,
  userRole: string,
  centerId: string,
  centreName: string,
  email: string
): Promise<NewTokenPair> {
  const instructor = await prisma.instructor_details.findUnique({
    where: { user_id: userId },
  });
  if (!instructor) {
    throw new ApiError(404, "instructor profile not found");
  }

  const accessToken = generateInstructorAccessToken({
    instructor_id: instructor.instructor_id,
    user_id: userId,
    instructor_first_name: instructor.instructor_first_name,
    instructor_last_name: instructor.instructor_last_name ?? "",
    center_id: centerId,
    centre_name: centreName,
    email,
    role: userRole,
  });

  const refreshToken = generateInstructorRefreshToken({
    instructor_id: instructor.instructor_id,
    user_id: userId,
    role: userRole,
    instructor_first_name: instructor.instructor_first_name,
    instructor_last_name: instructor.instructor_last_name ?? "",
    center_id: centerId,
  });

  return { accessToken, refreshToken };
}

async function buildTokensForRole(
  role: string,
  userId: string,
  centerId: string,
  centreName: string,
  email: string
): Promise<NewTokenPair> {
  switch (role) {
    case "candidate":
      return buildCandidateTokens(userId, role, centerId, centreName, email);

    case "instructor":
      return buildInstructorTokens(userId, role, centerId, centreName, email);

    case "admin":
    case "super_admin":
      throw new ApiError(501, `refresh not yet implemented for role: ${role}`);

    default:
      throw new ApiError(400, `unrecognized role: ${role}`);
  }
}

// ---------- Refresh token verification ----------

function verifyIncomingRefreshToken(token: string): { user_id: string; role: string } {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string; role: string };
  } catch {
    throw new ApiError(401, "invalid or expired refresh token");
  }
}

// ---------- Main handler ----------
// Plain Request — this endpoint runs before any access-token verification
// middleware, so req.candidate / req.instructor don't exist here yet.
// It authenticates purely off the refresh token cookie.

const refreshTokens = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "refresh token not found, please login again");
  }

  const decoded = verifyIncomingRefreshToken(incomingRefreshToken);

  const user = await prisma.user_login.findUnique({
    where: { user_id: decoded.user_id },
    select: {
      user_id: true,
      user_role: true,
      user_email: true,
      refresh_token_hash: true,
      center_details: { select: { center_id: true, center_name: true } },
    },
  });
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  if (!user.refresh_token_hash) {
    throw new ApiError(401, "session expired, please login again");
  }

  const tokenMatches = await bcrypt.compare(incomingRefreshToken, user.refresh_token_hash);
  if (!tokenMatches) {
    throw new ApiError(401, "refresh token has been invalidated, please login again");
  }

  const { accessToken, refreshToken } = await buildTokensForRole(
    user.user_role,
    user.user_id,
    user.center_details.center_id,
    user.center_details.center_name,
    user.user_email
  );

  const newRefreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await prisma.user_login.update({
    where: { user_id: user.user_id },
    data: { refresh_token_hash: newRefreshTokenHash },
  });

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
      { role: user.user_role, accessToken },
      "new access token and refresh token provided successfully"
    )
  );
});

export { refreshTokens };