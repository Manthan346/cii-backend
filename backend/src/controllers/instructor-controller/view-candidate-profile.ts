import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const viewCandidateProfile = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {

        const { company_id } = req.instructor!;

        if (!company_id) {
            throw new ApiError(
                403,
                "Company not found."
            );
        }
        
        const enrollment_id =req.query.enrollment_id?.toString().trim();
        if(!enrollment_id){
            throw new ApiError(
                400,
                "Enrollment id is required."
            );
        }
        const enrollment =await prisma.batch_enrollment.findUnique({
            where:{
                enrollment_id
            },
            include:{
                candidates_details:{
                    include:{
                        user_login:true
                    }
                },
                batch_details: {
                    include: {
                        course_details: true
                    }
                }
            }

        });


        if(!enrollment){
            throw new ApiError(
                404,
                "Enrollment Not Found."
            )
        }

        if (
            enrollment.batch_details.course_details.company_id !==
            company_id
        ) {
            throw new ApiError(
                403,
                "You don't have permission to view this candidate's profile."
            );
        }

        if(
            enrollment.batch_details?.b_status !==
            "ACTIVE"
        ){
            throw new ApiError(
                400,
                "This batch is not active."
            );

        }

         

         return res.status(200).json(
            new ApiResponse(
                200,
                {
                    candidate_name:`${enrollment.candidates_details.candidate_first_name} ${enrollment.candidates_details.candidate_last_name ?? ""}`.trim(),
                    phone_no:enrollment.candidates_details.contact_number,
                    blood_group:enrollment.candidates_details.blood_group,
                    gender: enrollment.candidates_details.gender,
                    guardian_name: enrollment.candidates_details.guardian_name,
                    guardian_phone_no: enrollment.candidates_details.guardian_phone_no,
                    highest_qualification: enrollment.candidates_details.highest_qualification,
                    date_of_birth:enrollment.candidates_details.date_of_birth,
                    email_id:enrollment.candidates_details.user_login.user_email,
                    category : enrollment.candidates_details.category,
                    address: enrollment.candidates_details.candidate_current_address,
                    pin_code: enrollment.candidates_details.pin_code,
                    candidate_batch_id:enrollment.candidate_batch_id
                    

                },
                "Candidate details fetched successfully."
            )
        );

    }
)