import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { prisma } from "../../lib/prisma";
import { uploadCloudnary } from "../../services/cloudinary";
import { ApiResponse } from "../../helpers/ApiResponse";







const instructorDocuments = asyncHandler(async(req: InstructorAuthRequest, res: Response) => {
    const instructorId = req.instructor?.instructor_id

      const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    console.log("files",files)

    const pastExpLetter =  files?.past_exp_letter[0]?.path
    const panCard = files?.pan_card[0]?.path
    const aadhar_card = files?.aadhar_card[0]?.path
    const instructor_resume = files?.instructor_resume[0].path

    console.log("pancard from files",panCard)

    const expLetterUpload = pastExpLetter ?  await uploadCloudnary(pastExpLetter) : null
    const panCardUpload = panCard ? await uploadCloudnary(panCard) : null
    const aadharUpload = aadhar_card ? await uploadCloudnary(aadhar_card) : null
    const instructorResumeUpload = instructor_resume ? await uploadCloudnary(instructor_resume) : null


    const documents = await prisma.instructor_documents.upsert({
        where: {
            instructor_id: instructorId
        },
        create: {
            past_exp_letter: expLetterUpload?.secure_url ?? undefined,
            pan_card: panCardUpload?.secure_url ?? undefined,
            aadhar_card: aadharUpload?.secure_url ?? undefined,
            instructor_resume: instructorResumeUpload?.secure_url ?? undefined,
            instructor_id: instructorId
            
        },
        update: {
             past_exp_letter: expLetterUpload?.secure_url ?? undefined,
            pan_card: panCardUpload?.secure_url ?? undefined,
            aadhar_card: aadharUpload?.secure_url ?? undefined,
            instructor_resume: instructorResumeUpload?.secure_url ?? undefined,
            instructor_id: instructorId

        }
    })
    return res.json(
        new ApiResponse(200, {
            documents
        }, "instructor documents found successfully")
    )

})

export {
    instructorDocuments
}