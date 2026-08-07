// controllers/candidate-controller/get-candidate-guardian-details.ts
import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CandidateGuardianDetails } from "../../types/candidate-types/candidate-type";
import { CANDIDATE_REDIS_KEYS } from "../../constants/candidate-keys/candidate-keys";

const GUARDIAN_CACHE_TTL_SECONDS = 60 * 10; // 10 minutes, matching the profile cache

const candidateGuardianDetails = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
  const candidateId = req.candidate?.candidate_id;

  if (!candidateId) {
    throw new ApiError(404, "candidate id not found");
  }

  const cacheKey = CANDIDATE_REDIS_KEYS.candidate_guardian_key(candidateId);

  // ---- 1. Try Redis first (fail-open on Redis errors) ----
  let cached: string | null = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (err) {
    console.error("Redis GET failed, falling back to DB:", err);
  }

  if (cached) {
    const guardianDetails: CandidateGuardianDetails = JSON.parse(cached);
    return res.status(200).json(
      new ApiResponse(200, { guardianDetails }, "guardians details found successfully")
    );
  }

  // ---- 2. Cache miss — fall back to the database ----
  const record = await prisma.candidates_details.findUnique({
    where: { candidate_id: candidateId },
    select: {
      guardian_name: true,
      guardian_relationship: true,
      guardian_blood_group: true,
      guardian_occupation: true,
      guardian_phone_no: true,
      guardian_address: true,
      guardian_gender: true,
      guardian_dob: true,
      father_name: true,
      father_blood_group: true,
      father_occupation: true,
      father_phone_no: true,
      father_address: true,
      mother_name: true,
      mother_blood_group: true,
      mother_occupation: true,
      mother_phone_no: true,
      mother_address: true,
    },
  });

  if (!record) {
    throw new ApiError(404, "candidate not found");
  }

  // ---- 3. Reshape the flat DB record into the guardian1/2/3 structure ----
  const guardianDetails: CandidateGuardianDetails = {
    fatherDetails: {
      name: record.father_name,
      blood_group: record.father_blood_group,
      occupation: record.father_occupation,
      phone_no: record.father_phone_no,
      address: record.father_address,
      
    },
    motherDetails: {
      name: record.mother_name,
      blood_group: record.mother_blood_group,
      occupation: record.mother_occupation,
      phone_no: record.mother_phone_no,
      address: record.mother_address,
    },
    guardianDetails: {
      name: record.guardian_name,
      blood_group: record.guardian_blood_group,
      occupation: record.guardian_occupation,
      phone_no: record.guardian_phone_no,
      address: record.guardian_address,
      relationship: record.guardian_relationship,
      gender: record.guardian_gender,
      dob: record.guardian_dob,
    },
  };

  // ---- 4. Populate the cache for next time (fail-open) ----
  try {
    await redis.set(cacheKey, JSON.stringify(guardianDetails), "EX", GUARDIAN_CACHE_TTL_SECONDS);
  } catch (err) {
    console.error("Redis SET failed, continuing without caching:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, { guardianDetails }, "guardians details found successfully")
  );
});

export { candidateGuardianDetails };