import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";


const createUser = async(req: Request,res: Response)=> {
  const {candidate_name, email,contact_no,gender,date_of_birth, education } = req.body
  
 try {
   const user  = await prisma.candidates_details.create({
     data: {
       candidate_name: candidate_name,
       email_id: email,
       contact_number: contact_no,
       gender: gender,
       date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
       education: education,
       
     }
   })
   return res.status(201).json({
    message: "user added",
    user
   })
 
 } catch (error: any) {
  console.log(error.message)
   return res.status(200).json({
    message: "failed",
    err:error.message
    
   })
  
  
 }
}

export{
  createUser
}