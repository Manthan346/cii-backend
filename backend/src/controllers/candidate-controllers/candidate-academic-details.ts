import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";

const candidateAcademicDetails = asyncHandler(async(req: CandidateAuthRequest, res: Response)=> {
    const candidateId = req.candidate?.candidate_id
   const academics = await prisma.candidates_details.findUnique({
  where: { candidate_id: candidateId },
  select: {
    candidate_id: true,
    candidate_first_name: true,
    candidate_last_name: true,
    user_login: {
        select: {
            center_details: {
                select: {
                    center_name: true
                }
            }
        }
    },
    batch_enrollment: {
      select: {
        enrollment_id: true,
        enrollment_date: true,
        enrollment_status: true,
        batch_details: {
          select: {
            batch_id: true,
            batch_name: true,
            batch_start_date: true,
            batch_end_date: true,
            course_details: {
              select: {
                course_id: true,
                course_name: true,
                course_duration: true,
                course_type: true,
                company_details: {
                    select: {
                        company_name: true,
                        company_description: true
                    }
                }
                
              },
              
            }
            ,
          },
        },
      },
    },
  },
});

    return res.status(200).json(
        new ApiResponse(200, {
            academicDetails: academics
        })
    )


})

export {
    candidateAcademicDetails
}