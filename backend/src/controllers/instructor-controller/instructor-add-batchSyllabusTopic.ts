import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

const addSyllabusSchema = z.object({
    topic_name: z.string().trim().min(1, "Topic name is required"),
    completion_date: z.coerce.date("Invalid completion date"),
});

export const addBatchSyllabusTopic = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{
       const company_id = req.instructor?.company_id;
       const batch_id = req.params.batch_id as string;
       
       if(!company_id){
        throw new ApiError(
            401,
            "Invalid company Id."
        )
       }

       if(!batch_id){
        throw new ApiError(
            400,
            "Batch doesnt exist."
        )
       }

       const parsedBatchId = z.string().uuid().safeParse(batch_id);

        if (!parsedBatchId.success) {
            throw new ApiError(
                400,
                "Invalid batch id"
            );
        }

        const batch = await prisma.batch_details.findUnique({
            where: {
                batch_id: parsedBatchId.data,
            },
            select: {
                batch_id: true,
                course_details: {
                    select: {
                        company_id: true,
                    },
                },
            },
        });

        if (!batch) {
            throw new ApiError(
                404,
                "Batch not found."
            );
        }

        if (batch.course_details.company_id !== company_id) {
            throw new ApiError(
                403,
                "You don't have access to this batch."
            );
        }

       const parsedBody = addSyllabusSchema.safeParse(req.body);

        if (!parsedBody.success) {
            throw new ApiError(
                400,
                parsedBody.error.issues
                    .map((issue) => issue.message)
                    .join("; ")
            );
        }

       const { topic_name, completion_date } = parsedBody.data;

       const existingTopic = await prisma.batch_syllabus.findFirst({
            where: {
                batch_id: parsedBatchId.data,
                topic_name: {
                    equals: topic_name,
                    mode: "insensitive",
                },
            },
        });

        if (existingTopic) {
            throw new ApiError(
                409,
                "This topic already exists for the batch."
            );
        }

       const newRow = await prisma.batch_syllabus.create({
            data: {
                batch_id: parsedBatchId.data,
                topic_name,
                completion_date,
            },
        });

       return res.status(201).json(
            new ApiResponse(
                201,
                {
                    syllabus: newRow,
                },
                "Topic added successfully."
            )
        );
    }
)