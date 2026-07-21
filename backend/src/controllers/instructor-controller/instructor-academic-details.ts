import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiResponse } from "../../helpers/ApiResponse";





const instructorAcademicDetails = asyncHandler(async(req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id
    const academicDetails = await prisma.instructor_details.findUnique({
        where: {
            instructor_id: instructorId
        }, 
         select: {
            highest_qualification: true,
            specialization: true,
            instructor_university: true,
            instructor_passing_year: true,
            qualification: true,
            instructor_certificates: true,
            experience_years: true,
            instructor_prev_org_designation: true,
            instructor_prev_org: true
            
            
         }

    })


    const details = {
        education: {
            highestQualification: academicDetails?.highest_qualification,
            specialization: academicDetails?.specialization,
            university: academicDetails?.instructor_university,
            passingYear: academicDetails?.instructor_passing_year,
            additionalQualifications: academicDetails?.qualification,
            certifications: academicDetails?.instructor_certificates
        },
        experience: {
            totalExperience: academicDetails?.experience_years,
            previousOrganisation: academicDetails?.instructor_prev_org,
            role: academicDetails?.instructor_prev_org_designation,

        }
    }

    return res.json(
        new ApiResponse(200, {
            details
        }, "instructor academics details found successfully")
    )

})

export {
    instructorAcademicDetails
}