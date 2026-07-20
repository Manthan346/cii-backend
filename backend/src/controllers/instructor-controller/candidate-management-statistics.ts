import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse"

export const getCandidateStatistics = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) =>{
         const {instructor_id} =req.instructor!;
         const enrollments = await prisma.batch_enrollment.findMany({
            where: {
                batch_details: {
                    instructor_id,
                    b_status: 'ACTIVE'
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