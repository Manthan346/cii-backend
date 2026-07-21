import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";






const intructorProfileDetails = asyncHandler(async(req: InstructorAuthRequest, res: Response)=> {
    const instructorId  = req.instructor?.instructor_id

    if (!instructorId) {
        throw new ApiError(404, "instructor id not found")
        
    }
    const profile = await prisma.instructor_details.findUnique({
        where: {
            instructor_id: instructorId
        },
        select: {
            instructor_first_name: true,
            instructor_last_name: true,
            date_of_birth: true,
            instructor_blood_group: true,
            qualification: true,
            gender:true,
            highest_qualification: true,
            instructor_guardian_name: true,
            instructor_guardian_relationship: true,
            instructor_guardian_contact_no: true,
            instructor_guardian_occupation: true,
            instructor_guardian_address: true
            

            
           
            
            
        }
        
    })

    if (!profile) {
        throw new ApiError(404, "instructor profile not found")
        
    }

    const basicInformation = {
        personalInformation: {
            name: ` ${profile?.instructor_first_name} ${profile?.instructor_last_name}`,
            gender: profile?.gender,
            dateOfBirth: profile?.date_of_birth,
            bloodGroup: profile?.instructor_blood_group,
            highestQualification: profile?.highest_qualification
        },
        guardianInformation: {
            name: profile?.instructor_guardian_name,
            relationship: profile?.instructor_guardian_relationship,
            mobileNo: profile?.instructor_guardian_contact_no,
            occupation: profile?.instructor_guardian_occupation,
            address: profile?.instructor_guardian_address
        }

        
    }

    return res.json(
        new ApiResponse(200, {
            basicInformation


        }, "instructor basic information found successfully")
    )

})

export {
    intructorProfileDetails
}