import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { InstructorGuardianDetails } from "../../types/instructor-types/instructor-type";
// import { INSTRUCTOR_REDIS_KEYS } from "../../constants/instructor-keys/instructor-keys";

// const GUARDIAN_CACHE_TTL_SECONDS = 60 * 10;

const instructorGuardianDetails = asyncHandler(async (req: InstructorAuthRequest, res: Response) => {
  const instructorId = req.instructor?.instructor_id;

  if (!instructorId) {
    throw new ApiError(404, "instructor id not found");
  }

//   const cacheKey = INSTRUCTOR_REDIS_KEYS.instructor_guardian_key(instructorId);

//   // ---- 1. Try Redis first (fail-open) ----
//   let cached: string | null = null;
//   try {
//     cached = await redis.get(cacheKey);
//   } catch (err) {
//     console.error("Redis GET failed, falling back to DB:", err);
//   }

//   if (cached) {
//     const guardianDetails: InstructorGuardianDetails = JSON.parse(cached);
//     return res.status(200).json(
//       new ApiResponse(200, { guardianDetails }, "guardian details found successfully")
//     );
//   }

  // ---- 2. Cache miss — fall back to the database ----
  const record = await prisma.instructor_details.findUnique({
    where: { instructor_id: instructorId },
    select: {
      instructor_guardian_name: true,
      instructor_guardian_relationship: true,
      instructor_guardian_occupation: true,
      instructor_guardian_contact_no: true,
      instructor_guardian_address: true,
      father_blood_group: true,
      father_current_address: true,
      father_dob: true,
      father_name: true,
      father_occupation: true,
      father_phone_no: true,
      mother_blood_group: true,
      mother_current_address: true,
      mother_dob: true,
      mother_name: true,
      mother_occupation: true,
      mother_phone_no: true,
      guardian_dob: true,
      instructor_guardian_blood_group: true,
      
      
      
    },
  });

  if (!record) {
    throw new ApiError(404, "instructor not found");
  }

  // ---- 3. Reshape flat DB fields into the response type ----
  const guardianDetails: InstructorGuardianDetails = {
    fatherDetails: {
      name: record.father_name,
      blood_group: record.father_blood_group,
      occupation: record.father_occupation,
      phone_no: record.father_phone_no,
      address: record.father_current_address,
      dob: record.father_dob,
    },
    motherDetails: {
      name: record.mother_name,
      blood_group: record.mother_blood_group,
      occupation: record.mother_occupation,
      phone_no: record.mother_phone_no,
      address: record.mother_current_address,
      dob: record.mother_dob,
    },
    guardianDetails: {
      name: record.instructor_guardian_name,
      relationship: record.instructor_guardian_relationship,
      occupation: record.instructor_guardian_occupation,
      phone_no: record.instructor_guardian_contact_no,
      address: record.instructor_guardian_address,
      dob: record.guardian_dob,
      blood_group: record.instructor_guardian_blood_group,
      

    },
  };

  // ---- 4. Populate the cache for next time (fail-open) ----
//   try {
//     await redis.set(cacheKey, JSON.stringify(guardianDetails), "EX", GUARDIAN_CACHE_TTL_SECONDS);
//   } catch (err) {
//     console.error("Redis SET failed, continuing without caching:", err);
//   }

  return res.status(200).json(
    new ApiResponse(200, { guardianDetails }, "guardian details found successfully")
  );
});

export { instructorGuardianDetails };