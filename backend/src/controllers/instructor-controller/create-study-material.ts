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

export const createStudyMaterial = asyncHandler(
    async(req:InstructorAuthRequest,res:Response)=>{

        const {batch_id,title,description,document_link} = req.body;
        const trimmedTitle = title.trim();
        const trimmedDescription =
        description?.trim() ?? null;
        const trimmedDocumentLink =
        document_link.trim();

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
                "Study material can only be uploaded for active batches."
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
                        "You are not authorized to upload study material for this batch."
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

                        "You are not authorized to upload study material for this batch."

                    );

                }

            break;

            case "super_admin":

                // validations

            break;


            default:

                throw new ApiError(
                    403,
                    "You are not authorized to upload study materials."
                );

        }
        
        

        const result = await prisma.$transaction(
            async(tx)=>{
            const studyMaterial =await tx.study_material.create({
                        data:{
                            batch_id,
                            uploaded_by:user_id,
                            title:trimmedTitle,
                            description:
                            trimmedDescription,
                            document_link:
                            trimmedDocumentLink,
                            is_show:true
                        }
                    });
                    
            // Notifications are sent only to active enrolled students.
            const notification =await tx.notifications.create({

                data:{
                    title:
                    "New Study Material Uploaded",
                    notification_message:
`New study material "${trimmedTitle}" has been uploaded for batch "${batch.batch_name}".`,
                    notification_type:
                    notification_type.STUDY_MATERIAL_UPLOADED,
                    reference_type:
                    notification_reference_type.STUDY_MATERIAL,
                    reference_id:
                    studyMaterial.study_material_id,

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

            return {studyMaterial,notification};
                }
            );

            
        
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    study_material_id:
                    result.studyMaterial.study_material_id,
                    title:
                    result.studyMaterial.title
                },
                "Study material uploaded successfully."
            )
        );

    }
)