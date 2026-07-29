// utils/role-registry.ts
import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../candidate-jwt-auth/candidate-auth";
import { generateInstructorAccessToken, generateInstructorRefreshToken } from "../instructor-jwt-auth/instructor-auth";
// import { generateAdminAccessToken, generateAdminRefreshToken } from "../../";
import { ApiError } from "../../helpers/ApiError";

type TokenContext = {
  userId: string;
  role: string;
  centerId: string;
  centreName: string;
  email: string;
};

type NewTokenPair = { accessToken: string; refreshToken: string; roleDetails: Record<string, any> };

type RoleHandler = (ctx: TokenContext) => Promise<NewTokenPair>;

// ---------- Candidate: has first/last name, no capabilities ----------
const buildCandidateTokens: RoleHandler = async (ctx) => {
  const candidate = await prisma.candidates_details.findUnique({ where: { user_id: ctx.userId } });
  if (!candidate) throw new ApiError(404, "candidate profile not found");

  const shared = {
    candidate_id: candidate.candidate_id,
    candidate_first_name: candidate.candidate_first_name,
    candidate_last_name: candidate.candidate_last_name ?? "",
    user_id: ctx.userId,
    role: ctx.role,
    center_id: ctx.centerId,
  };

  return {
    accessToken: generateAccessToken({ ...shared, centre_name: ctx.centreName, email: ctx.email }),
    refreshToken: generateRefreshToken(shared),
    roleDetails: {
      candidateId: candidate.candidate_id,
      candidateFirstName: candidate.candidate_first_name,
      candidateLastName: candidate.candidate_last_name,
    },
  };
};

// ---------- Instructor: has first/last name, no capabilities ----------
const buildInstructorTokens: RoleHandler = async (ctx) => {
  const instructor = await prisma.instructor_details.findUnique({ where: { user_id: ctx.userId } });
  if (!instructor) throw new ApiError(404, "instructor profile not found");

  const shared = {
    instructor_id: instructor.instructor_id,
    instructor_first_name: instructor.instructor_first_name,
    instructor_last_name: instructor.instructor_last_name ?? "",
    user_id: ctx.userId,
    role: ctx.role,
    center_id: ctx.centerId,
    company_id: instructor.company_id
  };

  return {
    accessToken: generateInstructorAccessToken({ ...shared, centre_name: ctx.centreName, email: ctx.email }),
    refreshToken: generateInstructorRefreshToken(shared),
    roleDetails: {
      instructorId: instructor.instructor_id,
      instructorFirstName: instructor.instructor_first_name,
      instructorLastName: instructor.instructor_last_name,
    },
  };
};

// ---------- Admin: NO first/last name, HAS capabilities ----------
// const buildAdminTokens: RoleHandler = async (ctx) => {
//   const admin = await prisma.admin_details.findUnique({ where: { user_id: ctx.userId } });
//   if (!admin) throw new ApiError(404, "admin profile not found");

//   const shared = {
//     admin_id: admin.admin_id,
//     capabilities: admin.capabilities, // e.g. ["BLACKLIST_CANDIDATE", "GENERATE_REPORTS"]
//     user_id: ctx.userId,
//     role: ctx.role,
//   };

//   return {
//     accessToken: generateAdminAccessToken({ ...shared, email: ctx.email }),
//     refreshToken: generateAdminRefreshToken(shared),
//     roleDetails: {
//       adminId: admin.admin_id,
//       capabilities: admin.capabilities,
//     },
//   };
// };

// ---------- The one registry both login.ts and refresh.ts call ----------
const roleRegistry: Record<string, RoleHandler> = {
  candidate: buildCandidateTokens,
  instructor: buildInstructorTokens,
//   admin: buildAdminTokens,
  // super_admin: buildSuperAdminTokens,   <- add when built
  // mobilizer: buildMobilizerTokens,       <- add when built
};

export async function buildTokensForRole(ctx: TokenContext): Promise<NewTokenPair> {
  const handler = roleRegistry[ctx.role];
  if (!handler) {
    throw new ApiError(400, `unrecognized or unsupported role: ${ctx.role}`);
  }
  return handler(ctx);
}