import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

// to edit particular batch details

const editBatchDetails = asyncHandler(async (req: Request, res: Response) => {
    const {
        batch_name,
        batch_code,
        batch_desc,
        batch_start_date,
        batch_end_date,
        max_candidates,
        batch_type,
        batch_status
    } = req.body;

    const batchId = req.params.batchId as string;

    if (!batchId) {
        throw new ApiError(
            404,
            "batch id not found please provide a batch id"
        );
    }

    const existingBatch = await prisma.batch_details.findUnique({
        where: {
            batch_id: batchId
        },
        include: {
            _count: {
                select: {
                    batch_enrollment: true
                }
            }
        }
    });

    if (!existingBatch) {
        throw new ApiError(404, "batch not found");
    }

    const updatedBatchName =
        batch_name !== undefined
            ? batch_name
            : existingBatch.batch_name;

    const updatedBatchCode =
        batch_code !== undefined
            ? batch_code
            : existingBatch.batch_code;

    const updatedBatchDesc =
        batch_desc !== undefined
            ? batch_desc
            : existingBatch.batch_desc;

    const updatedStartDate =
        batch_start_date !== undefined
            ? batch_start_date
            : existingBatch.batch_start_date;

    const updatedEndDate =
        batch_end_date !== undefined
            ? batch_end_date
            : existingBatch.batch_end_date;

    const updatedMaxCandidates =
        max_candidates !== undefined
            ? max_candidates
            : existingBatch.max_candidates;

    const updatedBatchType =
        batch_type !== undefined
            ? batch_type
            : existingBatch.batch_type;

    const updatedBatchStatus =
        batch_status !== undefined
            ? batch_status
            : existingBatch.b_status;

    if (
        !updatedBatchName ||
        typeof updatedBatchName !== "string" ||
        !updatedBatchName.trim()
    ) {
        throw new ApiError(400, "batch name is required");
    }

    if (
        !updatedBatchCode ||
        typeof updatedBatchCode !== "string" ||
        !updatedBatchCode.trim()
    ) {
        throw new ApiError(400, "batch code is required");
    }

    if (typeof updatedBatchDesc !== "string") {
        throw new ApiError(400, "batch description must be a string");
    }

    if (updatedBatchDesc.trim().length < 1) {
        throw new ApiError(400, "batch description cannot be empty");
    }

    if (
        !Number.isInteger(Number(updatedMaxCandidates)) ||
        Number(updatedMaxCandidates) < 1
    ) {
        throw new ApiError(
            400,
            "maximum candidates must be a positive integer"
        );
    }

    const finalMaxCandidates = Number(updatedMaxCandidates);

    const totalCandidates = existingBatch._count.batch_enrollment;

    if (finalMaxCandidates < totalCandidates) {
        throw new ApiError(
            400,
            `maximum candidates cannot be less than total enrolled candidates (${totalCandidates})`
        );
    }

    if (!updatedStartDate) {
        throw new ApiError(400, "batch start date is required");
    }

    if (!updatedEndDate) {
        throw new ApiError(400, "batch end date is required");
    }

    const startDate = new Date(updatedStartDate);
    const endDate = new Date(updatedEndDate);

    if (isNaN(startDate.getTime())) {
        throw new ApiError(400, "invalid batch start date");
    }

    if (isNaN(endDate.getTime())) {
        throw new ApiError(400, "invalid batch end date");
    }

    const startDateOnly =
        typeof updatedStartDate === "string"
            ? updatedStartDate.substring(0, 10)
            : startDate.toISOString().substring(0, 10);

    const endDateOnly =
        typeof updatedEndDate === "string"
            ? updatedEndDate.substring(0, 10)
            : endDate.toISOString().substring(0, 10);

    const today = new Date();
    const todayDateOnly = today.toISOString().substring(0, 10);

    if (
        batch_start_date !== undefined &&
        startDateOnly < todayDateOnly
    ) {
        throw new ApiError(
            400,
            "batch start date cannot be in the past"
        );
    }

    if (
        batch_end_date !== undefined &&
        endDateOnly < todayDateOnly
    ) {
        throw new ApiError(
            400,
            "batch end date cannot be in the past"
        );
    }

    if (
        (batch_start_date !== undefined ||
            batch_end_date !== undefined) &&
        endDateOnly <= startDateOnly
    ) {
        throw new ApiError(
            400,
            "batch end date must be after batch start date"
        );
    }

    if (!updatedBatchType) {
        throw new ApiError(400, "batch type is required");
    }

    if (!updatedBatchStatus) {
        throw new ApiError(400, "batch status is required");
    }

    const batch = await prisma.batch_details.update({
        where: {
            batch_id: batchId
        },
        data: {
            batch_name: updatedBatchName.trim(),
            batch_code: updatedBatchCode.trim(),
            batch_desc: updatedBatchDesc.trim(),
            batch_start_date: startDate,
            batch_end_date: endDate,
            max_candidates: finalMaxCandidates,
            batch_type: updatedBatchType,
            b_status: updatedBatchStatus
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                updatedBatchDetails: batch
            },
            "batch updated successfully"
        )
    );
});

export {
    editBatchDetails
};