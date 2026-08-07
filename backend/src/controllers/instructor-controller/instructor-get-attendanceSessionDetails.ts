import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const getSessionDetails = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const company_id = req.instructor?.company_id;
        const attendance_session_id = req.params.attendance_session_id as string;
        if (!company_id) {
            throw new ApiError(
                401,
                "Company information not found."
            );
        }
        const attendanceSession = await prisma.attendance_sessions.findUnique({
            where: {
                attendance_session_id
            },
            select: {
                attendance_session_id: true,
                session_date: true,
                session_time: true,
                topic_name: true,
                attendance_mode: true,
                room_no: true,

                batch_details: {
                    select: {
                        batch_id: true,
                        batch_code: true,
                        course_details: {
                            select: {
                                course_id: true,
                                course_name: true,
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

        if (company_id !== attendanceSession.batch_details.course_details.company_id){
            throw new ApiError(
                403,
                "You are not authorized to access this session."
            )
        }

        

        

        const attendanceRecords = await prisma.attendance_records.findMany({
            where: {
                attendance_session_id: attendanceSession.attendance_session_id
            },
            select: {
                attendance_id: true,
                attendance_status: true,
                remarks: true,
                time_in: true,
                time_out: true,

                candidates_details: {
                    select: {
                        candidate_id:true,
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

        const attendanceTaken = attendanceRecords.length > 0;
                return res.status(200).json(
            new ApiResponse(
                200,
                {
                    attendanceTaken,
                    session: attendanceSession,
                    attendanceRecords
                },
                "Attendance session fetched successfully."
            )
        );
        }
        
)