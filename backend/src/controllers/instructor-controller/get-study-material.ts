import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import {
    batch_status
}
from "../../generated/prisma/enums";


export const getStudyMaterial = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{

        const page = req.query.page? Number(req.query.page):1;
        const limit = req.query.limit? Number(req.query.limit):10;
        const skip = (page-1)*limit;
        const instructor_id = req.instructor?.instructor_id;
        const batchId = String(req.query.batch_id || "");
        const search = String(req.query.search || "").trim();
        const isShowQuery = req.query.is_show;
        let isShow : boolean | undefined;
        const user_id = req.user?.user_id;

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

       if(batchId){

    if(
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(batchId)
    ){

        throw new ApiError(
            400,
            "Invalid batch id."
        );

    }

    const batch =await prisma.batch_details.findUnique({
                where:{
                    batch_id:batchId
                },
                select:{
                    instructor_id:true
                }
            });
            if(!batch){
                throw new ApiError(
                    404,
                    "Batch not found."
                );
            }
            if(
                batch.instructor_id
                !==
                instructor_id
            ){
                throw new ApiError(
                    403,
                    "You are not authorized to access this batch."
                );
            }
        }

        if(isNaN(page)){
            throw new ApiError(
                400,
                "Invalid page number."
            );
        }


        if(isNaN(limit)){
            throw new ApiError(
                400,
                "Invalid limit."
            );
        }

        if(page <1){
            throw new ApiError(
                400,
                "Page number must be greater than zero."
            );
        }

        if(limit <1){
            throw new ApiError(
                400,
                "Limit must be greater than zero."
            );
        }

        if(limit >50){
            throw new ApiError(
                400,
                "Maximum limit is 50."
            );
        }

        if(isShowQuery === undefined){
            isShow = undefined;
        }
        else if(isShowQuery === "true"){
            isShow = true;
        }
        else if(isShowQuery === "false"){
            isShow = false;
        }
        else{
            throw new ApiError(
                400,
                "Invalid is_show value."
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

        if(user.user_role !== "instructor"){
                throw new ApiError(
                    403,
                    "You are not authorized to access study materials."
                );
            }

        let batchFilter : Record<string,unknown>={};
        let studyMaterialFilter :
        Record<string,unknown>={};
        let searchFilter :
        Record<string,unknown>={};

        const batchStatus = String(req.query.batch_status || "ALL");

        if(
            !Object.values(batch_status)
            .includes(
                batchStatus as batch_status
            )
            &&
            batchStatus !== "ALL"
        ){
            throw new ApiError(
                400,
                "Invalid batch status."
            );
        }
        
        if(batchStatus !== "ALL"){
            batchFilter={
                b_status:
                batchStatus as batch_status
            };
        }

        if(batchId){
            batchFilter={
                ...batchFilter,
                batch_id:batchId
            };
        }

        if(isShow !== undefined){
            studyMaterialFilter={
                is_show:isShow
            };
        }

        if(search){
            searchFilter={
                OR:[
                    {
                        title:{
                            contains:search,
                            mode:"insensitive"
                        }
                    },
                    {
                        batch_details:{
                            batch_code:{
                                contains:search,
                                mode:"insensitive"
                            }
                        }
                    },
                    {
                        batch_details:{
                            course_details:{
                                course_name:{
                                    contains:search,
                                    mode:"insensitive"
                                }
                            }
                        }
                    }
                ]
            };
        }

        const totalRecords =await prisma.study_material.count({
            where:{
                ...studyMaterialFilter,
                ...searchFilter,
                batch_details:{
                    instructor_id,
                    ...batchFilter
                }
            }
        });

        const totalPages =Math.ceil(
            totalRecords/limit
        );

        const studyMaterials =await prisma.study_material.findMany({
            where:{
                ...studyMaterialFilter,
                ...searchFilter,
                batch_details:{
                    instructor_id,
                    ...batchFilter
                }
            },
            include:{
                batch_details:{
                    select:{
                        batch_id:true,
                        batch_code:true,
                        course_details:{
                            select:{
                                course_name:true
                            }
                        }
                    }
                }
            },
            skip,
            take:limit,
            orderBy:{
                created_at:"desc"
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    currentPage:page,
                    totalPages,
                    totalRecords,
                    recordsPerPage:limit,
                    studyMaterials
                },
                "Study materials fetched successfully."
            )
        );
    }
)