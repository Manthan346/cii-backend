import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { generateAccessToken, generateRefreshToken } from "../../utils/candidate-jwt-auth/candidate-auth";

const createCandidate = asyncHandler(async(req: Request,res: Response)=> {
  const {first_name, last_name,email_id,gender,date_of_birth, education,contact_number,centre_name,password } = req.body

  const hashPassword = await bcrypt.hash(password, 10)
  
  const emailExists = await prisma.candidates_details.findUnique({
    where: {
      email_id: email_id
    }
  })

  const contactNoExists = await prisma.candidates_details.findUnique({
    where: {
      contact_number: contact_number
    }
  })

  if (contactNoExists) {
    throw new ApiError(409, "phone number already exists")
    
  }

  if (emailExists) {
    throw new ApiError(409,"email already exists")
    
  }

   const user  = await prisma.candidates_details.create({
     data: {
       candidate_first_name: first_name,
       candidate_last_name: last_name,

       
       email_id: email_id,
       contact_number: contact_number,
       gender: gender,
       date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
       education: education,
       center_name: centre_name,
       candidate_password: hashPassword
       
     }
   })


  const accessToken= generateAccessToken({
    candidate_id: user.candidate_id,
    candidate_first_name: user.candidate_first_name,
    centre_name: user.center_name ?? "",
    email: user.email_id,
    candidate_last_name: user.candidate_last_name ?? "",





   })

   const refreshToken = generateRefreshToken({
    candidate_id: user.candidate_id,
    candidate_first_name: user.candidate_first_name,
    candidate_last_name: user.candidate_last_name ?? ""
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
   return res.status(201).json(
    new ApiResponse(201, {
      user,
      refreshToken: refreshToken
      
    }, "user added successfully")
    
   )
 
 } 
  
 
)

export{
  createCandidate
}