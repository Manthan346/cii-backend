import { event_status_type } from "../../generated/prisma/enums";

/**
 * Derives the effective status of an event from its date/time.
 *
 * Rules (compared in UTC):
 * - event_date > today            -> UPCOMING
 * - event_date = today            -> ONGOING (during the event day; we treat the day itself
 *                                    as ongoing regardless of the time, matching the typical
 *                                    "event-in-progress" UX on landing pages. If a non-null
 *                                    event_time was provided, future enhancement could narrow
 *                                    this to a window.)
 * - event_date < today            -> COMPLETED
 *
 * Note: This helper assumes `event_date` is a Date in UTC (Prisma @db.Date returns midnight UTC).
 *       `event_time` is accepted but currently only used as a hint for tighter ONGOING windows
 *       in a future iteration.
 */
export const computeEventStatus = (
  event_date: Date,
  _event_time?: Date | null
): "UPCOMING" | "ONGOING" | "COMPLETED" => {
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const eventUTC = new Date(
    Date.UTC(
      event_date.getUTCFullYear(),
      event_date.getUTCMonth(),
      event_date.getUTCDate()
    )
  );

  if (eventUTC.getTime() > todayUTC.getTime()) return event_status_type.UPCOMING;
  if (eventUTC.getTime() < todayUTC.getTime()) return event_status_type.COMPLETED;
  return event_status_type.ONGOING;
};

/**
 * Resolves the *final* status of an event: if the row has an explicit override
 * (`event_status` set), that wins; otherwise the time-based derivation is used.
 */
export const resolveEventStatus = (
  event_status: string | null | undefined,
  event_date: Date,
  event_start_time?: Date | null,
  
): "UPCOMING" | "ONGOING" | "COMPLETED" => {
  if (
    event_status === event_status_type.UPCOMING ||
    event_status === event_status_type.ONGOING ||
    event_status === event_status_type.COMPLETED
  ) {
    return event_status as "UPCOMING" | "ONGOING" | "COMPLETED";
  }
  return computeEventStatus(event_date, event_start_time, );
};
