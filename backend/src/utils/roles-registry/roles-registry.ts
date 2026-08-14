// utils/role-registry.ts
//whenever creating a new role add the role details here first




import { prisma } from "../../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../candidate-jwt-auth/candidate-auth";
import { generateInstructorAccessToken, generateInstructorRefreshToken } from "../instructor-jwt-auth/instructor-auth";
// import { generateAdminAccessToken, generateAdminRefreshToken } from "../../";
import {generateMobilizerAccessToken,generateMobilizerRefreshToken,} from "../mobilizer-jwt-auth/mobilizer-auth";
import { ApiError } from "../../helpers/ApiError";
import { generateAdminAccessToken, generateAdminRefreshToken } from "../admin-jwt-auth/admin-auth";
import {generateHrAccessToken,generateHrRefreshToken,
} from "../hr-jwt-auth/hr-auth";

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

const buildMobilizerTokens: RoleHandler = async (ctx) => {
    const mobilizer = await prisma.mobilizer_details.findUnique({
        where: {
            user_id: ctx.userId,
        },
    });

    if (!mobilizer) {
        throw new ApiError(404, "mobilizer profile not found");
    }

    const shared = {
        mobilizer_id: mobilizer.mobilizer_id,
        mobilizer_first_name: mobilizer.mobilizer_first_name,
        mobilizer_last_name: mobilizer.mobilizer_last_name ?? "",

        user_id: ctx.userId,
        role: ctx.role,

        center_id: ctx.centerId,
    };

    return {
        accessToken: generateMobilizerAccessToken({
            ...shared,
            centre_name: ctx.centreName,
            email: ctx.email,
        }),

        refreshToken: generateMobilizerRefreshToken(shared),

        roleDetails: {
            mobilizerId: mobilizer.mobilizer_id,
            mobilizerFirstName: mobilizer.mobilizer_first_name,
            mobilizerLastName: mobilizer.mobilizer_last_name,
        },
    };
};

const buildHrTokens: RoleHandler = async (ctx) => {
    const hr = await prisma.hr_details.findUnique({
        where: {
            user_id: ctx.userId,
        },
    });

    if (!hr) {
        throw new ApiError(404, "HR profile not found");
    }

    const shared = {
        hr_id: hr.hr_id,
        hr_first_name: hr.hr_first_name,
        hr_last_name: hr.hr_last_name ?? "",

        user_id: ctx.userId,
        role: ctx.role,
        company_id: hr.company_id,
    };

    return {
        accessToken: generateHrAccessToken({
            ...shared,
            email: ctx.email,
        }),

        refreshToken: generateHrRefreshToken(shared),

        roleDetails: {
            hrId: hr.hr_id,
            hrFirstName: hr.hr_first_name,
            hrLastName: hr.hr_last_name,
            companyId: hr.company_id,
        },
    };
};

// ---------- Admin: NO first/last name, HAS capabilities ----------
const buildAdminTokens: RoleHandler = async (ctx) => {
  const admin = await prisma.user_login.findUnique({ where: { user_id: ctx.userId } });
  if (!admin) throw new ApiError(404, "admin profile not found");

  const shared = {
    
    // capabilities: admin.capabilities, // e.g. ["BLACKLIST_CANDIDATE", "GENERATE_REPORTS"]
    user_id: ctx.userId,
    role: ctx.role,
    centerName: ctx.centreName,
    email: ctx.email
    
  };

  return {
    accessToken: generateAdminAccessToken({ ...shared, email: ctx.email }),
    refreshToken: generateAdminRefreshToken(shared),
    roleDetails: {
      // adminId: admin.user_id,
      // capabilities: admin.capabilities,
    },
  };
};

// ---------- The one registry both login.ts and refresh.ts call ----------
const roleRegistry: Record<string, RoleHandler> = {
  candidate: buildCandidateTokens,
  instructor: buildInstructorTokens,
  admin: buildAdminTokens,
  mobilizer: buildMobilizerTokens,
  hr: buildHrTokens
//   admin: buildAdminTokens,
  // super_admin: buildSuperAdminTokens,   <- add when built
       
};

export async function buildTokensForRole(ctx: TokenContext): Promise<NewTokenPair> {
  const handler = roleRegistry[ctx.role];
  if (!handler) {
    throw new ApiError(400, `unrecognized or unsupported role: ${ctx.role}`);
  }
  return handler(ctx);
}