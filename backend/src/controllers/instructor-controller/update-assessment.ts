import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const updateAssessment = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const {assessment_id,title,assessment_desc,assessment_date,assessment_duration,assessment_link,assessment_type,questions,is_show}=req.body

        const user_id =req.user?.user_id;
        const instructor_id =req.instructor?.instructor_id;

        if(!user_id){
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        if(!instructor_id){
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        const user =await prisma.user_login.findUnique({
            where:{
                user_id
            },
            select:{
                user_role:true
            }
        });

        if(!user){
            throw new ApiError(
                404,
                "User not found."
            );
        }


        if(
            user.user_role
            !==
            "instructor"
        ){
            throw new ApiError(
                403,
                "You are not authorized to update assessments."
            );
        }

        const assessment =await prisma.assessments.findUnique({
            where:{
                assessment_id
            },
            select:{
                batch_details:{
                    select:{
                        instructor_id:true
                    }
                }
            }
        });

        if(!assessment){
            throw new ApiError(
                404,
                "Assessment not found."
            );
        }

        if(
            assessment
            .batch_details
            .instructor_id
            !==
            instructor_id
        ){
            throw new ApiError(
                403,
                "You are not authorized to update this assessment"
            );
        }

        let updateData : Record<string,unknown> = {};

        if (title !== undefined) {
            updateData.title = title;
        }
        if (assessment_desc !== undefined) {
            updateData.assessment_desc = assessment_desc;
        }
        if (assessment_type !== undefined) {
            updateData.assessment_type = assessment_type;
        }
        if (assessment_date !== undefined) {
            updateData.assessment_date = new Date(assessment_date);
        }
        if (assessment_duration !== undefined) {
            updateData.assessment_duration = assessment_duration;
        }
        if (questions !== undefined) {
            updateData.questions = questions;
        }
        if (assessment_link !== undefined) {
            updateData.assessment_link = assessment_link;
        }
        if (is_show !== undefined) {
            updateData.is_show = is_show;
        }

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(
                400,
                "No fields provided to update."
            );
        }

        const updatedAssessment =await prisma.assessments.update({
            where:{
                assessment_id
            },
            data:updateData
        });
        

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    assessment_id:
                    updatedAssessment
                    .assessment_id,
                    title:
                    updatedAssessment.title,
                    is_show:
                    updatedAssessment.is_show
                },
                "Assessment updated successfully."
            )
        );


    }
)