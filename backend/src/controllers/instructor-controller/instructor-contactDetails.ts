import { Response } from "express";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";






const instructorContactDetails = asyncHandler( async(req: InstructorAuthRequest, res: Response)=> {
    const instructorId =  req.instructor?.instructor_id
    if (!instructorId) {
        throw new ApiError(404, "user id not found")
        
    }
    const  contactDetails = await prisma.instructor_details.findUnique({
        where: {
            instructor_id: instructorId
        },
         select: {
            contact_number: true,
            emergency_contact: true,
            instructor_address: true,
            instructor_state: true,
            instructor_district: true,
            instructor_taluka: true,
            instructor_pin_code: true
            
         }

    })

    const email = req.instructor?.email

return res.json(
    new ApiResponse(200, {
        contactDetails,
        email
    })
)


})

export {
    instructorContactDetails
}