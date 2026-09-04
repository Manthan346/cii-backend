import { Response, Request } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const getMobilizerCandidateDetailById = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const mobilizerId = req.mobilizer?.mobilizer_id;
    const centerId = req.mobilizer?.center_id;
    const candidateId = req.params.candidateId;

    if (!mobilizerId || !centerId) {
      throw new ApiError(401, "Mobilizer not authenticated or center not assigned");
    }

    if (!candidateId) {
      throw new ApiError(400, "Candidate ID is required");
    }

    // Fetch the specific candidate with full profile details
    const candidate = await prisma.candidates_details.findUnique({
      where: {
        candidate_id: candidateId,
        user_login: {
          center_id: centerId,
        },
      },
      select: {
        candidate_id: true,
        candidate_first_name: true,
        candidate_last_name: true,
        candidate_unique_id: true,
        contact_number: true,
        gender: true,
        date_of_birth: true,
        blood_group: true,
        category: true,
        highest_qualification: true,
        qualification_percentage: true,
        education: true,
        candidate_status: true,
        verification_status: true,
        created_at: true,
        updated_at: true,
        user_login: {
          select: {
            email: true,
            is_active: true,
          },
        },
        // Include candidate documents
        candidate_documents: {
          select: {
            document_id: true,
            candidate_photo: true,
            candidate_aadhar_card: true,
            candidate_pan_card: true,
            candidate_resume: true,
          },
        },
        // Include batch enrollments with batch and course details
        batch_enrollments: {
          select: {
            enrollment_id: true,
            enrollment_date: true,
            enrollment_status: true,
            grade: true,
            certificate_url: true,
            batch_details: {
              select: {
                batch_id: true,
                batch_name: true,
                batch_code: true,
                batch_start_date: true,
                batch_end_date: true,
                b_status: true,
                course_details: {
                  select: {
                    course_id: true,
                    course_name: true,
                    course_mode: true,
                  },
                },
                center_details: {
                  select: {
                    center_id: true,
                    center_name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            enrollment_date: "desc",
          },
        },
      },
    });

    // Check if candidate exists and belongs to mobilizer's center
    if (!candidate) {
      throw new ApiError(404, "Candidate not found or not authorized to access this candidate");
    }

    // Transform the data for response (similar to the list endpoint but for single candidate)
    // Get the primary document info
    const documents = candidate.candidate_documents || [];
    const primaryDoc = documents[0] || {};

    // Get the latest/enrollment info
    const enrollments = candidate.batch_enrollments || [];
    const latestEnrollment = enrollments[0] || {};

    // Build course info from latest enrollment
    const courseInfo = latestEnrollment.batch_details?.course_details || {};
    const batchInfo = latestEnrollment.batch_details || {};

    const candidateData = {
      candidate_id: candidate.candidate_id,
      candidate_unique_id: candidate.candidate_unique_id,
      full_name: `${candidate.candidate_first_name} ${candidate.candidate_last_name}`.trim(),
      contact_number: candidate.contact_number,
      email_id: candidate.user_login?.email || "",
      is_active: candidate.user_login?.is_active || false,

      // Personal details
      gender: candidate.gender,
      date_of_birth: candidate.date_of_birth,
      blood_group: candidate.blood_group,
      category: candidate.category,
      highest_qualification: candidate.highest_qualification,
      qualification_percentage: candidate.qualification_percentage,
      education: candidate.education,
      candidate_status: candidate.candidate_status,
      verification_status: candidate.verification_status,

      // Document info (all documents)
      documents: documents.map((doc: any) => ({
        document_id: doc.document_id,
        candidate_photo: doc.candidate_photo,
        candidate_aadhar_card: doc.candidate_aadhar_card,
        candidate_pan_card: doc.candidate_pan_card,
        candidate_resume: doc.candidate_resume,
      })),

      // Enrollment info (all enrollments)
      enrollments: enrollments.map((enrollment: any) => ({
        enrollment_id: enrollment.enrollment_id,
        enrollment_date: enrollment.enrollment_date,
        enrollment_status: enrollment.enrollment_status,
        grade: enrollment.grade,
        certificate_url: enrollment.certificate_url,
        batch_details: {
          batch_id: enrollment.batch_details.batch_id,
          batch_name: enrollment.batch_details.batch_name,
          batch_code: enrollment.batch_details.batch_code,
          batch_start_date: enrollment.batch_details.batch_start_date,
          batch_end_date: enrollment.batch_details.batch_end_date,
          batch_status: enrollment.batch_details.b_status,
          course_details: {
            course_id: enrollment.batch_details.course_details.course_id,
            course_name: enrollment.batch_details.course_details.course_name,
            course_type: enrollment.batch_details.course_details.course_mode,
          }
        }
      })),

      // Also include latest/most recent info for backward compatibility
      latest_enrollment: {
        enrollment_id: latestEnrollment.enrollment_id,
        enrollment_date: latestEnrollment.enrollment_date,
        enrollment_status: latestEnrollment.enrollment_status,
        grade: latestEnrollment.grade,
        certificate_url: latestEnrollment.certificate_url,
      },

      latest_batch: {
        batch_id: batchInfo.batch_id,
        batch_name: batchInfo.batch_name,
        batch_code: batchInfo.batch_code,
        batch_start_date: batchInfo.batch_start_date,
        batch_end_date: batchInfo.batch_end_date,
        batch_status: batchInfo.b_status,
      },

      latest_course: {
        course_id: courseInfo.course_id,
        course_name: courseInfo.course_name,
        course_type: courseInfo.course_mode,
      },

      // Timestamps
      created_at: candidate.created_at,
      updated_at: candidate.updated_at,
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          candidate: candidateData,
        },
        "Mobilizer candidate detail fetched successfully"
      )
    );
  }
);