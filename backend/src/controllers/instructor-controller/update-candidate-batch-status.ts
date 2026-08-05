import { Response } from "express";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import {
    batch_enrollment_status_type
}
from "../../generated/prisma/enums";
import { ApiResponse } from "../../helpers/ApiResponse";

export const updateCandidateBatchStatus = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{
        const { company_id } = req.instructor!;
        const{enrollment_id,enrollment_status} = req.body;

        if (!company_id) {
            throw new ApiError(
                403,
                "Company not found."
            );
        }

        const enrollment = await prisma.batch_enrollment.findUnique({
            where:{
                enrollment_id
            }
        })

        if(!enrollment){
            throw new ApiError(
                404,
                "Enrollment Not Found"
            )
        }

        const batch = await prisma.batch_details.findUnique({
            where: {
                batch_id: enrollment.batch_id
            },
            include: {
                course_details: true
            }
        });

        if (!batch) {
            throw new ApiError(
                404,
                "Batch not found."
            );
        }

        if(
            batch?.course_details.company_id !==
            company_id
        ){
            throw new ApiError(
                403,
                "You don't have permission to update this candidate's status."
            );
        }

        if(
            batch?.b_status !==
            "ACTIVE"
        ){
            throw new ApiError(
                400,
                "This batch is not active."
            );

        }

        const validStatus = Object.values(
            batch_enrollment_status_type
        );

        if(
            !validStatus.includes(
                enrollment_status as
                batch_enrollment_status_type
            )
        ){
            throw new ApiError(
                400,
                "Invalid enrollment status."
            );
        }

        if(
            enrollment.enrollment_status ===
            enrollment_status
        ){
            throw new ApiError(
                400,
                `Candidate already has ${enrollment_status} status.`
            ); 
        }
        const oldStatus = enrollment.enrollment_status;

        const updatedEnrollment =await prisma.batch_enrollment.update({
            where:{
                enrollment_id
            },
            data:{
                enrollment_status
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    old_status:
                    oldStatus,
                    new_status:
                    updatedEnrollment
                    .enrollment_status
                },
                "Candidate status updated successfully."
            )
        );
    }
)