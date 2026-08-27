import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { role_types, batch_enrollment_status_type } from "../../generated/prisma/enums";
import { uploadCloudnary } from "../../services/cloudinary";
import { z } from "zod";

export const uploadCandidateCertificate = asyncHandler(
    async (req: Request, res: Response) => {
        const adminReq = req as adminAuthRequest;
        const adminUserId = adminReq.user.user_id;

        const candidateResult = z.string().uuid().safeParse(req.params.candidateId);
        const enrollmentResult = z.string().uuid().safeParse(req.params.enrollmentId);

        if (!candidateResult.success || !enrollmentResult.success) {
            throw new ApiError(400, "Invalid candidate or enrollment ID.");
        }

        if (!req.file) {
            throw new ApiError(400, "Certificate file is required.");
        }

        const admin = await prisma.user_login.findUnique({
            where: { user_id: adminUserId },
            select: {
                user_role: true,
                center_id: true
            }
        });

        if (!admin) {
            throw new ApiError(404, "Admin user not found.");
        }

        if (admin.user_role !== role_types.admin) {
            throw new ApiError(403, "Unauthorized.");
        }

        const enrollment = await prisma.batch_enrollment.findFirst({
            where: {
                enrollment_id: enrollmentResult.data,
                candidate_id: candidateResult.data,
                candidates_details: {
                    user_login: {
                        center_id: admin.center_id
                    }
                }
            },
            select: {
                enrollment_id: true,
                candidate_id: true,
                batch_id: true,
                enrollment_status: true,
                certificate_url: true,
                batch_details: {
                    select: {
                        batch_code: true,
                        course_details: {
                            select: {
                                course_name: true
                            }
                        }
                    }
                }
            }
        });

        if (!enrollment) {
            throw new ApiError(404, "Candidate enrollment not found.");
        }

        if (
            enrollment.enrollment_status !==
            batch_enrollment_status_type.ACTIVE
        ) {
            throw new ApiError(
                400,
                "Certificate can only be uploaded for an active enrollment."
            );
        }

        if (enrollment.certificate_url) {
            throw new ApiError(
                409,
                "Certificate has already been uploaded for this enrollment."
            );
        }

        const cloudinaryResponse = await uploadCloudnary(req.file.path);

        if (!cloudinaryResponse?.secure_url) {
            throw new ApiError(500, "Failed to upload certificate.");
        }

        const updatedEnrollment = await prisma.batch_enrollment.update({
            where: {
                enrollment_id: enrollment.enrollment_id
            },
            data: {
                certificate_url: cloudinaryResponse.secure_url
            },
            select: {
                enrollment_id: true,
                candidate_id: true,
                batch_id: true,
                enrollment_status: true,
                certificate_url: true,
                batch_details: {
                    select: {
                        batch_code: true,
                        course_details: {
                            select: {
                                course_name: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedEnrollment,
                "Certificate uploaded successfully."
            )
        );
    }
);