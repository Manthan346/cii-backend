import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

export const getMobilizerCandidateDetails = asyncHandler(
  async (req: MobilizerAuthRequest, res: Response) => {
    const candidateId = req.params.candidateId as string;
    const mobilizerId = req.mobilizer?.mobilizer_id;
    const centerId = req.mobilizer?.center_id;

    if (!mobilizerId || !centerId) {
      throw new ApiError(401, "Mobilizer not authenticated or center not assigned");
    }

    if (!candidateId) {
      throw new ApiError(400, "Candidate ID is required");
    }

    // Fetch candidate with related data, ensuring it belongs to the mobilizer's center
    const candidate = await prisma.candidates_details.findUnique({
      where: { candidate_id: candidateId },
      select: {
        candidate_id: true,
        candidate_first_name: true,
        candidate_last_name: true,
        candidate_unique_id: true,
        contact_number: true,
        gender: true,
        date_of_birth: true,
        education: true,
        candidate_current_address: true,
        enquiry_source: true,
        aadhar_card_no: true,
        pan_card_no: true,
        guardian_name: true,
        nearest_station: true,
        salary: true,
        training_start_date: true,
        training_end_date: true,
        job_location: true,
        candidate_status: true,
        verification_status: true,
        blood_group: true,
        category: true,
        highest_qualification: true,
        qualification_percentage: true,
        admin_approval: true,
        candidate_skills: true,
        guardian_phone_no: true,
        guardian_blood_group: true,
        guardian_relationship: true,
        guardian_occupation: true,
        guardian_address: true,
        guardian_gender: true,
        guardian_dob: true,
        father_name: true,
        father_occupation: true,
        father_phone_no: true,
        father_blood_group: true,
        father_address: true,
        mother_name: true,
        mother_occupation: true,
        mother_blood_group: true,
        mother_phone_no: true,
        mother_address: true,
        profile_photo: true,
        current_city: true,
        current_district: true,
        current_pin_code: true,
        current_state_name: true,
        permanent_city: true,
        permanent_pin_code: true,
        permanent_state_name: true,
        permanent_district: true,
        candidate_permanent_address: true,
        candidate_emergency_contact_no: true,
        created_at: true,
        updated_at: true,
        user_login: {
          select: {
            user_email: true,
            user_role: true,
            center_id: true,
          },
        },
        candidate_documents: {
          select: {
            document_id: true,
            candidate_photo: true,
            candidate_aadhar_card: true,
            candidate_pan_card: true,
            candidate_resume: true,
          },
        },
        batch_enrollment: {
          select: {
            enrollment_id: true,
            enrollment_date: true,
            grade: true,
            certificate_url: true,
            enrollment_status: true,
            batch_details: {
              select: {
                batch_id: true,
                batch_name: true,
                batch_code: true,
                batch_desc: true,
                batch_start_date: true,
                batch_end_date: true,
                max_candidates: true,
                b_status: true,
                course_details: {
                  select: {
                    course_id: true,
                    course_name: true,
                    course_desc: true,
                    course_duration: true,
                    course_mode: true,
                    company_details: {
                      select: {
                        company_id: true,
                        company_name: true,
                        company_description: true,
                      },
                    },
                  },
                },
                
              },
            },
          },
        },
        attendance_records: {
          select: {
            attendance_id: true,
            attendance_status: true,
            remarks: true,
            created_at: true,
            updated_at: true,
            attendance_session_id: true,
            time_in: true,
            time_out: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10, // latest 10 attendance records
        },
        
      },
    });

    if (!candidate) {
      throw new ApiError(404, "Candidate not found");
    }

    // Center isolation: ensure candidate belongs to the mobilizer's center
    const candidateCenterId = candidate.user_login?.center_id;
    if (candidateCenterId && candidateCenterId !== centerId) {
      throw new ApiError(403, "Access denied: candidate belongs to another center");
    }

    // Transform data for cleaner response
    const responseData = {
      ...candidate,
      // Flatten user login email
      email: candidate.user_login?.user_email || null,
      // Flatten documents
      documents: candidate.candidate_documents
        ? [{
            documentId: candidate.candidate_documents.document_id,
            photo: candidate.candidate_documents.candidate_photo,
            aadharCard: candidate.candidate_documents.candidate_aadhar_card,
            panCard: candidate.candidate_documents.candidate_pan_card,
            resume: candidate.candidate_documents.candidate_resume,
          }]
        : [],
      // Flatten batch enrollments (could be multiple)
      enrollments: candidate.batch_enrollment.map(enrollment => {
       

        return ({
        enrollmentId: enrollment.enrollment_id,
        enrollmentDate: enrollment.enrollment_date,
        grade: enrollment.grade,
        certificateUrl: enrollment.certificate_url,
        enrollmentStatus: enrollment.enrollment_status,
        batch: enrollment.batch_details
          ? {
              batchId: enrollment.batch_details.batch_id,
              batchName: enrollment.batch_details.batch_name,
              batchCode: enrollment.batch_details.batch_code,
              description: enrollment.batch_details.batch_desc,
              startDate: enrollment.batch_details.batch_start_date,
              endDate: enrollment.batch_details.batch_end_date,
              maxCandidates: enrollment.batch_details.max_candidates,
              status: enrollment.batch_details.b_status,
              course: enrollment.batch_details.course_details
                ? {
                    courseId: enrollment.batch_details.course_details.course_id,
                    courseName: enrollment.batch_details.course_details.course_name,
                    description: enrollment.batch_details.course_details.course_desc,
                    duration: enrollment.batch_details.course_details.course_duration,
                    mode: enrollment.batch_details.course_details.course_mode,
                    company: enrollment.batch_details.course_details.company_details
                      ? {
                          companyId: enrollment.batch_details.course_details.company_details.company_id,
                          companyName: enrollment.batch_details.course_details.company_details.company_name,
                          description: enrollment.batch_details.course_details.company_details.company_description,
                        }
                      : null,
                  }
                : null,
              
            }
          : null,
        });
      }),
      // Latest attendance
      recentAttendance: candidate.attendance_records,
      // Assessments
      
    };

    return res.status(200).json(
      new ApiResponse(200, responseData, "Mobilizer candidate details fetched successfully")
    );
  }
);