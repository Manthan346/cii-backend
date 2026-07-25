import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { asyncHandler } from "../../helpers/asyncHandler";
import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import {batch_enrollment_status_type} from "../../generated/prisma/enums";


export const getAllCandidateBelongingToInstructor = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const {instructor_id} = req.instructor!;
        const page = Math.max(
            1,
            Number(req.query.page) || 1
        );
        const limit = Math.min(
            50,
            Math.max(
                1,
                Number(req.query.limit) ||6
            )
        );

        const status = req.query.status?.toString().trim();
        const batch_id = req.query.batch_id?.toString().trim();
        const search = req.query.search?.toString().trim();

        const skip = (page-1)*limit;

        const whereClause:any = {
            batch_details:{
                instructor_id,
                b_status:"ACTIVE"
            }
        };

        const validStatus = Object.values(
            batch_enrollment_status_type
        );


        if(
            status &&
            !validStatus.includes(
                status as batch_enrollment_status_type
            )
        ){
            throw new ApiError(
                400,
                "Invalid enrollment status."
            );
        }

        if(status){
            whereClause.enrollment_status = status;
        }


        if(batch_id){
            whereClause.batch_id = batch_id;
        }

        if(search){
            whereClause.OR = [
                {
                    candidates_details:{
                        is:{
                            candidate_first_name:{
                                contains:search,
                                mode:"insensitive"
                            }
                        }
                    }
                },
                {
                    candidates_details:{
                        is:{
                            candidate_last_name:{
                                contains:search,
                                mode:"insensitive"
                            }
                        }
                    }
                },
                {
                    candidate_batch_id:{
                        contains:search,
                        mode:"insensitive"
                    }
                }
            ];
        }

        const totalCandidates =
            await prisma.batch_enrollment.count({
                where:whereClause
            });

        const candidates = await prisma.batch_enrollment.findMany({
            where:whereClause,
            skip,
            take:limit,
            select:{
            candidate_batch_id:true,
            enrollment_status:true,
            enrollment_date:true,
            enrollment_id:true,
            candidates_details:{
                select:{
                    candidate_first_name:true,
                    candidate_last_name:true,
                    contact_number:true
                }
            },
            batch_details:{
                select:{
                    batch_name:true,
                    course_details:{
                        select:{
                            course_name:true
                        }
                    }
                }
            }
        }
        });

        const formattedCandidates = candidates.map((candidate)=>({
            candidate_batch_id:
                candidate.candidate_batch_id,
            candidate_name:
                `${candidate.candidates_details.candidate_first_name} ${
                candidate.candidates_details.candidate_last_name ?? ""
                }`.trim(),
            batch_name:
                candidate.batch_details.batch_name,
            course_name:
                candidate.batch_details.course_details?.course_name,
            contact_number:
                candidate.candidates_details.contact_number,
            enrollment_date:
                candidate.enrollment_date,
            enrollment_status:
                candidate.enrollment_status,
            enrollment_id:
                candidate.enrollment_id
        }));

        const totalPages = Math.ceil(
            totalCandidates/limit
        );


        const pagination = {
            currentPage:page,
            totalPages,
            totalCandidates,
            limit
        };


        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    pagination,
                    candidates:
                    formattedCandidates
                },
                "Candidates fetched successfully."
            )
         );



    }
)