import API from "../api.js";

/**
 * Maps backend event_type enum -> UI display label, and back.
 * Confirmed against EventFilterBar.jsx's TYPE_TABS.
 */
const EVENT_TYPE_ENUM_TO_LABEL = {
  JOB_FAIR: "Job Fair",
  JOB_DRIVE: "Job Drive",
};

/**
 * Pill colors for event_type, keyed by the UI label (matches
 * StatusBadge's usage in EventTable). Placeholder hex values —
 * replace with whatever your existing Job Fair/Job Drive colors
 * actually are, if these guesses don't match your design.
 */
export const eventTypeStyles = {
  "Job Fair": { bg: "#eff6ff", color: "#3b82f6" },
  "Job Drive": { bg: "#f5f3ff", color: "#8b5cf6" },
};

const EVENT_TYPE_LABEL_TO_ENUM = {
  "Job Fair": "JOB_FAIR",
  "Job Drive": "JOB_DRIVE",
};

/**
 * Maps backend event_status enum -> UI display label, and back.
 * Confirmed against getAllHrJobEvents controller: only these three
 * values are valid on the backend. "Ongoing" was dropped from the UI
 * per decision — it never had backend support.
 */
const EVENT_STATUS_ENUM_TO_LABEL = {
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const EVENT_STATUS_LABEL_TO_ENUM = {
  Upcoming: "UPCOMING",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
};

// Exported for EventTable/EventFilterBar so status options + pill
// colors live next to the enum mapping they're derived from, rather
// than in data/jobFairJobDriveData.js (being phased out).
export const eventStatusOptions = Object.values(EVENT_STATUS_ENUM_TO_LABEL);

export const eventStatusStyles = {
  Upcoming: { bg: "#eff6ff", color: "#3b82f6" },
  Completed: { bg: "#f0fdf4", color: "#22c55e" },
  Cancelled: { bg: "#fef2f2", color: "#ef4444" },
};

function isAllOption(value) {
  return !value || value.toLowerCase().startsWith("all");
}

function formatEventDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Transforms one raw job_event row from GET /job-event into the
 * shape JobFairJobDriveList / EventTable expect.
 *
 * NOTE: `candidates` intentionally omitted — the backend query has
 * no application-count field. EventTable.jsx's Candidates column was
 * dropped per decision rather than displaying a fake/undefined value.
 */
export function mapJobEventRecord(raw) {
  return {
    id: raw.job_event_id,
    name: raw.event_name,
    type: EVENT_TYPE_ENUM_TO_LABEL[raw.event_type] ?? raw.event_type,
    date: formatEventDate(raw.event_date), // "15 Mar 2024" — unchanged, still used by the table
    time: formatEventTime(raw.event_time), // "10:00 AM" — unchanged, still used by the table
    dateISO: raw.event_date ? raw.event_date.slice(0, 10) : "", // ← new: for edit form only
    timeISO: raw.event_time
      ? new Date(raw.event_time).toISOString().slice(11, 16)
      : "", // ← new: for edit form only
    venue: raw.address ?? "—",
    mapLink: raw.google_map_link ?? null,
    description: raw.description ?? "",
    photos: raw.jobevent_photos ?? [],
    status: EVENT_STATUS_ENUM_TO_LABEL[raw.event_status] ?? raw.event_status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Fetches the paginated/filtered job fair & job drive list.
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} [params.search]      - matches event_name or address
 * @param {string} [params.type]        - UI label e.g. "Job Fair"; mapped to enum
 * @param {string} [params.status]      - UI label e.g. "Upcoming"; mapped to enum
 * @param {string} [params.date]        - "YYYY-MM-DD"
 * @param {string} [params.sortOrder]   - "asc" | "desc" (default: desc)
 */
export async function fetchJobEvents({
  page = 1,
  limit = 10,
  search,
  type,
  status,
  date,
  sortOrder,
} = {}) {
  const params = { page, limit };

  if (search && search.trim()) params.search = search.trim();
  if (!isAllOption(type)) {
    const enumType = EVENT_TYPE_LABEL_TO_ENUM[type];
    if (enumType) params.event_type = enumType;
  }
  if (!isAllOption(status)) {
    const enumStatus = EVENT_STATUS_LABEL_TO_ENUM[status];
    if (enumStatus) params.event_status = enumStatus;
  }
  if (date) params.date = date;
  if (sortOrder) params.sort_order = sortOrder;

  const res = await API.get("/hr/job-event", { params });
  const data = res.data?.data ?? {};

  return {
    events: (data.jobEvents ?? []).map(mapJobEventRecord),
    pagination: data.pagination ?? {
      page: 1,
      limit,
      totalRecords: 0,
      totalPages: 1,
    },
  };
}

export async function createJobEvent(form) {
  if (!form.type) {
    throw new Error("Please select an event type.");
  }
  if (!form.name?.trim()) {
    throw new Error("Event name is required.");
  }
  if (!form.date) {
    throw new Error("Please select a date.");
  }
  if (!form.time) {
    throw new Error("Please select a time.");
  }
  if (!form.venue?.trim() && !form.address?.trim()) {
    throw new Error("Please enter a venue or address.");
  }

  const combinedAddress = [form.venue?.trim(), form.address?.trim()]
    .filter(Boolean)
    .join(", ");

  const payload = {
    event_type: EVENT_TYPE_LABEL_TO_ENUM[form.type] ?? form.type,
    event_name: form.name.trim(),
    event_date: form.date, // native <input type="date"> gives "YYYY-MM-DD" already
    event_time: form.time, // native <input type="time"> gives "HH:mm" already
    address: combinedAddress,
    google_map_link: form.mapsLink?.trim() || undefined,
    description: form.description?.trim() || undefined,
  };

  const res = await API.post("/hr/job-event/add", payload);
  return res.data?.data;
}

export async function updateJobEventStatus(eventId, statusLabel) {
  const enumStatus = EVENT_STATUS_LABEL_TO_ENUM[statusLabel];
  if (!enumStatus) {
    throw new Error(`Unknown status: ${statusLabel}`);
  }

  const res = await API.patch(`/hr/job-event/${eventId}/status`, {
    event_status: enumStatus,
  });
  return mapJobEventRecord(res.data?.data ?? {});
}

/**
 * Checks how many job events already exist on a given date.
 * Used to warn (not block) the recruiter in AddEventModal before
 * they create a 3rd+ event on the same day.
 */
export async function checkJobEventDateConflict(date) {
  const res = await API.get("/hr/job-event/check-date", { params: { date } });
  const data = res.data?.data ?? {};
  return {
    eventCount: data.eventCount ?? 0,
    hasExistingEvents: Boolean(data.hasExistingEvents),
  };
}

export async function updateJobEvent(eventId, form) {
  if (!form.name?.trim()) {
    throw new Error("Event name is required.");
  }
  if (!form.date) {
    throw new Error("Please select a date.");
  }
  if (!form.time) {
    throw new Error("Please select a time.");
  }
  if (!form.address?.trim()) {
    throw new Error("Please enter a venue/address.");
  }

  const payload = {
    event_type: EVENT_TYPE_LABEL_TO_ENUM[form.type] ?? form.type,
    event_name: form.name.trim(),
    event_date: form.date,
    event_time: form.time,
    address: form.address.trim(),
    google_map_link: form.mapsLink?.trim() || undefined,
    description: form.description?.trim() || undefined,
  };

  const res = await API.patch(`/hr/job-event/update/${eventId}`, payload);
  return mapJobEventRecord(res.data?.data ?? {});
}
