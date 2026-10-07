import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";
import { withCache } from "../../lib/cache-helper";
import { MOBILIZER_REDIS_KEYS } from "../../constants/mobilizer-keys/mobilizer-keys";

const ENQUIRY_STATS_TTL = 30; // seconds

async function computeEnquiryStats(centerId: string) {
    const [totalEnquiries, pendingEnquiries, notConnected, centerVisited] = await Promise.all([
        prisma.enquiry_records.count({ where: { center_id: centerId } }),
        prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.FOLLOW_UP_PENDING } }),
        prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.NOT_CONNECTED } }),
        prisma.enquiry_records.count({ where: { center_id: centerId, enq_status: enquiry_status.CENTER_VISITED } }),
    ]);

    return [
        { label: "Total Enquiries", count: totalEnquiries },
        { label: "Pending Enquiries", count: pendingEnquiries },
        { label: "Not Connected", count: notConnected },
        { label: "Center Visited", count: centerVisited },
    ];
}

export const getEnquiryStats = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const centerId = req.mobilizer?.center_id;

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        const stats = await withCache(
            MOBILIZER_REDIS_KEYS.enquiry_stats(centerId),
            ENQUIRY_STATS_TTL,
            () => computeEnquiryStats(centerId)
        );

        return res.status(200).json(
            new ApiResponse(200, stats, "Enquiry stats fetched successfully")
        );
    }
);
