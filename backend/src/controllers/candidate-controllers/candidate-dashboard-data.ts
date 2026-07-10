import { Express, Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";



const candidatdeDashboardData = asyncHandler(async(req:CandidateAuthRequest , res: Response) => {
   const [enrolledCourses,totalAttendance, totalSessionAttended, average_score, best_score] = await Promise.all([
    await prisma.course_enrollment.count({
        where: {
            candidate_id: req.candidate?.candidate_id,
            
            
        }
    }),

    await prisma.attendance_records.count({
        where: {
            candidate_id: req.candidate?.candidate_id
        }
    }),
    await prisma.attendance_records.count({
        where: {
            candidate_id: req.candidate?.candidate_id,
            is_present:
            {
            in: ["present", "late"]
            }
        },

        
    }),
    


   






   ]

   )





})