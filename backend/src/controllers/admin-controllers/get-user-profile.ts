import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import {
    role_types,
    batch_enrollment_status_type,
    attend_types,
} from "../../generated/prisma/enums";
import { z } from "zod";

export const getUserProfile = asyncHandler(
    async (req: Request, res: Response) => {

        const adminReq = req as adminAuthRequest;
        const adminUserId = adminReq.user.user_id;

        /*
         * Validate target user ID
         */
        const userIdSchema = z.string().uuid("Invalid user ID");

        const validation = userIdSchema.safeParse(
            req.params.userId
        );

        if (!validation.success) {
            throw new ApiError(
                400,
                "Invalid user ID."
            );
        }

        const targetUserId = validation.data;

        /*
         * Get logged-in admin
         */
        const admin = await prisma.user_login.findUnique({
            where: {
                user_id: adminUserId,
            },
            select: {
                user_id: true,
                user_role: true,
                center_id: true,
            },
        });

        if (!admin) {
            throw new ApiError(
                404,
                "Admin user not found."
            );
        }

        if (admin.user_role !== role_types.admin) {
            throw new ApiError(
                403,
                "Unauthorized to view user profile."
            );
        }

        /*
         * Get target user
         */
        const targetUser = await prisma.user_login.findUnique({
            where: {
                user_id: targetUserId,
            },
            select: {
                user_id: true,
                user_email: true,
                user_role: true,
                center_id: true,
                is_active: true,
            },
        });

        if (!targetUser) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        /*
         * Admin can only view users from the same center
         */
        if (targetUser.center_id !== admin.center_id) {
            throw new ApiError(
                403,
                "You are not authorized to view this user."
            );
        }

        const userDetails = {
            user_id: targetUser.user_id,
            email: targetUser.user_email,
            role: targetUser.user_role,
            is_active: targetUser.is_active,
        };

        /*
         * ============================================================
         * CANDIDATE
         * ============================================================
         */
        if (targetUser.user_role === role_types.candidate) {

            const candidate =
                await prisma.candidates_details.findUnique({
                    where: {
                        user_id: targetUserId,
                    },
                    select: {
                        candidate_id: true,
                        candidate_unique_id: true,

                        candidate_first_name: true,
                        candidate_last_name: true,

                        contact_number: true,
                        gender: true,
                        date_of_birth: true,

                        education: true,
                        highest_qualification: true,
                        qualification_percentage: true,

                        category: true,
                        blood_group: true,

                        candidate_current_address: true,

                        current_city: true,
                        current_district: true,
                        current_pin_code: true,
                        current_state_name: true,

                        permanent_city: true,
                        permanent_pin_code: true,
                        permanent_state_name: true,
                        permanent_district: true,
                        candidate_permanent_address: true,

                        enquiry_source: true,

                        guardian_name: true,
                        guardian_phone_no: true,
                        guardian_relationship: true,
                        guardian_occupation: true,
                        guardian_gender: true,
                        guardian_blood_group: true,
                        guardian_dob: true,
                        guardian_address: true,

                        father_name: true,
                        father_occupation: true,
                        father_phone_no: true,
                        father_blood_group: true,
                        father_address: true,

                        mother_name: true,
                        mother_occupation: true,
                        mother_phone_no: true,
                        mother_blood_group: true,
                        mother_address: true,

                        candidate_emergency_contact_no: true,

                        profile_photo: true,

                        training_start_date: true,
                        training_end_date: true,

                        candidate_status: true,
                        verification_status: true,

                        created_at: true,
                        updated_at: true,

                        batch_enrollment: {
                            select: {
                                enrollment_id: true,
                                enrollment_date: true,
                                enrollment_status: true,
                                grade: true,
                                certificate_url: true,
                                candidate_batch_id: true,

                                batch_details: {
                                    select: {
                                        batch_id: true,
                                        batch_name: true,
                                        batch_code: true,
                                        batch_start_date: true,
                                        batch_end_date: true,
                                        batch_type: true,
                                        b_status: true,
                                        instructor_id: true,

                                        course_details: {
                                            select: {
                                                course_id: true,
                                                course_name: true,
                                                course_duration: true,
                                                course_mode: true,

                                                company_details: {
                                                    select: {
                                                        company_id: true,
                                                        company_name: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },

                            orderBy: {
                                enrollment_date: "desc",
                            },
                        },
                    },
                });

            if (!candidate) {
                throw new ApiError(
                    404,
                    "Candidate details not found."
                );
            }

            /*
             * Fetch only attendance information required
             * for calculating attendance percentage per batch.
             */
            const attendanceRecords =
                await prisma.attendance_records.findMany({
                    where: {
                        candidate_id: candidate.candidate_id,
                    },
                    select: {
                        attendance_status: true,

                        attendance_sessions: {
                            select: {
                                batch_id: true,
                            },
                        },
                    },
                });

            /*
             * Course summary
             */
            const totalEnrolledCourses =
                candidate.batch_enrollment.length;

            const today = new Date();

            const coursesInProgress =
                candidate.batch_enrollment.filter(
                    (enrollment) => {

                        return (
                            enrollment.enrollment_status ===
                                batch_enrollment_status_type.ACTIVE &&
                            enrollment.batch_details.batch_end_date >= today
                        );
                    }
                ).length;

            const completedCourses =
                candidate.batch_enrollment.filter(
                    (enrollment) => {

                        const validCompletedEnrollment =
                            enrollment.enrollment_status ===
                                batch_enrollment_status_type.ACTIVE ||
                            enrollment.enrollment_status ===
                                batch_enrollment_status_type.INACTIVE;

                        return (
                            validCompletedEnrollment &&
                            enrollment.batch_details.batch_end_date < today
                        );
                    }
                ).length;

            /*
             * ========================================================
             * Attendance grouped by batch
             *
             * present  = 1
             * late     = 1
             * half_day = 0.5
             * absent   = 0
             * ========================================================
             */
            const attendanceByBatch = new Map<
                string,
                {
                    total: number;
                    score: number;
                }
            >();

            for (const record of attendanceRecords) {

                const batchId =
                    record.attendance_sessions.batch_id;

                const existing =
                    attendanceByBatch.get(batchId) ?? {
                        total: 0,
                        score: 0,
                    };

                existing.total += 1;

                if (
                    record.attendance_status ===
                    attend_types.present
                ) {
                    existing.score += 1;
                } else if (
                    record.attendance_status ===
                    attend_types.late
                ) {
                    existing.score += 1;
                } else if (
                    record.attendance_status ===
                    attend_types.half_day
                ) {
                    existing.score += 0.5;
                }

                attendanceByBatch.set(
                    batchId,
                    existing
                );
            }

            /*
             * ========================================================
             * Fetch instructors for the candidate's batches
             * ========================================================
             */
            const instructorIds = [
                ...new Set(
                    candidate.batch_enrollment.map(
                        (enrollment) =>
                            enrollment.batch_details.instructor_id
                    )
                ),
            ];

            const instructors =
                await prisma.instructor_details.findMany({
                    where: {
                        instructor_id: {
                            in: instructorIds,
                        },
                    },
                    select: {
                        instructor_id: true,
                        instructor_first_name: true,
                        instructor_last_name: true,
                    },
                });

            const instructorMap = new Map(
                instructors.map((instructor) => [
                    instructor.instructor_id,
                    instructor,
                ])
            );

            /*
             * ========================================================
             * Format courses
             * ========================================================
             */
            const courses =
                candidate.batch_enrollment.map(
                    (enrollment) => {

                        const batch =
                            enrollment.batch_details;

                        const course =
                            batch.course_details;

                        const instructor =
                            instructorMap.get(
                                batch.instructor_id
                            );

                        const attendance =
                            attendanceByBatch.get(
                                batch.batch_id
                            );

                        const attendancePercentage =
                            !attendance ||
                            attendance.total === 0
                                ? 0
                                : Number(
                                    (
                                        (
                                            attendance.score /
                                            attendance.total
                                        ) * 100
                                    ).toFixed(2)
                                );

                        return {
                            enrollment_id:
                                enrollment.enrollment_id,

                            enrollment_date:
                                enrollment.enrollment_date,

                            enrollment_status:
                                enrollment.enrollment_status,

                            grade:
                                enrollment.grade,

                            certificate_url:
                                enrollment.certificate_url,

                            candidate_batch_id:
                                enrollment.candidate_batch_id,

                            attendance_percentage:
                                attendancePercentage,

                            batch: {
                                batch_id:
                                    batch.batch_id,

                                batch_name:
                                    batch.batch_name,

                                batch_code:
                                    batch.batch_code,

                                start_date:
                                    batch.batch_start_date,

                                end_date:
                                    batch.batch_end_date,

                                type:
                                    batch.batch_type,

                                status:
                                    batch.b_status,
                            },

                            course: {
                                course_id:
                                    course.course_id,

                                course_name:
                                    course.course_name,

                                duration:
                                    course.course_duration,

                                mode:
                                    course.course_mode,
                            },

                            company:
                                course.company_details,

                            instructor: instructor
                                ? {
                                    instructor_id:
                                        instructor.instructor_id,

                                    first_name:
                                        instructor.instructor_first_name,

                                    last_name:
                                        instructor.instructor_last_name,

                                    full_name:
                                        [
                                            instructor.instructor_first_name,
                                            instructor.instructor_last_name,
                                        ]
                                            .filter(Boolean)
                                            .join(" "),
                                }
                                : null,
                        };
                    }
                );

            /*
             * Candidate response
             */
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        userDetails,

                        profile: {
                            candidate_id:
                                candidate.candidate_id,

                            candidate_unique_id:
                                candidate.candidate_unique_id,

                            first_name:
                                candidate.candidate_first_name,

                            last_name:
                                candidate.candidate_last_name,

                            full_name:
                                [
                                    candidate.candidate_first_name,
                                    candidate.candidate_last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" "),

                            contact_number:
                                candidate.contact_number,

                            gender:
                                candidate.gender,

                            date_of_birth:
                                candidate.date_of_birth,

                            education:
                                candidate.education,

                            highest_qualification:
                                candidate.highest_qualification,

                            qualification_percentage:
                                candidate.qualification_percentage,

                            category:
                                candidate.category,

                            blood_group:
                                candidate.blood_group,

                            current_address:
                                candidate.candidate_current_address,

                            current_location: {
                                city:
                                    candidate.current_city,

                                district:
                                    candidate.current_district,

                                state:
                                    candidate.current_state_name,

                                pin_code:
                                    candidate.current_pin_code,
                            },

                            permanent_address:
                                candidate.candidate_permanent_address,

                            permanent_location: {
                                city:
                                    candidate.permanent_city,

                                district:
                                    candidate.permanent_district,

                                state:
                                    candidate.permanent_state_name,

                                pin_code:
                                    candidate.permanent_pin_code,
                            },

                            enquiry_source:
                                candidate.enquiry_source,

                            guardian: {
                                name:
                                    candidate.guardian_name,

                                phone:
                                    candidate.guardian_phone_no,

                                relationship:
                                    candidate.guardian_relationship,

                                occupation:
                                    candidate.guardian_occupation,

                                gender:
                                    candidate.guardian_gender,

                                blood_group:
                                    candidate.guardian_blood_group,

                                date_of_birth:
                                    candidate.guardian_dob,

                                address:
                                    candidate.guardian_address,
                            },

                            father: {
                                name:
                                    candidate.father_name,

                                occupation:
                                    candidate.father_occupation,

                                phone:
                                    candidate.father_phone_no,

                                blood_group:
                                    candidate.father_blood_group,

                                address:
                                    candidate.father_address,
                            },

                            mother: {
                                name:
                                    candidate.mother_name,

                                occupation:
                                    candidate.mother_occupation,

                                phone:
                                    candidate.mother_phone_no,

                                blood_group:
                                    candidate.mother_blood_group,

                                address:
                                    candidate.mother_address,
                            },

                            emergency_contact:
                                candidate.candidate_emergency_contact_no,

                            profile_photo:
                                candidate.profile_photo,

                            training: {
                                start_date:
                                    candidate.training_start_date,

                                end_date:
                                    candidate.training_end_date,

                                status:
                                    candidate.candidate_status,

                                verification_status:
                                    candidate.verification_status,
                            },

                            course_summary: {
                                total_enrolled_courses:
                                    totalEnrolledCourses,

                                courses_in_progress:
                                    coursesInProgress,

                                completed_courses:
                                    completedCourses,
                            },

                            courses,
                        },
                    },
                    "Candidate profile fetched successfully."
                )
            );
        }

        /*
         * ============================================================
         * INSTRUCTOR
         * ============================================================
         */
        if (targetUser.user_role === role_types.instructor) {

            const instructor =
                await prisma.instructor_details.findUnique({
                    where: {
                        user_id: targetUserId,
                    },
                    select: {
                        instructor_id: true,

                        instructor_first_name: true,
                        instructor_last_name: true,

                        contact_number: true,
                        gender: true,
                        date_of_birth: true,

                        specialization: true,
                        experience_years: true,

                        instructor_blood_group: true,

                        current_address: true,
                        current_city: true,
                        current_state: true,
                        current_district: true,
                        current_taluka: true,
                        current_pincode: true,
                    },
                });

            if (!instructor) {
                throw new ApiError(
                    404,
                    "Instructor details not found."
                );
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        userDetails,

                        profile: {
                            instructor_id:
                                instructor.instructor_id,

                            first_name:
                                instructor.instructor_first_name,

                            last_name:
                                instructor.instructor_last_name,

                            full_name:
                                [
                                    instructor.instructor_first_name,
                                    instructor.instructor_last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" "),

                            email:
                                targetUser.user_email,

                            contact_number:
                                instructor.contact_number,

                            gender:
                                instructor.gender,

                            date_of_birth:
                                instructor.date_of_birth,

                            specialization:
                                instructor.specialization,

                            experience_years:
                                instructor.experience_years,

                            blood_group:
                                instructor.instructor_blood_group,

                            address: {
                                address:
                                    instructor.current_address,

                                city:
                                    instructor.current_city,

                                state:
                                    instructor.current_state,

                                district:
                                    instructor.current_district,

                                taluka:
                                    instructor.current_taluka,

                                pin_code:
                                    instructor.current_pincode,
                            },
                        },
                    },
                    "Instructor profile fetched successfully."
                )
            );
        }

        /*
         * ============================================================
         * MOBILIZER
         * ============================================================
         */
        if (targetUser.user_role === role_types.mobilizer) {

            const mobilizer =
                await prisma.mobilizer_details.findUnique({
                    where: {
                        user_id: targetUserId,
                    },
                    select: {
                        mobilizer_id: true,

                        mobilizer_unique_id: true,

                        mobilizer_first_name: true,
                        mobilizer_last_name: true,

                        mobilizer_designation: true,

                        mobilizer_phone_no: true,
                    },
                });

            if (!mobilizer) {
                throw new ApiError(
                    404,
                    "Mobilizer details not found."
                );
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        userDetails,

                        profile: {
                            mobilizer_id:
                                mobilizer.mobilizer_id,

                            unique_id:
                                mobilizer.mobilizer_unique_id,

                            first_name:
                                mobilizer.mobilizer_first_name,

                            last_name:
                                mobilizer.mobilizer_last_name,

                            full_name:
                                [
                                    mobilizer.mobilizer_first_name,
                                    mobilizer.mobilizer_last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" "),

                            email:
                                targetUser.user_email,

                            phone_number:
                                mobilizer.mobilizer_phone_no,

                            designation:
                                mobilizer.mobilizer_designation,
                        },
                    },
                    "Mobilizer profile fetched successfully."
                )
            );
        }

        /*
         * ============================================================
         * HR
         * ============================================================
         */
        if (targetUser.user_role === role_types.hr) {

            const hr =
                await prisma.hr_details.findUnique({
                    where: {
                        user_id: targetUserId,
                    },
                    select: {
                        hr_id: true,

                        hr_unique_id: true,

                        hr_first_name: true,
                        hr_last_name: true,

                        hr_designation: true,
                        hr_phone_no: true,

                        company_details: {
                            select: {
                                company_id: true,
                                company_name: true,
                            },
                        },
                    },
                });

            if (!hr) {
                throw new ApiError(
                    404,
                    "HR details not found."
                );
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        userDetails,

                        profile: {
                            hr_id:
                                hr.hr_id,

                            unique_id:
                                hr.hr_unique_id,

                            first_name:
                                hr.hr_first_name,

                            last_name:
                                hr.hr_last_name,

                            full_name:
                                [
                                    hr.hr_first_name,
                                    hr.hr_last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" "),

                            email:
                                targetUser.user_email,

                            designation:
                                hr.hr_designation,

                            phone_number:
                                hr.hr_phone_no,

                            company:
                                hr.company_details,
                        },
                    },
                    "HR profile fetched successfully."
                )
            );
        }

        /*
         * ============================================================
         * ADMIN
         * ============================================================
         */
        if (targetUser.user_role === role_types.admin) {

            const adminProfile =
                await prisma.admin_details.findUnique({
                    where: {
                        user_id: targetUserId,
                    },
                    select: {
                        admin_id: true,

                        admin_first_name: true,
                        admin_last_name: true,

                        blood_group: true,
                        date_of_birth: true,

                        highest_qualification: true,
                        specialization: true,
                    },
                });

            if (!adminProfile) {
                throw new ApiError(
                    404,
                    "Admin details not found."
                );
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        userDetails,

                        profile: {
                            admin_id:
                                adminProfile.admin_id,

                            first_name:
                                adminProfile.admin_first_name,

                            last_name:
                                adminProfile.admin_last_name,

                            full_name:
                                [
                                    adminProfile.admin_first_name,
                                    adminProfile.admin_last_name,
                                ]
                                    .filter(Boolean)
                                    .join(" "),

                            email:
                                targetUser.user_email,

                            blood_group:
                                adminProfile.blood_group,

                            date_of_birth:
                                adminProfile.date_of_birth,

                            highest_qualification:
                                adminProfile.highest_qualification,

                            specialization:
                                adminProfile.specialization,
                        },
                    },
                    "Admin profile fetched successfully."
                )
            );
        }
        throw new ApiError(
            400,
            "Unsupported user role."
        );
    }
);