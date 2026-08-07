import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const getAllAttendanceSessions = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{
        
        const instructorId = req.instructor?.instructor_id;
        
        const company_id = req.instructor?.company_id;

        const { page, limit, skip } = req.pagination!;
        const {
            search,
            batch_id,
            course_id,
            session_date
        } = req.query;
        if(!instructorId){
            throw new ApiError(
                401,
                "You are not authorized"
            )
        }
        if(!company_id){
            throw new ApiError(
                401,
                "You dont belong to the same company."
            )
        }

        

        if (page < 1) {
            throw new ApiError(400, "Page must be greater than 0.");
        }

        if (limit < 1 || limit > 50) {
            throw new ApiError(400, "Limit must be between 1 and 50.");
        }

        
        

        const where = {
            batch_details: {
                course_details: {
                    company_id,
                    ...(course_id && {
                        course_id: course_id as string
                    })
                },
                ...(batch_id && {
                    batch_id: batch_id as string
                })
            },

            ...(search && {
                topic_name: {
                    contains: search as string,
                    mode: "insensitive" as const
                }
            }),

            ...(session_date && {
                session_date: new Date(session_date as string)
            })
        };


        
        const sessions = await prisma.attendance_sessions.findMany({
            where,
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
                                course_name: true
                            }
                        }
                    }
                },
                instructor_details: {
                    select: {
                        instructor_first_name: true,
                        instructor_last_name: true
                    }
                }
            },
            orderBy: [
                { session_date: "desc" },
                { session_time: "desc" }
            ],
            skip,
            take: limit,
        });
        

        
        const totalRecords = await prisma.attendance_sessions.count({
            where
        });
        
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    sessions,
                    pagination: {
                        page,
                        limit,
                        totalRecords,
                        totalPages: Math.ceil(totalRecords / limit)
                    }
                },
                "Attendance sessions fetched successfully."
            )
        );
    }
);