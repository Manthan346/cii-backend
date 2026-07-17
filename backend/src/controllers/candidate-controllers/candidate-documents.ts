import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { prisma } from "../../lib/prisma";
import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
import { uploadCloudnary } from "../../services/cloudinary";


export const candidateCertificateUpload = asyncHandler(
  async (req: CandidateAuthRequest, res: Response) => {


    const candidateId = req.candidate?.candidate_id;


    if (!candidateId) {
      throw new ApiError(404, "Candidate details not found");
    }



    // Multer files
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };



    if (!files) {
      throw new ApiError(400, "Please upload documents");
    }



    const aadharFile =
      files?.aadhar_card?.[0]?.path;


    const panFile =
      files?.pan_card?.[0]?.path;


    const photoFile =
      files?.passport_size_photo?.[0]?.path;


    const resumeFile =
      files?.resume?.[0]?.path;




    // Upload to Cloudinary

    const aadharUpload =
      aadharFile
        ? await uploadCloudnary(aadharFile)
        : null;


    const panUpload =
      panFile
        ? await uploadCloudnary(panFile)
        : null;


    const photoUpload =
      photoFile
        ? await uploadCloudnary(photoFile)
        : null;


    const resumeUpload =
      resumeFile
        ? await uploadCloudnary(resumeFile)
        : null;




    // Save URLs in Database

    const documents =
      await prisma.candidate_documents.upsert({
        where: {
            candidate_id: candidateId
        },
        create: {
            
          candidate_aadhar_card:
            aadharUpload?.secure_url ?? undefined,


          candidate_pan_card:
            panUpload?.secure_url ?? undefined,


          candidate_photo:
            photoUpload?.secure_url ?? undefined,


          candidate_resume:
            resumeUpload?.secure_url ?? undefined,
            candidate_id: candidateId
        },
        update: {
            
          candidate_aadhar_card:
            aadharUpload?.secure_url ?? undefined,


          candidate_pan_card:
            panUpload?.secure_url ?? undefined,


          candidate_photo:
            photoUpload?.secure_url ?? undefined,


          candidate_resume:
            resumeUpload?.secure_url ?? undefined,
            candidate_id: candidateId
        },


        
    

      });




    return res.status(200).json(

      new ApiResponse(
        200,
        documents,
        "Candidate documents uploaded successfully"
      )

    );

  }
);

