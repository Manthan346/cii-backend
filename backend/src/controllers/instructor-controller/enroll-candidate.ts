import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";

export const enrollCandidate = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{
        const {email_id,batch_id} = req.body;
        const {center_id}= req.user;

        const candidate = await prisma.user_login.findUnique(
            {
                where:{
                    user_email:email_id
                },
                include:{
                    candidates_details:true
                }
            }
        );

        if(!candidate){

            throw new ApiError(
                404,
                "Candidate not found."
            );
        
        }

        if(candidate.user_role !== "candidate"){
            throw new ApiError(
                403,
                "User is not registered as a candidate."
            );
        }

        if(candidate.center_id !== center_id){
            throw new ApiError(
                403,
                "Candidate belongs to another center."
            );
        }

        if(!candidate.candidates_details){
            throw new ApiError(
                404,
                "Candidate details not found."
            );
        }



        if(!candidate.candidates_details.admin_approval){
            throw new ApiError(
                400,
                "Candidate is awaiting admin approval."
            );
        }

        const batch = await prisma.batch_details.findUnique({
            where:{
                batch_id
            }
        })

        if(!batch){
            throw new ApiError(
                404,
                "Batch not found."
            )
        }

        if(batch.b_status!=='ACTIVE'){
            throw new ApiError(
                400,
                "This batch is not active."
            )
        }

        if(batch.instructor_id !== req.instructor?.instructor_id){
            throw new ApiError(
                403,
                "You don't have permission to enroll candidates in this batch."
            )
        }

        const enrollmentExists = await prisma.batch_enrollment.findFirst({
            where:{
                candidate_id:candidate.candidates_details.candidate_id,
                batch_id
            }
        })

        if(enrollmentExists){
            throw new ApiError(
                409,
                "Candidate is already enrolled in this batch."
            );
        }

        const totalCandidates = await prisma.batch_enrollment.count({
            where:{
                batch_id,
                enrollment_status :'ACTIVE'
            }
        })

        if(
            totalCandidates >=
            batch.max_candidates
        ){
            throw new ApiError(
                400,
                "Batch has reached its maximum capacity."
            );
        }

        const candidateId = candidate.candidates_details.candidate_id

        const enrollment = await prisma.$transaction(
            async(tx) => {
                const enrollment = await tx.batch_enrollment.create({
                    data:{
                        candidate_id: candidateId,
                        batch_id,
                        enrollment_status:"ACTIVE"
                    }
                });
                return enrollment;
            }
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                   candidate_name:
                    `${candidate.candidates_details.candidate_first_name} ${
                    candidate.candidates_details.candidate_last_name ?? ""
                    }`.trim(),
                    enrollment_status:
                    enrollment.enrollment_status
                },
                "Candidate enrolled successfully."
            )
        );
    }
)