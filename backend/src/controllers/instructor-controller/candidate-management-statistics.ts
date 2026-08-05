import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse"
import { ApiError } from "../../helpers/ApiError";

export const getCandidateStatistics = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{
         const {instructor_id,company_id} =req.instructor!;
         if (!company_id) {
            throw new ApiError(
                403,
                "Company not found."
            );
        }
         
         const enrollments = await prisma.batch_enrollment.findMany({
            where: {
                batch_details: {
                    b_status:"ACTIVE",
                course_details:{
                    company_id
                }
                }
            },
            select: {
                enrollment_status: true
            }
        });
        const summary = {
             totalCandidates : 0,
             activeCandidates : 0,
             droppedCandidates : 0,
             blacklistedCandidates :0
        }
        

        for(const enrollment of enrollments){
            summary.totalCandidates++;
            if(enrollment.enrollment_status === "ACTIVE"){
                summary.activeCandidates++;
            }
            else if(enrollment.enrollment_status === "DROPPED"){
                summary.droppedCandidates++;
            }
            else if(enrollment.enrollment_status === "BLACKLIST"){
                summary.blacklistedCandidates++;
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    summary
                },
                "Candidate statistics fetched successfully."
            )
        );
    }
)