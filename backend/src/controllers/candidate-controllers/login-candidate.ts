import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
import { ApiError } from "../../helpers/ApiError";
import { generateAccessToken, generateRefreshToken } from "../../utils/candidate-jwt-auth/candidate-auth";
import { ApiResponse } from "../../helpers/ApiResponse";





const loginCandidate = asyncHandler(async(req: Request, res: Response) => {

    const {email, password, role, centerId} = req.body
    const user = await prisma.user_login.findUnique({
        where: {
            user_email: email

        },
        select: {
            user_password: true,
            user_id: true,
            user_role: true,
            center_details: {
                select: {
                    center_name: true,
                    center_id: true
                }
            },
            user_email: true
        }
    })

    if (role !== "candidate") {
        throw new ApiError(401, "invalid role")
        
    }

    if (user?.center_details.center_id !== centerId) {
        throw new ApiError(404, "user doesnt exists on this center please select right center")
        
    }
    
    if (!user) {
        throw new ApiError(404, "user not found")
        
    }


    const candidate= await prisma.candidates_details.findUnique({
        where: {
            user_id: user.user_id
        },
        select: {
            candidate_id: true,
            candidate_first_name: true,
            candidate_last_name: true,

        }
    })

    if (!candidate) {
        throw new ApiError(404, "candidate details not found")
        
    }


    const convertedPassword = await bcrypt.compare(password, user.user_password)
    if (!convertedPassword) {
        throw new ApiError(401, "invalid password")
        
    }

    const accessToken= generateAccessToken({
    candidate_id: candidate?.candidate_id,
    user_id: user.user_id,
    candidate_first_name: candidate.candidate_first_name,
    center_id: user.center_details.center_id,
    centre_name: user.center_details?.center_name ?? "",
    email: user.user_email,
    candidate_last_name: candidate.candidate_last_name ?? "",

   })

   const refreshToken = generateRefreshToken({
    candidate_id: candidate.candidate_id,
    user_id: user.user_id,
    candidate_first_name: candidate.candidate_first_name,
    candidate_last_name: candidate.candidate_last_name ?? "",
    center_id: user.center_details.center_id
   })

   res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000
    })
       res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json(
        new ApiResponse(200, {
            userDetails: {
                userId: user.user_id,
                email: user.user_email,
                role: user.user_role,
                centerDetails: user.center_details,
                
                

            },
            candidateDetails: {
                candidateId: candidate.candidate_id,
                candidateFirstName: candidate.candidate_first_name,
                candidateLastName: candidate.candidate_last_name

            },
            accessToken

        }, "user login successfully")
    )



})


export {
    loginCandidate
}