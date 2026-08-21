// Helpers for dashboard-charts controller.
// Kept here so the controller stays focused on querying, not date math.

import { enquiry_status } from "../../generated/prisma/enums";

/**
 * Days of the week, Sunday-first — JS getUTCDay() already returns Sunday=0,
 * so this order aligns directly with the day index and needs no offset math.
 */
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/**
 * The enquiry_status values that count as a "call" — the enum has no single
 * "CALLED" value, so any "calls" metric is the union of these three.
 * Used both for the candidate-distribution "called" bucket (sum) AND the
 * weekly_calls chart (Prisma `in` filter), so the definition lives once here.
 */
export const CALL_STATUSES: enquiry_status[] = [
    enquiry_status.CALL_RECIEVED,
    enquiry_status.CALL_BUSY,
    enquiry_status.CALL_DROPPED_OUT,
];

/**
 * Compute the 7 day-window boundaries for the current week (Sunday → Saturday), in UTC.
 * Returns the start of Sunday plus the start of each of the 7 days.
 *
 * Why simple: JS getUTCDay() is already Sunday-first (Sun=0 ... Sat=6), so the
 * number of days to roll back from "today" to reach Sunday is just `getUTCDay()`.
 * No offset tricks needed.
 *
 * Why UTC + injected `now`:
 *  - UTC buckets are deterministic regardless of the server's TZ, so a record
 *    created at 11 PM Sun UTC doesn't slip into Mon's bucket on an IST server.
 *  - `now` is passed in (not constructed inside) so the function stays pure
 *    and testable — feed any Date and the buckets are deterministic.
 *
 * @param now - the reference "current" moment (usually `new Date()` at the call site)
 * @returns `dayStarts` = 7 Date objects (Sun..Sat @ 00:00 UTC)
 */
export function getWeekRangeUtc(now: Date): { dayStarts: Date[] } {
    // Days to roll back from today to reach this week's Sunday (Sun=0, Sat=6).
    const daysSinceSunday = now.getUTCDay();

    // Start of Sunday this week, at UTC midnight (00:00:00.000).
    const start = new Date(
        Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - daysSinceSunday
        )
    );

    // Build the 7 day-start timestamps (Sun + i for Mon..Sat).
    const dayStarts: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setUTCDate(start.getUTCDate() + i);
        dayStarts.push(d);
    }

    return { dayStarts };
}

/**
 * Given a day start timestamp, return the start of the next day, i.e. the
 * half-open window end [dayStart, nextDayStart). Half-open (gte/lt) is used
 * because it avoids off-by-one at the boundary that a `lte` would cause
 * when timestamps share exact midnights.
 *
 * @param dayStart - start of a day at UTC midnight
 * @returns start of the following day at UTC midnight
 */
export function getNextDayStart(dayStart: Date): Date {
    const next = new Date(dayStart);
    next.setUTCDate(dayStart.getUTCDate() + 1);
    return next;
}
