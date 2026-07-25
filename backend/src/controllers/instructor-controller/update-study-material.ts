import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const updateStudyMaterial = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const {study_material_id,title,description,document_link,is_show}=req.body

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
                "You are not authorized to update study materials."
            );
        }

        const studyMaterial =await prisma.study_material.findUnique({
            where:{
                study_material_id
            },
            select:{
                batch_details:{
                    select:{
                        instructor_id:true
                    }
                }
            }
        });

        if(!studyMaterial){
            throw new ApiError(
                404,
                "Study material not found."
            );
        }

        if(
            studyMaterial
            .batch_details
            .instructor_id
            !==
            instructor_id
        ){
            throw new ApiError(
                403,
                "You are not authorized to update this study material."
            );
        }

        let updateData : Record<string,unknown> = {};
        
        if(title !== undefined){
            updateData = {
                ...updateData,
                title
            };
        }
        if(description !== undefined){
            updateData = {
                ...updateData,
                description
            };
        }
        if(document_link !== undefined){
            updateData = {
                ...updateData,
                document_link
            };
        }
        if(is_show !== undefined){
            updateData = {
                ...updateData,
                is_show
            };
        }

        const updatedStudyMaterial =await prisma.study_material.update({
            where:{
                study_material_id
            },
            data:updateData
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    study_material_id:
                    updatedStudyMaterial
                    .study_material_id,
                    title:
                    updatedStudyMaterial
                    .title,
                    is_show:
                    updatedStudyMaterial
                    .is_show
                },
                "Study material updated successfully."
            )
        );


    }
)