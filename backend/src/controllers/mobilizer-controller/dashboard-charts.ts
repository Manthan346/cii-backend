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

export const getDashboardCharts = asyncHandler(
    async (req: MobilizerAuthRequest, res: Response) => {
        const centerId = req.mobilizer?.center_id;

        if (!centerId) {
            throw new ApiError(401, "Mobilizer center not found");
        }

        const { dayStarts } = getWeekRangeUtc(new Date());

        // 1) Weekly enrollment (Sun-Sat): count batch_enrollment.created_at per day.
        //    batch_enrollment has no center_id -> scope via batch_details.center_id.
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

        // 2) Candidate distribution (all-time, center-scoped):
        //    - follow_up_pending / not_interested / interested -> enquiry_records.enq_status
        //    - called = CALL_RECIEVED + CALL_BUSY + CALL_DROPPED_OUT (enum has no "CALLED")
        //    - enrolled -> batch_enrollment count (via batch_details.center_id)
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
            // "called" = sum of the three call statuses (single count via `in` filter)
            prisma.enquiry_records
                .count({ where: { center_id: centerId, enq_status: { in: CALL_STATUSES } } })
                .then((count) => ({ status: "called", count })),
            prisma.batch_enrollment
                .count({ where: { batch_details: { center_id: centerId } } })
                .then((count) => ({ status: "enrolled", count })),
        ];

        // 3) Weekly calls (Sun-Sat): per-day TOTAL across all call statuses
        //    (CALL_RECIEVED + CALL_BUSY + CALL_DROPPED_OUT combined per day).
        //    Single line chart: one count per day, NOT per call type.
        const weeklyCallsPromises = dayStarts.map((dayStart, i) => {
            const dayEnd = getNextDayStart(dayStart);
            return prisma.enquiry_records
                .count({
                    where: {
                        center_id: centerId,
                        enq_status: { in: CALL_STATUSES },
                        updated_at: { gte: dayStart, lt: dayEnd },
                    },
                })
                .then((count) => ({ day: WEEKDAY_LABELS[i], count }));
        });

        // Resolve all three groups in parallel
        const [weeklyEnrollment, candidateDistribution, weeklyCalls] = await Promise.all([
            Promise.all(weeklyEnrollmentPromises),
            Promise.all(candidateDistributionPromises),
            Promise.all(weeklyCallsPromises),
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    weekly_enrollment: weeklyEnrollment,
                    candidate_distribution: candidateDistribution,
                    weekly_calls: weeklyCalls,
                },
                "Dashboard charts fetched successfully"
            )
        );
    }
);
