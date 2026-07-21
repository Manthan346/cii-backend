// import { CandidateAuthRequest } from "../../interfaces/candidate-auth-interface";
// import { asyncHandler } from "../../helpers/asyncHandler";
// import { ApiError } from "../../helpers/ApiError";
// import { ApiResponse } from "../../helpers/ApiResponse";
// import { Response } from "express";
// import prisma


//skills to be implemented later 

// export const addSkill = asyncHandler(async (req: CandidateAuthRequest, res: Response) => {
//     const { skill } = req.body;

//     if (!skill?.trim()) {
//         throw new ApiError(400, "Skill is required");
//     }

//     const profile = await prisma.candidateProfile.findUnique({
//         where: {
//             candidate_id: req.candidate?.candidate_id,
//         },
//         select: {
//             skills: true,
//         },
//     });

//     if (!profile) {
//         throw new ApiError(404, "Profile not found");
//     }

//     const normalizedSkill = skill.trim();

//     if (profile.skills.includes(normalizedSkill)) {
//         throw new ApiError(400, "Skill already exists");
//     }

//     const updated = await prisma.candidateProfile.update({
//         where: {
//             candidate_id: req.candidate?.candidate_id,
//         },
//         data: {
//             skills: {
//                 push: normalizedSkill,
//             },
//         },
//     });

//     return res.json(new ApiResponse(200, updated.skills, "Skill added"));
// });