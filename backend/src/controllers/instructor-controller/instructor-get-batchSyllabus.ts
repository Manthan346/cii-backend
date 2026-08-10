import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { z} from "zod";

export const getBatchSyllabus = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{
        const batch_id = req.params.batch_id as string;
        const company_id = req.instructor?.company_id;

        
        
        if(!company_id){
            throw new ApiError(
                403,
                "You dont belong to a valid company."
            )
        }
        if(!batch_id){
            throw new ApiError(
                400,
                "Invalid batch id"
            )
        }
        const parsedBatchId = z.string().uuid().safeParse(batch_id);

        if (!parsedBatchId.success) {
            throw new ApiError(400, "Invalid batch id");
        }

        const batch = await prisma.batch_details.findUnique({
            where:{
                batch_id
            },
            include:{
                course_details:{
                    select:{
                        company_id:true
                    }
                }
            }
        });

        if(!batch){
            throw new ApiError(
                400,
                "Batch not found."
            )
        }

        if(company_id != batch.course_details.company_id){
            throw new ApiError(
                403,
                "You dont have access to view data of another company."
            )
        }

        const syllabus = await prisma.batch_syllabus.findMany(
            {
                where:{
                    batch_id
                },
                orderBy:{
                    completion_date:'asc'
                },
                select:{
                    instructor_details:{
                        select:{
                            instructor_first_name:true,
                            instructor_last_name: true
                        }
                    },
                    topic_name:true,
                    completed_at:true,
                    completed_by:true,
                    completion_date:true,
                    is_completed:true,
                    batch_syllabus_id:true
                }
            }
        )

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    syllabus
                },
                "Batch syllabus details fetched successfully."
            )

        )
    }
)