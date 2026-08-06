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


export const getAssessments = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{

        const page = req.query.page? Number(req.query.page):1;
        const limit = req.query.limit? Number(req.query.limit):10;
        const skip = (page-1)*limit;
        const company_id = req.instructor?.company_id
        
        const batchId =  String(req.query.batch_id || "");
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

        if(!company_id){
            throw new ApiError(
                401,
                "Unauthorized Access."
            )
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

       if (batchId) {
            if (
                !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(batchId)
            ) {
                throw new ApiError(400, "Invalid batch ID.");
            }

            const batch = await prisma.batch_details.findUnique({
                where: {
                    batch_id: batchId
                },
                select: {
                    batch_id: true,
                    course_details:{
                        select:{
                            company_id:true
                        }
                        
                    }
                }
            });

            if (!batch) {
                throw new ApiError(404, "Batch not found.");
            }

            if (batch.course_details.company_id !== company_id) {
                throw new ApiError(
                    403,
                    "You are not authorized to access this batch."
                );
            }
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
                    "You are not authorized to access assessments."
                );
            }

        let batchFilter : Record<string,unknown>={};
        let assessmentFilter :
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
            assessmentFilter={
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
                    },
                    {
                        assessment_desc:{
                             contains: search,
                            mode: "insensitive"
                        }
                    }
                ]
            };
        }

        const totalRecords =await prisma.assessments.count({
            where:{
                ...assessmentFilter,
                ...searchFilter,
                batch_details:{
                    course_details:{
                        company_id
                    },
                    ...batchFilter
                }
            }
        });

        const totalPages =Math.ceil(
            totalRecords/limit
        );

        const assessments = await prisma.assessments.findMany({
            where: {
                ...assessmentFilter,
                ...searchFilter,
                batch_details: {
                    course_details:{
                        company_id
                    },
                    ...batchFilter
                }
            },
            select: {
                assessment_id: true,
                title: true,
                assessment_desc: true,
                assessment_type: true,
                assessment_date: true,
                questions: true,
                assessment_duration: true,
                assessment_link: true,
                is_show: true,

                batch_details: {
                    select: {
                        batch_id: true,
                        batch_code: true,
                        course_details: {
                            select: {
                                course_name: true
                            }
                        }
                    }
                }
            },
            skip,
            take: limit,
            orderBy: {
                assessment_date: "asc"
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
                    assessments
                    
                },
                "Assessments fetched successfully."
            )
        );
    }
)