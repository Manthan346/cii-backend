import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import {
    batch_status,notification_type,notification_reference_type
}
from "../../generated/prisma/enums";

export const createAssessment = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{

        const {batch_id,title,assessment_desc,assessment_type,assessment_date,questions, assessment_duration,assessment_link} = req.body;
        const trimmedTitle = title.trim();
        const trimmedDescription =
        assessment_desc?.trim() ?? null;
        const trimmedAssessmentLink =
        assessment_link?.trim() ?? null;

        const user_id = req.user?.user_id;
        if(!user_id){
            throw new ApiError(
                401,
                "Unauthorized access."
            );
        }

        const user = await prisma.user_login.findUnique({
            where:{
                user_id
            },
            select:{
                user_role:true,
                center_id:true
            }
        });

        if(!user){
            throw new ApiError(
                404,
                "User not found."
            );
        }

        const batch =await prisma.batch_details.findUnique({
            where:{
                batch_id
            },
            include:{
                course_details:{
                    include:{
                        company_details:true
                    }
                }
            }
        });

        if(!batch){
            throw new ApiError(
                404,
                "Batch not found."
            );
        }

        if(batch.b_status !== batch_status.ACTIVE){
            throw new ApiError(
                400,
                "Assessment can only be  created for active batches."
            );
        }
        // Fetch enrolled students before beginning the transaction.
        const enrolledStudents = await prisma.batch_enrollment.findMany({
            where:{
                batch_id,
                enrollment_status:"ACTIVE"
            },
            select:{
                candidates_details:{
                    select:{
                        user_id:true
                    }
                }
            }
        });

        
        
        

        switch(user.user_role){
            case "instructor":
                if(
                    batch.instructor_id !==
                    req.instructor?.instructor_id
                ){
                    throw new ApiError(
                        403,
                        "You are not authorized to create assessment for this batch."
                    );
                }
            break;


            case "admin":
                if(
                    batch.center_id
                    !==
                    user.center_id
                ){

                    throw new ApiError(

                        403,

                        "You are not authorized to create assessment for this batch."

                    );

                }

            break;

            case "super_admin":

                // validations

            break;


            default:

                throw new ApiError(
                    403,
                    "You are not authorized to create assessment."
                );

        }
        
        const assessmentDate = new Date(assessment_date)

        const result = await prisma.$transaction(
            async(tx)=>{
            const assessment =await tx.assessments.create({
                        data:{
                            batch_id,
                            title:trimmedTitle,
                            assessment_desc:
                            trimmedDescription,
                            assessment_link:
                            trimmedAssessmentLink,
                            is_show:true,
                            assessment_date:assessmentDate,
                            assessment_type,
                            assessment_duration,
                            questions
                            

                        }
                    });
                    
            // Notifications are sent only to active enrolled students.
            const notification =await tx.notifications.create({

                data:{
                    title:
                    "New Assessment Created",
                    notification_message:
`New Assessment "${trimmedTitle}" has been created for batch "${batch.batch_name}".`,
                    notification_type:
                    notification_type.ASSESSMENT_CREATED,
                    reference_type:
                    notification_reference_type.ASSESSMENT,
                    reference_id:
                    assessment.assessment_id
                }
            });

            const userNotifications = enrolledStudents.map((student)=>({
                notification_id:
                notification.notification_id,
                user_id:student.candidates_details.user_id,
            }));
             // Skip user notification creation if no students are enrolled.
            if(userNotifications.length > 0){
                await tx.user_notifications.createMany({
                    data:userNotifications
                });
            }

            return {assessment,notification};
                }
            );

            
        
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    assessment_id:
                    result.assessment.assessment_id,
                    title:
                    result.assessment.title,
                    created_by:user_id
                },
                "Assessment created successfully."
            )
        );

    }
)