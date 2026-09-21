import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { computeEventStatus, resolveEventStatus } from "../../utils/event-utils/compute-event-status";
import { event_status_type } from "../../generated/prisma/enums";
import type { pagination } from "../../interfaces/pagination-interface";
import {
    PUBLIC_EVENT_FIELDS,
    PublicEventWithStatus,
    buildStatusFilter,
    isValidStatus,
    isValidEventType,
} from "../../utils/event-helpers/public-event-helpers";

export const getPublicEvents = asyncHandler(
    async (req: Request, res: Response) => {
        const { page, limit, skip } = req.pagination as pagination;
        const { event_type: eventTypeRaw, status: statusRaw } = req.query;

        // Validate query params - convert to string first, then validate
        const eventTypeStr = eventTypeRaw != null ? String(eventTypeRaw) : undefined;
        const statusStr = statusRaw != null ? String(statusRaw) : undefined;

        // Validate and narrow types using type guards
        const eventType = isValidEventType(eventTypeStr!) ? eventTypeStr : undefined;
        const status = isValidStatus(statusStr!) ? statusStr : undefined;

        const today = new Date();
        const todayUTC = new Date(
            Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
        );

        // Build filter object
        const where: any = {
            is_show: true,
            target_type: "PUBLIC" as const,
        };

        if (eventType) {
            where.event_type = eventType;
        }

        // If status filter requested → add date filter via helper
        if (status) {
            Object.assign(where, buildStatusFilter(status, todayUTC));
        }

        // Fetch paginated events
        const [events, total] = await Promise.all([
            prisma.event_details.findMany({
                where,
                select: PUBLIC_EVENT_FIELDS,
                orderBy: { created_at: "desc" },
                skip,
                take: limit,
            }),
            prisma.event_details.count({ where }),
        ]);

        // Add status to each event (use DB status if set, otherwise compute)
        const items: PublicEventWithStatus[] = events.map((e) => ({
            ...e,
            event_status: resolveEventStatus(e.event_status, e.event_date, e.event_start_time, ),
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    events: items,
                    pagination: { page, limit, totalRecords: total, totalPages: Math.ceil(total / limit) },
                },
                "Public events fetched successfully."
            )
        );
    }
);