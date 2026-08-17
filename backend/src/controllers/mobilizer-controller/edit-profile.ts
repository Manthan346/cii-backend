import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const editMobilizerProfile = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const mobilizerId = req.mobilizer?.mobilizer_id;

        if (!mobilizerId) {
            throw new ApiError(401, "Mobilizer not authenticated");
        }

        // Body is already validated + stripped by validateBody middleware.
        const { first_name, last_name, mobile_number } = req.body;

        // Build the update payload from ONLY the allowed columns. Fields that
        // were not sent are `undefined`, and Prisma skips undefined keys, so
        // a partial update (only mobile, only name) works naturally.
        const data: {
            mobilizer_first_name?: string;
            mobilizer_last_name?: string;
            mobilizer_phone_no?: string;
        } = {};

        if (first_name !== undefined) data.mobilizer_first_name = first_name;
        if (last_name !== undefined) data.mobilizer_last_name = last_name;
        if (mobile_number !== undefined) data.mobilizer_phone_no = mobile_number;

        // Mobile is @unique — make sure no OTHER mobilizer owns it before update.
        // (One extra query is cheaper and clearer than relying on a P2002 catch.)
        if (mobile_number !== undefined) {
            const owner = await prisma.mobilizer_details.findFirst({
                where: {
                    mobilizer_phone_no: mobile_number,
                    mobilizer_id: { not: mobilizerId },
                },
                select: { mobilizer_id: true },
            });

            if (owner) {
                throw new ApiError(
                    409,
                    "This mobile number is already in use by another mobilizer"
                );
            }
        }

        // Update only the allowed columns. update() throws P2025 if the row is
        // missing — asyncHandler maps that to 404 automatically.
        const updated = await prisma.mobilizer_details.update({
            where: { mobilizer_id: mobilizerId },
            data,
            select: {
                mobilizer_id: true,
                mobilizer_first_name: true,
                mobilizer_last_name: true,
                mobilizer_phone_no: true,
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    profile: {
                        first_name: updated.mobilizer_first_name,
                        last_name: updated.mobilizer_last_name,
                        mobile_number: updated.mobilizer_phone_no,
                    },
                },
                "Profile updated successfully"
            )
        );
    }
);
