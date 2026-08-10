import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { parseSyllabusExcelBuffer } from "../../utils/excel-parser/batch-syllabus-excel";
import { syllabusRowSchema } from "../../services/zod/instructor/batch-syllabus-excel-schema";
import { z } from "zod";


export const uploadSyllabus = asyncHandler(
    async (req: InstructorAuthRequest, res: Response) => {
        const instructorId = req.instructor?.instructor_id;
        const companyId = req.instructor?.company_id;
        const file = req.file;

        if (!instructorId || !companyId) {
            throw new ApiError(401, "Instructor authentication information missing");
        }

        if (!file) {
            throw new ApiError(400, "No file uploaded");
        }

        const { batch_id } = req.params;

        if (!batch_id) {
            throw new ApiError(400, "batch_id is required");
        }

        const parsedBatchId = z.string().uuid().safeParse(batch_id);

        if (!parsedBatchId.success) {
            throw new ApiError(400, "Invalid batch_id");
        }

        const batch = await prisma.batch_details.findFirst({
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
                "Batch not found"
            );
        }

        if (batch.course_details.company_id !== companyId) {
            throw new ApiError(
                403,
                "You are not authorized to upload syllabus for this batch"
            );
        }

        const rawRows = await parseSyllabusExcelBuffer(file.buffer);

        const validatedRows = [];

for (const rawRow of rawRows) {
        const parsed = syllabusRowSchema.safeParse({
            topic_name: rawRow.topic_name,
            completion_date: rawRow.completion_date,
        });

        if (!parsed.success) {
            throw new ApiError(
                400,
                `Invalid data at Excel row ${rawRow.rowNumber}: ${
                    parsed.error.issues
                        .map((issue) => issue.message)
                        .join("; ")
                }`
            );
        }

        validatedRows.push({
            ...parsed.data,
            rowNumber: rawRow.rowNumber,
        });
    }

    const rowsToInsert = validatedRows.map((row) => ({
    batch_id: parsedBatchId.data,
    topic_name: row.topic_name,
    completion_date: row.completion_date,
}));

await prisma.$transaction(async (tx) => {
    const existingSyllabus = await tx.batch_syllabus.findMany({
        where: {
            batch_id: parsedBatchId.data,
        },
        select: {
            topic_name: true,
        },
    });

    const existingTopics = new Set(
        existingSyllabus.map((syllabus) =>
            syllabus.topic_name.toLowerCase()
        )
    );

    const topicsInFile = new Set<string>();

    for (const row of rowsToInsert) {
        const topicKey = row.topic_name.toLowerCase();

        if (existingTopics.has(topicKey)) {
            throw new ApiError(
                409,
                `Topic "${row.topic_name}" already exists for this batch`
            );
        }

        if (topicsInFile.has(topicKey)) {
            throw new ApiError(
                400,
                `Duplicate topic "${row.topic_name}" found in uploaded file`
            );
        }

        topicsInFile.add(topicKey);
    }

    await tx.batch_syllabus.createMany({
        data: rowsToInsert,
    });
});

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    batch_id: parsedBatchId.data,
                    topics_created: rowsToInsert.length,
                },
                "Syllabus uploaded successfully"
            )
        );

        

    }
);