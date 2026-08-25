import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { buildTokensForRole } from "../../utils/roles-registry/roles-registry";

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, centerId, role } = req.body;

  const user = await prisma.user_login.findUnique({
    where: { user_email: email },
    select: {
      user_password: true,
      user_id: true,
      user_role: true,
      user_email: true,
      is_active: true,
      center_details: {
        select: { center_name: true, center_id: true },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  if (!user.is_active) {
    throw new ApiError(
      403,
      "Your account has been frozen by the administrator."
    );
  }

  if (user.user_role !== role) {
    throw new ApiError(404, "invalid role");
  }

  if (user.center_details.center_id !== centerId) {
    throw new ApiError(404, "user doesn't exist at this center, please select the right center");
  }

  const passwordMatches = await bcrypt.compare(password, user.user_password);
  if (!passwordMatches) {
    throw new ApiError(401, "invalid password");
  }

  const { accessToken, refreshToken, roleDetails } = await buildTokensForRole({
    userId: user.user_id,
    role: user.user_role,
    centerId: user.center_details.center_id,
    centreName: user.center_details.center_name,
    email: user.user_email,
    is_active: user.is_active ?? true,
  });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await prisma.user_login.update({
    where: { user_id: user.user_id },
    data: { refresh_token_hash: refreshTokenHash },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
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