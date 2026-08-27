import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { role_types, attend_types } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";
import { z } from "zod";

export const getCertificateEnrollments = asyncHandler(async (req: Request, res: Response) => {
    const adminReq = req as adminAuthRequest;
    const adminUserId = adminReq.user.user_id;

    const page = req.pagination?.page ?? 1;
    const limit = req.pagination?.limit ?? 20;
    const skip = req.pagination?.skip ?? (page - 1) * limit;

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const courseId = typeof req.query.courseId === "string" ? req.query.courseId : undefined;
    const attendance = typeof req.query.attendance === "string" ? req.query.attendance : undefined;

    const admin = await prisma.user_login.findUnique({
        where: { user_id: adminUserId },
        select: { user_role: true, center_id: true }
    });

    if (!admin) throw new ApiError(404, "Admin user not found.");
    if (admin.user_role !== role_types.admin) {
        throw new ApiError(403, "Unauthorized.");
    }

    const validCourseId = courseId && z.string().uuid().safeParse(courseId).success
        ? courseId
        : undefined;

    const where: Prisma.batch_enrollmentWhereInput = {
        candidates_details: {
            user_login: {
                center_id: admin.center_id
            },
            ...(search
                ? {
                    OR: [
                        {
                            candidate_first_name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            candidate_last_name: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        {
                            user_login: {
                                user_email: {
                                    contains: search,
                                    mode: "insensitive"
                                }
                            }
                        }
                    ]
                }
                : {})
        },
        ...(validCourseId
            ? {
                batch_details: {
                    course_id: validCourseId
                }
            }
            : {})
    };

    const enrollments = await prisma.batch_enrollment.findMany({
        where,
        select: {
            enrollment_id: true,
            enrollment_date: true,
            enrollment_status: true,
            certificate_url: true,
            candidate_batch_id: true,
            candidate_id: true,
            batch_id: true,

            candidates_details: {
                select: {
                    candidate_id: true,
                    candidate_unique_id: true,
                    candidate_first_name: true,
                    candidate_last_name: true,
                    user_login: {
                        select: {
                            user_email: true
                        }
                    }
                }
            },

            batch_details: {
                select: {
                    batch_id: true,
                    batch_code: true,
                    batch_name: true,
                    course_details: {
                        select: {
                            course_id: true,
                            course_name: true
                        }
                    }
                }
            }
        },
        orderBy: {
            enrollment_date: "desc"
        }
    });

    const attendanceRecords = await prisma.attendance_records.findMany({
        where: {
            candidate_id: {
                in: enrollments.map(e => e.candidate_id)
            },
            attendance_sessions: {
                batch_id: {
                    in: enrollments.map(e => e.batch_id)
                }
            }
        },
        select: {
            candidate_id: true,
            attendance_status: true,
            attendance_sessions: {
                select: {
                    batch_id: true
                }
            }
        }
    });

    const attendanceMap = new Map<string, { total: number; score: number }>();

    for (const record of attendanceRecords) {
        const key = `${record.candidate_id}-${record.attendance_sessions.batch_id}`;
        const current = attendanceMap.get(key) ?? { total: 0, score: 0 };

        current.total++;

        if (
            record.attendance_status === attend_types.present ||
            record.attendance_status === attend_types.late
        ) {
            current.score++;
        } else if (
            record.attendance_status === attend_types.half_day
        ) {
            current.score += 0.5;
        }

        attendanceMap.set(key, current);
    }

    let data = enrollments.map(enrollment => {
        const attendanceData = attendanceMap.get(
            `${enrollment.candidate_id}-${enrollment.batch_id}`
        );

        const attendancePercentage = attendanceData?.total
            ? Number(
                ((attendanceData.score / attendanceData.total) * 100).toFixed(2)
            )
            : 0;

        const candidate = enrollment.candidates_details;
        const batch = enrollment.batch_details;

        return {
            enrollment_id: enrollment.enrollment_id,
            enrollment_date: enrollment.enrollment_date,
            enrollment_status: enrollment.enrollment_status,
            certificate_url: enrollment.certificate_url,
            certificate_status: enrollment.certificate_url
                ? "ISSUED"
                : "NOT_ISSUED",
            attendance_percentage: attendancePercentage,

            candidate: {
                candidate_id: candidate.candidate_id,
                candidate_unique_id: candidate.candidate_unique_id,
                first_name: candidate.candidate_first_name,
                last_name: candidate.candidate_last_name,
                full_name: [
                    candidate.candidate_first_name,
                    candidate.candidate_last_name
                ].filter(Boolean).join(" "),
                email: candidate.user_login.user_email
            },

            course: {
                course_id: batch.course_details.course_id,
                course_name: batch.course_details.course_name
            },

            batch: {
                batch_id: batch.batch_id,
                batch_code: batch.batch_code,
                batch_name: batch.batch_name
            }
        };
    });

    if (attendance) {
        const [min, max] = attendance.split("-").map(Number);
        if (
            Number.isNaN(min) ||
            Number.isNaN(max) ||
            min < 0 ||
            max > 100 ||
            min > max
        ) {
            throw new ApiError(400, "Invalid attendance range.");
        }
        data = data.filter(item =>
            item.attendance_percentage >= min &&
            item.attendance_percentage <= max
        );
    }

    const total = data.length;
    const paginatedData = data.slice(skip, skip + limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                enrollments: paginatedData,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            },
            "Certificate enrollments fetched successfully."
        )
    );
});