import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { prisma } from "../../lib/prisma";





const candidateAssesments = asyncHandler(async(req: CandidateAuthRequest, res: Response)=> {
    const candidateId = req.candidate?.candidate_id

    const assesments = prisma.candidate_assessment.findMany({
        where: {
            candidate_id: candidateId
        }
    })
})