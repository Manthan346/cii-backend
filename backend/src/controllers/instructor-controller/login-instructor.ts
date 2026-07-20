import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt"
import { ApiError } from "../../helpers/ApiError";

import { generateInstructorAccessToken,generateInstructorRefreshToken } from "../../utils/instructor-jwt-auth/instructor-auth";
import { ApiResponse } from "../../helpers/ApiResponse";





const loginInstructor = asyncHandler(async(req: Request, res: Response) => {

    const {email, password, role, centerId} = req.body
 /*  console.log(process.env.DATABASE_URL);
    const result = await prisma.$queryRaw`SELECT 1`;

    console.log(result);

    return res.status(200).json({
        success:true,
        result
    });*/
    const user = await prisma.user_login.findUniqueOrThrow({
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

    if (user.center_details.center_id !== centerId) {
        throw new ApiError(404, "user doesnt exists on this center please select right center")
        
    }
    
    if (!user) {
        throw new ApiError(404, "user not found")
        
    }

    if(user.user_role !== "instructor"){
    throw new ApiError(401,"Unauthorized");
    }


    const instructor= await prisma.instructor_details.findUnique({
        where: {
            user_id: user.user_id
        },
        select: {
            instructor_id: true,
            instructor_first_name: true,
            instructor_last_name: true,

        }
    })

    if (!instructor) {
        throw new ApiError(404, "instructor details not found")
        
    }


    const convertedPassword = await bcrypt.compare(password, user.user_password)
    if (!convertedPassword) {
        throw new ApiError(401, "invalid password")
        
    }

    const accessToken= generateInstructorAccessToken({
    instructor_id: instructor?.instructor_id,
    user_id: user.user_id,
    instructor_first_name: instructor.instructor_first_name,
    center_id: user.center_details.center_id,
    centre_name: user.center_details?.center_name ?? "",
    email: user.user_email,
    instructor_last_name: instructor.instructor_last_name ?? "",

   })

   const refreshToken = generateInstructorRefreshToken({
    instructor_id: instructor.instructor_id,
    user_id: user.user_id,
    instructor_first_name: instructor.instructor_first_name,
    instructor_last_name: instructor.instructor_last_name ?? "",
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
            instructorDetails: {
                instructorId: instructor.instructor_id,
                instructorFirstName:instructor.instructor_first_name,
                instructorLastName: instructor.instructor_last_name
            },
            accessToken

        }, "user login successfully")
    )



})


export {
    loginInstructor
}