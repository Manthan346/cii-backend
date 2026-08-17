import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { ApiResponse } from "../../helpers/ApiResponse";
import { computeEventStatus } from "../../utils/event-utils/compute-event-status";
import { event_status_type } from "../../generated/prisma/enums";
import type { pagination } from "../../interfaces/pagination-interface";
import {
    PUBLIC_EVENT_FIELDS,
    PublicEventWithStatus,
    buildStatusFilter,
    isValidStatus,
    isValidEventType,
} from "../../utils/event-helpers/public-event-helpers";

export const getCenterEvents = asyncHandler(
    async (req: Request, res: Response) => {
        const { page, limit, skip } = req.pagination as pagination;
        const { event_type: eventTypeRaw, status: statusRaw, title: titleRaw } = req.query;
        const mobilizer = (req as any).mobilizer; // MobilizerAuthRequest
        const centerId = mobilizer?.center_id;

        if (!centerId) {
            throw new Error("Mobilizer center not found");
        }

        // Validate query params - convert to string first, then validate
        const eventTypeStr = eventTypeRaw != null ? String(eventTypeRaw) : undefined;
        const statusStr = statusRaw != null ? String(statusRaw) : undefined;
        const titleStr = titleRaw != null ? String(titleRaw).trim() : undefined;

        // Validate and narrow types using type guards
        const eventType = isValidEventType(eventTypeStr!) ? eventTypeStr : undefined;
        const status = isValidStatus(statusStr!) ? statusStr : undefined;

        const today = new Date();
        const todayUTC = new Date(
            Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
        );

        // Build filter object
        const where: any = {
            center_id: centerId,
            is_show: true,
        };

        if (eventType) {
            where.event_type = eventType;
        }

        // If title search requested → add case-insensitive partial match filter
        if (titleStr) {
            where.title = { contains: titleStr, mode: "insensitive" };
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

        // Add derived status to each event
        const items: PublicEventWithStatus[] = events.map((e) => ({
            ...e,
            event_status: computeEventStatus(e.event_date, e.event_time),
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    events: items,
                    pagination: { page, limit, totalRecords: total, totalPages: Math.ceil(total / limit) },
                },
                "Center events fetched successfully."
            )
        );
    }
);