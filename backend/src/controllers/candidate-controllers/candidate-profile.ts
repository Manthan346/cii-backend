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
      candidate_permanent_address: true,
      candidate_current_address: true,
      permanent_city: true,
      permanent_district: true,
      permanent_pin_code: true,
      permanent_state_name: true,
      current_city: true,
      current_district: true,
      current_pin_code: true,
      current_state_name: true,
      candidate_unique_id: true,
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
    candidate_permanent_address: candidateProfile.candidate_permanent_address,
    current_city: candidateProfile.current_city,
    current_district: candidateProfile.current_district,
    current_pin_code: candidateProfile.current_pin_code,
    current_state_name: candidateProfile.current_state_name,
    permanent_city: candidateProfile.permanent_city,
    permanent_district: candidateProfile.permanent_district,
    permanent_pin_code: candidateProfile.permanent_pin_code,
    permanent_state_name: candidateProfile.permanent_state_name,
    candidate_code: candidateProfile.candidate_unique_id,
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