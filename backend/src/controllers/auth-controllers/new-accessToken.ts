import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { buildTokensForRole } from "../../utils/roles-registry/roles-registry";

function verifyIncomingRefreshToken(token: string): { user_id: string; role: string } {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string; role: string };
  } catch {
    throw new ApiError(401, "invalid or expired refresh token");
  }
}

const generateNewAccessTokenRefreshToken = asyncHandler(async (req: Request, res: Response) => {
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
      is_active: true,
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

  const { accessToken, refreshToken, roleDetails } = await buildTokensForRole({
    userId: user.user_id,
    role: user.user_role,
    centerId: user.center_details.center_id,
    centreName: user.center_details.center_name,
    email: user.user_email,
    is_active: user.is_active ?? true,
  });

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
      { role: user.user_role, roleDetails, accessToken },
      "new access token and refresh token provided successfully"
    )
  );
});

export { generateNewAccessTokenRefreshToken };