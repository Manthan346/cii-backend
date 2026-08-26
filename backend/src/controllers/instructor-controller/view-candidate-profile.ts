import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { INSTRUCTOR_REDIS_KEYS } from "../../constants/instructor-keys/instructor-keys";

const VIEW_CANDIDATE_PROFILE_CACHE_TTL_SECONDS = 60 * 10; // 10 minutes

export const viewCandidateProfile = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {

        const { company_id } = req.instructor!;

        if (!company_id) {
            throw new ApiError(
                403,
                "Company not found."
            );
        }

        const enrollment_id =req.query.enrollment_id?.toString().trim();
        if(!enrollment_id){
            throw new ApiError(
                400,
                "Enrollment id is required."
            );
        }

        const cacheKey = INSTRUCTOR_REDIS_KEYS.view_candidate_profile_key(enrollment_id);

        // ---- 1. Try Redis first (fail-open) ----
        let cached: string | null = null;
        try {
            cached = await redis.get(cacheKey);
        } catch (err) {
            console.error("Redis GET failed in viewCandidateProfile, falling back to DB:", err);
        }
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const enrollment =await prisma.batch_enrollment.findUnique({
            where:{
                enrollment_id
            },
            include:{
                candidates_details:{
                    select:{
                        candidate_id: true,
                        candidate_first_name:true,
                        candidate_last_name:true,
                        contact_number:true,
                        blood_group:true,
                        gender:true,
                        guardian_name:true,
                        guardian_phone_no:true,
                        highest_qualification:true,
                        date_of_birth:true,
                        category:true,
                        candidate_current_address:true,
                        current_pin_code:true,
                        user_login:{
                            select:{
                                user_email:true
                            }
                        }
                    }
                },
                batch_details: {
                    include: {
                        course_details: true
                    }
                }
            }

        });


        if(!enrollment){
            throw new ApiError(
                404,
                "Enrollment Not Found."
            )
        }

        if (
            enrollment.batch_details.course_details.company_id !==
            company_id
        ) {
            throw new ApiError(
                403,
                "You don't have permission to view this candidate's profile."
            );
        }

        if(
            enrollment.batch_details?.b_status !==
            "ACTIVE"
        ){
            throw new ApiError(
                400,
                "This batch is not active."
            );

        }

        // ---- Attendance percentage for this enrollment's course ----
        const candidateId = enrollment.candidates_details.candidate_id;
        const batchId = enrollment.batch_id;

        const [totalSessions, attendedRecords] = await Promise.all([
            prisma.attendance_sessions.count({ where: { batch_id: batchId } }),
            prisma.attendance_records.count({
                where: {
                    candidate_id: candidateId,
                    attendance_status: { in: ["present", "late"] },
                    attendance_sessions: { batch_id: batchId },
                },
            }),
        ]);

        const attendancePercentage =
            totalSessions === 0
                ? 0
                : Number(((attendedRecords / totalSessions) * 100).toFixed(2));

        const responseBody = new ApiResponse(
            200,
            {
                candidate_name:`${enrollment.candidates_details.candidate_first_name} ${enrollment.candidates_details.candidate_last_name ?? ""}`.trim(),
                phone_no:enrollment.candidates_details.contact_number,
                blood_group:enrollment.candidates_details.blood_group,
                gender: enrollment.candidates_details.gender,
                guardian_name: enrollment.candidates_details.guardian_name,
                guardian_phone_no: enrollment.candidates_details.guardian_phone_no,
                highest_qualification: enrollment.candidates_details.highest_qualification,
                date_of_birth:enrollment.candidates_details.date_of_birth,
                email_id:enrollment.candidates_details.user_login.user_email,
                category : enrollment.candidates_details.category,
                address: enrollment.candidates_details.candidate_current_address,
                pin_code: enrollment.candidates_details.current_pin_code,
                candidate_batch_id:enrollment.candidate_batch_id,
                attendancePercentage
            },
            "Candidate details fetched successfully."
        );

        // ---- 2. Populate the cache (fail-open) ----
        try {
            await redis.set(cacheKey, JSON.stringify(responseBody), "EX", VIEW_CANDIDATE_PROFILE_CACHE_TTL_SECONDS);
        } catch (err) {
            console.error("Redis SET failed in viewCandidateProfile, continuing without caching:", err);
        }

        return res.status(200).json(responseBody);

    }
)
