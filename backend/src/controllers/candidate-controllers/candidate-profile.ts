import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CandidateProfile } from "../../types/candidate-types/candidate-type";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

const PROFILE_CACHE_TTL_SECONDS = 60 * 10; // 10 minutes

const candidateProfileDetails = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const userId = req.user.user_id;

  if (!userId) {
    throw new ApiError(404, "user id not found");
  }

  const cacheKey = CANDIDATE_REDIS_KEYS.candidate_profile_key(userId);

  // ---- 1. Try Redis first (fail-open: Redis errors fall through to DB) ----
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (err) {
    console.error("Redis GET failed, falling back to DB:", err);
  }

  if (cached) {
    const personalInfo: CandidateProfile = JSON.parse(cached);
    return res.status(200).json(
      new ApiResponse(200, { personalInfo }, "user profile found successfully")
    );
  }

  // ---- 2. Cache miss — fall back to the database ----
  const candidateProfile = await prisma.candidates_details.findUniqueOrThrow({
    where: { user_id: userId },
    select: {
      candidate_first_name: true,
      candidate_last_name: true,
      contact_number: true,
      gender: true,
      category: true,
      user_login: { select: { user_email: true } },
      date_of_birth: true,
      blood_group: true,
      candidate_current_address: true,
      candidate_permanant_address: true,
      state_name: true,
      district: true,
      pin_code: true,
      batch_enrollment: {
        
        select: {
          batch_details: {
            select: {
              batch_code: true
            }
          }
        }
      }
    },
  });

  const personalInfo: CandidateProfile = {
    candidate_first_name: candidateProfile.candidate_first_name,
    candidate_last_name: candidateProfile.candidate_last_name,
    contact_number: candidateProfile.contact_number,
    gender: candidateProfile.gender,
    category: candidateProfile.category,
    email: candidateProfile.user_login.user_email,
    date_of_birth: candidateProfile.date_of_birth,
    blood_group: candidateProfile.blood_group,
    candidate_current_address: candidateProfile.candidate_current_address,
    candidate_permanent_address: candidateProfile.candidate_permanant_address,
    state_name: candidateProfile.state_name,
    district: candidateProfile.district,
    pin_code: candidateProfile.pin_code,
  };

  // ---- 3. Populate the cache for next time (fail-open here too) ----
  try {
    await redis.set(cacheKey, JSON.stringify(personalInfo), "EX", PROFILE_CACHE_TTL_SECONDS);
  } catch (err) {
    console.error("Redis SET failed, continuing without caching:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, { personalInfo }, "user profile found successfully")
  );
});

export { candidateProfileDetails };