import { Request, Response } from "express";
import { adminAuthRequest } from "../../interfaces/admin-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";
import { asyncHandler } from "../../helpers/asyncHandler";
import { createCompanySchema } from "../../services/zod/admin/create-company-validation";
import { Prisma } from "../../generated/prisma/client";


export const addIndustryPartnerByAdmin = asyncHandler(
    async (
        req: Request,
        res: Response
    ) => {
        const adminReq = req as adminAuthRequest;
        const {company_name,company_description} = req.body

        const adminId = adminReq.user.user_id;
        const centerId = adminReq.user.center_id;

        const checkExisting = await prisma.company_details.findUnique({
            where:{
                company_name:company_name,
            }
        });

        if(checkExisting){
            throw new ApiError(
                409,
                "Company already Exists."
            )
        }
        
        try {
            const result = await prisma.$transaction(async (tx) => {
                const company = await tx.company_details.create({
                    data: {
                        company_name: company_name,
                        company_description: company_description
                    }
                });

                await tx.center_company.create({
                    data: {
                        company_id: company.company_id,
                        center_id: centerId
                    }
                });

                return {
                    company_id: company.company_id,
                    name: company.company_name
                };
            });

            return res.status(201).json(
                new ApiResponse(
                    201,
                    {
                        company_id: result.company_id,
                        company_name: result.name,
                    },
                    "Company created successfully and can provide their courses for our center."
                )
            );

        } catch (error) {

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new ApiError(
                    409,
                    "Company already exists."
                );
            }

            throw error;
        }

    }
);