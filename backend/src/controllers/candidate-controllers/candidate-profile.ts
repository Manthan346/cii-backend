import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";




const candidateProfileDetails = asyncHandler(async(req: CandidateAuthRequest, res:Response )=> {
    const userId  = req.user.user_id

    if (!userId) {
        throw new ApiError(404, "user id not found")
        
    }
    const candidateProfile = await prisma.candidates_details.findUniqueOrThrow({
        where: {
            user_id: userId
        },
        select: {
            candidate_first_name: true,
            candidate_last_name: true,
            contact_number: true,
            gender: true,
            category: true,
            user_login: {
                select: {
                    user_email: true,

                }
                
            },
            date_of_birth: true,
            blood_group: true,
            candidate_address: true,
            state_name: true,
            district: true,
            pin_code: true,

        }
    })


    return res.status(200).json(
        new ApiResponse(200, {
            personalInfo: candidateProfile

        }, "user profile found successfully")
    )


})

export {
    candidateProfileDetails
}