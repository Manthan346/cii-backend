import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import * as bcrypt from "bcrypt";
import { z } from "zod";

// Define the schema for validating the userId parameter (UUID)
const deleteUserSchema = z.object({
  userId: z.string().uuid("Invalid user ID format")
});

export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const adminReq = req as adminAuthRequest;
    const adminUserId = adminReq.user.user_id;

    // Validate admin is authenticated
    if (!adminUserId) {
      throw new ApiError(401, "Admin not authenticated");
    }

    // Validate the userId parameter
    const userId  = req.params.userId as string;
    const validationResult = deleteUserSchema.safeParse({ userId });
    if (!validationResult.success) {
      throw new ApiError(400, validationResult.error.issues[0].message);
    }

    const targetUserId = validationResult.data.userId;

    // Prevent admin from deleting their own account
    if (adminUserId === targetUserId) {
      throw new ApiError(
        400,
        "Admins cannot delete their own account through this endpoint"
      );
    }

    // Find admin to verify permissions and get center_id
    const admin = await prisma.user_login.findUnique({
      where: { user_id: adminUserId },
      select: {
        user_id: true,
        center_id: true,
      },
    });

    if (!admin) {
      throw new ApiError(404, "Admin user not found");
    }

    // Check if target user exists and belongs to admin's center.
    // Always select every role-specific relation — Prisma returns null
    // for whichever ones don't apply to this user's actual role, and we
    // branch on targetUser.user_role (not admin.user_role) below.
    const targetUser = await prisma.user_login.findUnique({
      where: { user_id: targetUserId },
      select: {
        user_id: true,
        user_email: true,
        user_role: true,
        center_id: true,
        is_active: true,
        admin_details: { select: { admin_id: true } },
        candidate_details: {
          select: {
            candidate_id: true,
            candidate_documents: { select: { document_id: true } },
            batch_enrollment: { select: { enrollment_id: true } },
            candidate_assessment: { select: { ca_record_id: true } },
            attendance_records: { select: { attendance_id: true } }
          }
        },
        instructor_details: {
          select: {
            instructor_id: true,
            instructor_documents: { select: { instructor_doc_id: true } }
          }
        },
        mobilizer_details: {
          select: {
            mobilizer_id: true,
            enquiry_records: { select: { enquiry_id: true } },
            enquiry_status_history: { select: { history_id: true } }
          }
        },
        hr_details: {
          select: {
            hr_id: true,
            job_events: { select: { job_event_id: true } },
            placement: { select: { placement_id: true } }
          }
        }
      },
    });

    if (!targetUser) {
      throw new ApiError(404, "User not found");
    }

    // Verify center isolation - admin can only delete users in their center
    if (targetUser.center_id !== admin.center_id) {
      throw new ApiError(
        403,
        "You are not authorized to delete this user"
      );
    }

    // Start a transaction to delete all related data
    await prisma.$transaction(async (tx) => {
      // Delete role-specific details and related data based on the target user's role
      switch (targetUser.user_role) {
        case "candidate": {
          // Delete candidate-specific data
          const candidateDetails = targetUser.candidate_details as unknown as {
            candidate_id: string;
          } | null;

          if (candidateDetails) {
            const candidateId = candidateDetails.candidate_id;
            // Delete candidate_documents
            await tx.candidate_documents.deleteMany({
              where: { candidate_id: candidateId }
            });

            // Delete batch_enrollment (enrollments for this candidate)
            await tx.batch_enrollment.deleteMany({
              where: { candidate_id: candidateId }
            });

            // Delete candidate_assessment
            await tx.candidate_assessment.deleteMany({
              where: { candidate_id: candidateId }
            });

            // Delete attendance_records
            await tx.attendance_records.deleteMany({
              where: { candidate_id: candidateId }
            });

            // Delete candidate_details
            await tx.candidates_details.delete({
              where: { candidate_id: candidateId }
            });
          }
          break;
        }

        case "instructor": {
          // Delete instructor-specific data
          if (targetUser.instructor_details) {
            // Delete instructor_documents
            await tx.instructor_documents.deleteMany({
              where: { instructor_id: targetUser.instructor_details.instructor_id }
            });

            // Set instructor_id to NULL in batch_details for all batches taught by this instructor
            await tx.batch_details.updateMany({
              where: { instructor_id: targetUser.instructor_details.instructor_id },
              data: { instructor_id: null }
            });

            // Delete instructor_details
            await tx.instructor_details.delete({
              where: { instructor_id: targetUser.instructor_details.instructor_id }
            });
          }
          break;
        }

        case "mobilizer": {
          // Delete mobilizer-specific data
          if (targetUser.mobilizer_details) {
            // Delete enquiry_status_history
            await tx.enquiry_status_history.deleteMany({
              where: { mobilizer_id: targetUser.mobilizer_details.mobilizer_id }
            });

            // Delete enquiry_records
            await tx.enquiry_records.deleteMany({
              where: { mobilizer_id: targetUser.mobilizer_details.mobilizer_id }
            });

            // Delete mobilizer_details
            await tx.mobilizer_details.delete({
              where: { mobilizer_id: targetUser.mobilizer_details.mobilizer_id }
            });
          }
          break;
        }

        case "hr": {
          // Delete HR-specific data
          if (targetUser.hr_details) {
            // Delete job_events
            await tx.job_events.deleteMany({
              where: { hr_id: targetUser.hr_details.hr_id }
            });

            // Delete placement
            await tx.placement.deleteMany({
              where: { hr_id: targetUser.hr_details.hr_id }
            });

            // Delete hr_details
            await tx.hr_details.delete({
              where: { hr_id: targetUser.hr_details.hr_id }
            });
          }
          break;
        }

        case "admin": {
          // Delete admin-specific data
          if (targetUser.admin_details) {
            // Delete admin_details
            await tx.admin_details.delete({
              where: { admin_id: targetUser.admin_details.admin_id }
            });
          }
          break;
        }

        case "super_admin": {
          // Super admin has no role-specific details to delete
          break;
        }

        default: {
          // If role is not recognized, we still delete the user_login but log a warning?
          // For safety, we'll throw an error for unknown roles.
          throw new ApiError(400, `Unknown user role: ${targetUser.user_role}`);
        }
      }

      // Finally, delete the user_login record
      await tx.user_login.delete({
        where: { user_id: targetUserId }
      });
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          userId: targetUserId,
          role: targetUser.user_role,
        },
        "User and all associated data deleted successfully"
      )
    );
  }
);