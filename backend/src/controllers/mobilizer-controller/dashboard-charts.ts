import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { ApiError } from "../../helpers/ApiError";
import { MobilizerAuthRequest } from "../../interfaces/mobilizer-auth-interface";
import { enquiry_status } from "../../generated/prisma/enums";
import {
    WEEKDAY_LABELS,
    CALL_STATUSES,
    getWeekRangeUtc,
    getNextDayStart,
} from "../../utils/dashboard-charts-utils/dashboard-charts-utils";
import { withCache } from "../../lib/cache-helper";
import { MOBILIZER_REDIS_KEYS } from "../../constants/mobilizer-keys/mobilizer-keys";

const DASHBOARD_CHARTS_TTL = 30; // seconds

async function computeDashboardCharts(centerId: string) {
    const { dayStarts } = getWeekRangeUtc(new Date());

    // 1) Weekly enrollment (Sun-Sat): count batch_enrollment.created_at per day
    const weeklyEnrollmentPromises = dayStarts.map((dayStart, i) => {
        const dayEnd = getNextDayStart(dayStart);
        return prisma.batch_enrollment
            .count({
                where: {
                    created_at: { gte: dayStart, lt: dayEnd },
                    batch_details: { center_id: centerId },
                },
            })
            .then((count) => ({ day: WEEKDAY_LABELS[i], count }));
    });

    // 2) Candidate distribution (all-time, center-scoped)
    const candidateDistributionPromises = [
        prisma.enquiry_records
            .count({ where: { center_id: centerId, enq_status: enquiry_status.FOLLOW_UP_PENDING } })
            .then((count) => ({ status: "follow_up_pending", count })),
        prisma.enquiry_records
            .count({ where: { center_id: centerId, enq_status: enquiry_status.NOT_INTERESTED } })
            .then((count) => ({ status: "not_interested", count })),
        prisma.enquiry_records
            .count({ where: { center_id: centerId, enq_status: enquiry_status.INTERESTED } })
            .then((count) => ({ status: "interested", count })),
        prisma.enquiry_records
            .count({ where: { center_id: centerId, enq_status: { in: CALL_STATUSES } } })
            .then((count) => ({ status: "called", count })),
        prisma.batch_enrollment
            .count({ where: { batch_details: { center_id: centerId } } })
            .then((count) => ({ status: "enrolled", count })),
    ];

    // 3) Weekly calls (Sun-Sat): per-day TOTAL across all call statuses
    const weeklyCallsPromises = dayStarts.map((dayStart, i) => {
        const dayEnd = getNextDayStart(dayStart);
        return prisma.enquiry_status_history
            .count({
                where: {
                    enquiry_records: { center_id: centerId },
                    enq_status: { in: CALL_STATUSES },
                    created_at: { gte: dayStart, lt: dayEnd },
                },
            })
            .then((count) => ({ day: WEEKDAY_LABELS[i], count }));
    });

    const [weeklyEnrollment, candidateDistribution, weeklyCalls] = await Promise.all([
        Promise.all(weeklyEnrollmentPromises),
        Promise.all(candidateDistributionPromises),
        Promise.all(weeklyCallsPromises),
    ]);

    return {
        weekly_enrollment: weeklyEnrollment,
        candidate_distribution: candidateDistribution,
        weekly_calls: weeklyCalls,
    };
}

export const getDashboardCharts = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const centerId = req.mobilizer?.center_id;

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        const charts = await withCache(
            MOBILIZER_REDIS_KEYS.dashboard_charts(centerId),
            DASHBOARD_CHARTS_TTL,
            () => computeDashboardCharts(centerId)
        );

        return res.status(200).json(
            new ApiResponse(200, charts, "Dashboard charts fetched successfully")
        );
    }
);
