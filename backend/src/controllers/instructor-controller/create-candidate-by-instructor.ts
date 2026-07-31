import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import bcrypt from "bcrypt"

export const createCandidateByInstructor = asyncHandler(
    async(req:InstructorAuthRequest,res:Response) => {

        console.log(req.body);
        const {
                first_name,
                last_name,
                email_id,
                contact_number,
                password
            } = req.body;

        const {center_id} = req.user ;

        const [emailExists, contactExists] = await Promise.all([
            prisma.user_login.findUnique({
                where: {
                    user_email: email_id,
                },
            }),

            prisma.candidates_details.findUnique({
                where: {
                    contact_number,
                },
            }),
        ]);

        if (emailExists) {
            throw new ApiError(409, "Email already exists.");
        }

        if (contactExists) {
            throw new ApiError(409, "Contact number already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { user, candidate } = await prisma.$transaction(
            async (tx) => {

                const user = await tx.user_login.create({
                    data: {
                        user_email: email_id,
                        user_password: hashedPassword,
                        user_role: "candidate",
                        center_id,
                    },
                });

        const candidate = await tx.candidates_details.create({
                    data: {
                        candidate_first_name: first_name,
                        candidate_last_name: last_name,
                        contact_number,
                        admin_approval: false,
                        user_id: user.user_id,
                    },
                });

                return {
                    user,
                    candidate,
                };
            }
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    candidate_id: candidate.candidate_id,
                    candidate_name:
                        `${candidate.candidate_first_name} ${candidate.candidate_last_name ?? ""}`,
                    admin_approval: candidate.admin_approval,
                },
                "Candidate created successfully."
            )
        );


        }

        
)