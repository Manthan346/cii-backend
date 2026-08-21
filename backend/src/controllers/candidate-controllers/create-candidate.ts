import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";

import { generateAccessToken, generateRefreshToken } from "../../utils/candidate-jwt-auth/candidate-auth";
import { getNextSequence, buildStudentId } from "../../utils/candidate-utils/generate-student-id";

const createCandidate = asyncHandler(async(req: Request,res: Response)=> {
  const {first_name, last_name,email_id,contact_number,center_id,password } = req.body

  const hashPassword = await bcrypt.hash(password, 10)
    const MAX_RETRIES = 5;
  let lastError: any;

  const [emailExists, contactNoExists, centreName] = await Promise.all([
  prisma.user_login.findUnique({
    where: { user_email: email_id },
  }),
  prisma.candidates_details.findUnique({
    where: { contact_number },
  }),
  prisma.center_details.findUnique({
    where: { center_id },
    select: {
      center_name: true,
    },
  }),
   await prisma.center_details.findUnique({
    where: {
      center_id: center_id
    }, 
    select: {
      center_name: true
    }
  })
]);

  if (contactNoExists) {
    throw new ApiError(409, "phone number already exists")
    
  }

  if (emailExists) {
    throw new ApiError(409,"email already exists")
    
  }

  for(let attempt= 0; attempt< MAX_RETRIES; attempt++){
    try {
     const { user, candidate } = await prisma.$transaction(async (tx) => {
  const user = await tx.user_login.create({
    data: {
      user_email: email_id,
      user_password: hashPassword,
      center_id: center_id,
      user_role: "candidate",
    },
  });

       const sequence = await getNextSequence(tx, centreName!.center_name.toUpperCase().slice(0,3));
        const studentUniqueId = buildStudentId(sequence, centreName!.center_name.toUpperCase().slice(0,3));

  const candidate = await tx.candidates_details.create({
    data: {
      candidate_first_name: first_name,
      candidate_last_name: last_name,
      candidate_unique_id: studentUniqueId,


      contact_number,
      user_id: user.user_id, // or user.id depending on your schema
    },
  });


  return { user, candidate };
});



  const accessToken= generateAccessToken({
    candidate_id: candidate.candidate_id,
    candidate_first_name: candidate.candidate_first_name,
    center_id: center_id,
    user_id: user.user_id,
    centre_name: centreName?.center_name ?? "",
    role: user.user_role,
    email: user.user_email,
    candidate_last_name: candidate.candidate_last_name ?? "",
   })

   const refreshToken = generateRefreshToken({
    candidate_id: candidate.candidate_id,
    role: user.user_role,
    user_id: user.user_id,
    candidate_first_name: candidate.candidate_first_name,
    candidate_last_name: candidate.candidate_last_name ?? "",
    center_id: center_id
   })

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await prisma.user_login.update({
      where:{
        user_id: user.user_id
        
      },
      data: {
        refresh_token_hash: refreshTokenHash
      }
      
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
      userId: user.user_id,
      userEmail: user.user_email,
      userRole: user.user_role,
      userCenterId: user.center_id,
      candidate,
      accessToken: accessToken

    }, "user added successfully")

   ) // success → return


   } catch (error: any) {
      // P2002 = unique-constraint violation (duplicate candidate_unique_id race)
      // Retry the whole transaction; recomputes the per-center-per-day sequence.
      if (error?.code === "P2002" && attempt < MAX_RETRIES - 1) {
        lastError = error;
        continue;
      }
      throw error;
   }
  }
  


   




 
 } 
  
 
)

export{
  createCandidate
}