// import { Prisma } from "@prisma/client";
import { event_status_type, event_type } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/browser";


/** Public event select fields — reusable across controllers */
export const PUBLIC_EVENT_FIELDS = {
    event_id: true,
    event_title: true,
    event_description: true,
    event_date: true,
    event_start_time: true,
    event_end_time: true,
    venue: true,
    event_link: true,
    event_mode: true,
    event_type: true,
    event_documents: true,
    event_status: true
} as const satisfies Prisma.event_detailsSelect;

/** Type for public event with status (from DB or derived) */
export type PublicEventWithStatus = Prisma.event_detailsGetPayload<{
    select: typeof PUBLIC_EVENT_FIELDS;
}> & { event_status: "UPCOMING" | "ONGOING" | "COMPLETED" };

/**
 * Builds Prisma where clause for a specific status bucket.
 * Maps derived status (UPCOMING/ONGOING/COMPLETED) to date ranges.
 */
export function buildStatusFilter(
    status: "UPCOMING" | "ONGOING" | "COMPLETED",
    todayUTC: Date
): Prisma.event_detailsWhereInput {
    switch (status) {
        case "UPCOMING":
            return { event_date: { gt: todayUTC } };
        case "ONGOING":
            return { event_date: { equals: todayUTC } };
        case "COMPLETED":
            return { event_date: { lt: todayUTC } };
    }
}

/**
 * Type guard for status query param
 */
export function isValidStatus(status: string): status is "UPCOMING" | "ONGOING" | "COMPLETED" {
    return ["UPCOMING", "ONGOING", "COMPLETED"].includes(status);
}

/**
 * Type guard for event_type query param
 */
export function isValidEventType(eventType: string): eventType is event_type {
    return Object.values(event_type).includes(eventType as event_type);
}