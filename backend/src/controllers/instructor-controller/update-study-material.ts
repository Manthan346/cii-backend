import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const updateStudyMaterial = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {
        const {study_material_id,title,description,document_link,is_show}=req.body;
        const company_id = req.instructor?.company_id;


        if(!company_id){
            throw new ApiError(
                401,
                "Unauthorized access"
            )
        }

        if (!study_material_id) {
            throw new ApiError(
                400,
                "Study material id is required."
            );
        }

        const studyMaterial =await prisma.study_material.findUnique({
            where:{
                study_material_id
            },
            select:{
                batch_details:{
                    select:{
                        course_details:{
                            select:{
                                company_id:true
                            }
                            
                        }
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
            .course_details
            .company_id
            
            !==
            company_id
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

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(
                400,
                "At least one field must be provided for update."
            );
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