// api/trainer/eventService.js
import api from "../api";

export async function fetchInstructorEvents({ page = 1, limit = 6 } = {}) {
  const res = await api.get("/instructor/instructor-events/get-event", {
    params: { page, limit },
  });
  return res.data.data; // { events, pagination: { page, limit, totalRecords, totalPages } }
}

const TARGET_TYPE_LABELS = {
  ALL_BATCHES: "All active batches",
  COMPLETED: "All completed batches",
  A_C_BATCHES: "All batches (active + completed)",
  BATCH: "Specific batch(es)",
  PUBLIC: "Public",
};

/**
 * Maps one item from getAllInstructorEvents' response to the shape
 * EventTable expects.
 *
 * Batch shows the targeting choice made at creation (target_type —
 * a plain column on event_details, no join needed). organizer,
 * participants, maxParticipants are still "—" — event_details has no
 * headcount columns and the controller's query doesn't include the
 * creator (user_login) relation.
 */
export function mapEventRecord(item) {
  const n = item.notifications;
  const ed = n.event_details ?? {};

  return {
    id: ed.event_id ?? n.reference_id,
    title: ed.event_title,
    type: ed.event_type ?? "—",
    mode: ed.event_mode ?? "—",
    date: ed.event_date,
    time: ed.event_time,
    venue: ed.venue ?? "—",
    eventLink: ed.event_link ?? "",
    batch: TARGET_TYPE_LABELS[ed.target_type] ?? ed.target_type ?? "—",
    targetType: ed.target_type,
    organizer: "—",
    participants: "—",
    maxParticipants: "—",
    status: ed.event_status,
    description: ed.event_description ?? "",
  };
}

export async function createEvent(formValues) {
  const res = await api.post("/instructor/instructor-events/create-event", {
    event_title: formValues.title,
    event_description: formValues.description,
    event_date: formValues.date, // "YYYY-MM-DD"
    event_time: formValues.time, // "HH:MM"
    venue: formValues.venue || undefined,
    event_link: formValues.eventLink || undefined,
    event_mode: formValues.mode.toUpperCase(), // "Offline" -> "OFFLINE"
    event_type: formValues.type.toUpperCase(), // ⚠️ unconfirmed — verify against real enum
    target_type: formValues.targetType, // "ALL_BATCHES" | "COMPLETED" | "A_C_BATCHES"
  });
  return res.data;
}

export async function updateEvent(eventId, formValues) {
  const res = await api.patch(
    `/instructor/instructor-events/update-event/${eventId}`,
    {
      event_title: formValues.title,
      event_description: formValues.description,
      event_date: formValues.date,
      event_time: formValues.time,
      venue: formValues.venue || undefined,
      event_link: formValues.eventLink || undefined,
      event_mode: formValues.mode.toUpperCase(),
      event_type: formValues.type.toUpperCase(),
      target_type: formValues.targetType,
    },
  );
  return res.data;
}
