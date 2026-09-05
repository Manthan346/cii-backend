import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getActiveStudentsForSession = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;
        const company_id = req.instructor?.company_id;
        const attendance_session_id =
            req.params.attendance_session_id as string;

        if (!instructorId) {
            throw new ApiError(
                401,
                "You are not authorized."
            );
        }

        if (!company_id) {
            throw new ApiError(
                401,
                "Company information not found."
            );
        }

        if (!attendance_session_id) {
            throw new ApiError(
                400,
                "Attendance session ID is required."
            );
        }

        const attendanceSession =
            await prisma.attendance_sessions.findUnique({
                where: {
                    attendance_session_id
                },
                select: {
                    attendance_session_id: true,
                    instructor_id: true,
                    batch_id: true,
                    batch_details: {
                        select: {
                            batch_id: true,
                            batch_code: true,
                            course_details: {
                                select: {
                                    company_id: true
                                }
                            }
                        }
                    }
                }
            });

        if (!attendanceSession) {
            throw new ApiError(
                404,
                "Attendance session not found."
            );
        }

        if (attendanceSession.instructor_id !== instructorId) {
            throw new ApiError(
                403,
                "You don't have permission to access this session."
            );
        }

        if (
            attendanceSession.batch_details.course_details.company_id !==
            company_id
        ) {
            throw new ApiError(
                403,
                "You are not authorized to access this session."
            );
        }

        // Fetch active students
        const students = await prisma.batch_enrollment.findMany({
            where: {
                batch_id: attendanceSession.batch_id,
                enrollment_status: "ACTIVE"
            },
            select: {
                enrollment_id: true,
                candidate_id: true,
                candidates_details: {
                    select: {
                        candidate_unique_id: true,
                        candidate_first_name: true,
                        candidate_last_name: true
                    }
                }
            },
            orderBy: {
                candidates_details: {
                    candidate_first_name: "asc"
                }
            }
        });

        // Fetch attendance records for this session
        const attendanceRecords =
            await prisma.attendance_records.findMany({
                where: {
                    attendance_session_id
                },
                select: {
                    candidate_id: true,
                    attendance_status: true
                }
            });

        // Calculate summary
        const total = students.length;
        const present = attendanceRecords.filter(
            (record) =>
                record.attendance_status === "present"
        ).length;
        const absent = attendanceRecords.filter(
            (record) =>
                record.attendance_status === "absent"
        ).length;
        const late = attendanceRecords.filter(
            (record) =>
                record.attendance_status === "late"
        ).length;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    session: {
                        attendance_session_id:
                            attendanceSession.attendance_session_id,

                        batch_id:
                            attendanceSession.batch_details.batch_id,

                        batch_code:
                            attendanceSession.batch_details.batch_code
                    },

                    summary: {
                        total,
                        present,
                        absent,
                        late
                    },

                    students
                },
                "Active students fetched successfully."
            )
        );
    }
);