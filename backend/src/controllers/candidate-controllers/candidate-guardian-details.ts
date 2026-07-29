import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";




const candidateGuardianDetails = asyncHandler(async(req: CandidateAuthRequest, res: Response) => {
    const candidateId = req.candidate?.candidate_id
    const guardianDetails = await prisma.candidates_details.findUnique({
        where: {
            candidate_id: candidateId
        },
        select: {
            guardian_name: true,
            guardian_relationship: true,
            guardian_blood_group: true,
            guardian_occupation: true,
            guardian_phone_no: true,
            guardian_address: true,
            guardian_gender: true,
            guardian_dob: true
             
        }
    })

    return res.status(200).json(
        new ApiResponse(200, {
            guardianDetails
        }, "guardians details found successfully")
    )

})

 export {
    candidateGuardianDetails
 }