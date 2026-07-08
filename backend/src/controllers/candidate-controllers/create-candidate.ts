import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";


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
   return res.status(201).json(
    new ApiResponse(201, {
      user,
      
    }, "user added successfully")
    
   )
 
 } 
  
 
)

export{
  createCandidate
}