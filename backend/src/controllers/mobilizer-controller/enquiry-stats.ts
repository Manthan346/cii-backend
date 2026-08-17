import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";

export const getEnquiryStats = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const centerId = req.mobilizer?.center_id;

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        // 4 stat cards — all center-scoped, all from enquiry_records.
        // Run in parallel via Promise.all for a single round-trip latency.
        const [totalEnquiries, pendingEnquiries, notConnected, centerVisited] = await Promise.all([
            // 1) Total — every enquiry record for this center
            prisma.enquiry_records.count({ where: { center_id: centerId } }),
            // 2) Pending — enq_status = FOLLOW_UP_PENDING
            prisma.enquiry_records.count({
                where: { center_id: centerId, enq_status: enquiry_status.FOLLOW_UP_PENDING },
            }),
            // 3) Not Connected — enq_status = NOT_CONNECTED
            prisma.enquiry_records.count({
                where: { center_id: centerId, enq_status: enquiry_status.NOT_CONNECTED },
            }),
            // 4) Center Visited — enq_status = CENTER_VISITED
            prisma.enquiry_records.count({
                where: { center_id: centerId, enq_status: enquiry_status.CENTER_VISITED },
            }),
        ]);

        const stats = [
            { label: "Total Enquiries", count: totalEnquiries },
            { label: "Pending Enquiries", count: pendingEnquiries },
            { label: "Not Connected", count: notConnected },
            { label: "Center Visited", count: centerVisited },
        ];

        return res.status(200).json(
            new ApiResponse(200, stats, "Enquiry stats fetched successfully")
        );
    }
);
