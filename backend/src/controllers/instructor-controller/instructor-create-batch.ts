import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

const createBatch = asyncHandler(async (req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id;
    const centerId = req.user.center_id;

    if (!instructorId) {
        throw new ApiError(404, "instructor id not found");
    }

    const {
        batch_name,
        batch_code,
        batch_desc,
        course_id,
        batch_start_date,
        batch_end_date,
        max_candidates,
        b_status
    } = req.body;

    if (!batch_name || typeof batch_name !== "string" || !batch_name.trim()) {
        throw new ApiError(400, "batch name is required");
    }

    if (!batch_code || typeof batch_code !== "string" || !batch_code.trim()) {
        throw new ApiError(400, "batch code is required");
    }

    if (!course_id) {
        throw new ApiError(400, "course id is required");
    }

    if (max_candidates === undefined || max_candidates === null) {
        throw new ApiError(400, "maximum candidates is required");
    }

    if (
        !Number.isInteger(Number(max_candidates)) ||
        Number(max_candidates) < 1
    ) {
        throw new ApiError(
            400,
            "maximum candidates must be a positive integer"
        );
    }

    if (!batch_start_date) {
        throw new ApiError(400, "batch start date is required");
    }

    if (!batch_end_date) {
        throw new ApiError(400, "batch end date is required");
    }

    if (batch_desc !== undefined && typeof batch_desc !== "string") {
        throw new ApiError(400, "batch description must be a string");
    }

    if (batch_desc !== undefined && batch_desc.trim().length < 1) {
        throw new ApiError(400, "batch description cannot be empty");
    }

    if (!b_status) {
        throw new ApiError(400, "batch status is required");
    }

    const startDate = new Date(batch_start_date);
    const endDate = new Date(batch_end_date);

    if (isNaN(startDate.getTime())) {
        throw new ApiError(400, "invalid batch start date");
    }

    if (isNaN(endDate.getTime())) {
        throw new ApiError(400, "invalid batch end date");
    }

    const startDateOnly = batch_start_date.substring(0, 10);
    const endDateOnly = batch_end_date.substring(0, 10);

    const today = new Date();
    const todayDateOnly = today.toISOString().substring(0, 10);

    if (startDateOnly < todayDateOnly) {
        throw new ApiError(
            400,
            "batch start date cannot be in the past."
        );
    }

    if (endDateOnly <= todayDateOnly) {
        throw new ApiError(
            400,
            "batch end date cannot be in the past and cannot be same as start date"
        );
    }

    if (endDateOnly < startDateOnly) {
        throw new ApiError(
            400,
            "batch end date cannot be before batch start date"
        );
    }

    const batch = await prisma.batch_details.create({
        data: {
            batch_name: batch_name.trim(),
            batch_code: batch_code.trim(),
            batch_desc: batch_desc ?? "",
            course_id,
            batch_start_date: startDate,
            batch_end_date: endDate,
            max_candidates: Number(max_candidates),
            batch_type: "ACADEMIC",
            b_status,
            instructor_id: instructorId,
            center_id: centerId
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                batchDetails: batch
            },
            "batch created successfully"
        )
    );
});

export {
    createBatch
};