import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";



const createCourse = asyncHandler(async(req: Request, res: Response) => {
    const {course_name, course_desc,course_duration,company_id, course_type,course_mode} = req.body
    const course = await prisma.course_details.create({
        data: {
            course_name: course_name,
            course_desc: course_desc,
            course_duration: course_duration,
            company_id: company_id,
            course_mode: course_mode
            
            
            

        }
    })
    return res.status(201).json(
        new ApiResponse(201, {
            courseDetails: course
        }, "course created successfully")
    )

})


export {
    createCourse
}