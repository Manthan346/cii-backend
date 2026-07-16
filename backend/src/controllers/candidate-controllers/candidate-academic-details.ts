import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { tr } from "zod/v4/locales";

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
            instructor: {
                select: {
                    instructor_first_name: true,
                    instructor_last_name: true,

                }
            },

            
            course_details: {
              select: {
                course_id: true,
                course_name: true,
                course_duration: true,
                course_type: true,
                course_desc: true,
                course_mode: true,
                company_details: {
                    select: {
                        company_name: true,
                        
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

// const instructorName  = await prisma.instructor_details.findUnique({
//     where: {
//         instructor_id: 
//     }
// }) 

const academicDetails = {
  candidate_id: candidateId,
  candidate_name: `${academics?.candidate_first_name} ${academics?.candidate_last_name}`,
  center_name: academics?.user_login.center_details.center_name,
  
  
  courses: academics?.batch_enrollment.map((enrollment) => ({
    title: enrollment.batch_details.batch_name,
    course: enrollment.batch_details.course_details!.course_name,
    company: enrollment.batch_details.course_details!.company_details.company_name,
    mode: enrollment.batch_details.course_details?.course_mode,
    
    location: academics.user_login.center_details.center_name,
    enrolled_date: enrollment.enrollment_date,
    starting_date: enrollment.batch_details.batch_start_date,
    end_date: enrollment.batch_details.batch_end_date,
   trainer_name: enrollment.batch_details.instructor
  ? `${enrollment.batch_details.instructor.instructor_first_name} ${enrollment.batch_details.instructor.instructor_last_name}`
  : null,
    supervisor_name:
       enrollment.batch_details.instructor
  ? `${enrollment.batch_details.instructor.instructor_first_name} ${enrollment.batch_details.instructor.instructor_last_name}`
  : null,
    description:
      enrollment.batch_details.course_details?.course_desc
  })),
};


    return res.status(200).json(
        new ApiResponse(200, {
              academicDetails 
        
        
        }, "candidate Profile fetched successfully")
    )


})

export {
    candidateAcademicDetails
}