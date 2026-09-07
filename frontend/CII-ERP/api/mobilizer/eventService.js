import API from "../api.js";

export const EVENT_TYPES = ["WEBINAR", "SEMINAR", "UPSKILLING", "WORKSHOP"];
export const EVENT_TABS = ["All", "Upcoming", "Ongoing", "Completed"];

export async function fetchCenterEvents(params = {}) {
  const response = await API.get("/mobilizer/center-events", { params });
  const data = response.data?.data;
  const events = data?.events ?? data?.event_details;

  if (!Array.isArray(events))
    throw new Error("Events response has an invalid format");

  const pagination = data?.pagination ?? {};
  return {
    events: events.map(normalizeEvent),
    pagination: {
      page: pagination.page ?? params.page ?? 1,
      limit: pagination.limit ?? params.limit ?? 20,
      totalRecords:
        pagination.totalRecords ?? pagination.total ?? events.length,
      totalPages:
        pagination.totalPages ??
        (pagination.hasNextPage ? (params.page ?? 1) + 1 : 1),
    },
  };
}

export async function fetchEventDetails(eventId) {
  const response = await API.get(`/mobilizer/event-details/${eventId}`);
  const data = response.data?.data;
  return normalizeEvent(data?.event ?? data);
}

export async function fetchEventStats() {
  const statuses = ["UPCOMING", "ONGOING", "COMPLETED"];
  const [all, ...results] = await Promise.all([
    fetchCenterEvents({ page: 1, limit: 1 }),
    ...statuses.map((status) =>
      fetchCenterEvents({ page: 1, limit: 1, status }),
    ),
  ]);
  return [
    {
      id: "total",
      icon: "FileText",
      value: all.pagination.totalRecords,
      label: "Total Events",
      iconTone: "plain",
    },
    {
      id: "upcoming",
      icon: "FileEdit",
      value: results[0].pagination.totalRecords,
      label: "Upcoming Events",
      iconTone: "plain",
    },
    {
      id: "ongoing",
      icon: "MessageSquare",
      value: results[1].pagination.totalRecords,
      label: "Ongoing Events",
      iconTone: "plain",
    },
    {
      id: "completed",
      icon: "BadgeCheck",
      value: results[2].pagination.totalRecords,
      label: "Completed Events",
      iconTone: "navy",
    },
  ];
}

export async function createPublicEvent(event) {
  const response = await API.post("/mobilizer/create-public-event", {
    event_title: event.eventName,
    event_description: event.description,
    event_date: event.date,
    event_start_time: String(event.startTime || "09:00"),
    event_end_time: String(event.endTime || "17:00"),
    venue: event.venue || "",
    event_mode: event.eventMode || "OFFLINE",
    event_type: event.eventType,
    target_type: "PUBLIC",
    ...(event.eventLink ? { event_link: event.eventLink } : {}),
  });
  return normalizeEvent(response.data?.data);
}

export async function updatePublicEvent(eventId, event) {
  const response = await API.patch(
    `/mobilizer/update-public-event/${eventId}`,
    buildEventPayload(event),
  );
  return normalizeEvent(response.data?.data);
}

export async function uploadEventImages(eventId, files) {
  if (!files.length || files.length > 10)
    throw new Error("Select between 1 and 10 images");
  if (files.some((file) => file.size > 5 * 1024 * 1024))
    throw new Error("Each image must be 5 MB or smaller");
  const formData = new FormData();
  files.forEach((file) => formData.append("event_images", file));
  const response = await API.patch(
    `/mobilizer/update-public-event/${eventId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return normalizeEvent(response.data?.data);
}

function buildEventPayload(event) {
  return {
    event_title: event.eventName,
    event_description: event.description,
    event_date: event.date,
    event_start_time: String(event.startTime || ""),
    event_end_time: String(event.endTime || ""),
    event_mode: event.eventMode,
    event_type: event.eventType,
    event_status: event.eventStatus,
    ...(event.venue ? { venue: event.venue } : {}),
    ...(event.eventLink ? { event_link: event.eventLink } : {}),
  };
}

function normalizeEvent(event = {}) {
  const date = event.event_date ?? event.date;
  const rawStatus = event.event_status ?? event.status;
  const startTime = event.event_start_time ?? event.start_time ?? event.event_time ?? event.time;
  const endTime = event.event_end_time ?? event.end_time;
  const status = formatStatus(rawStatus, date, startTime);
  return {
    ...event,
    id: event.event_id ?? event.id,
    title: event.event_title ?? event.title ?? "Untitled Event",
    type: event.event_type ?? event.type ?? "",
    day: formatDatePart(date, "day"),
    month: formatDatePart(date, "month"),
    date: formatDate(date),
    rawDate: date ? String(date).slice(0, 10) : "",
    time: formatTime(startTime),
    rawTime: normalizeTimeInput(startTime),
    startTime: formatTime(startTime),
    rawStartTime: normalizeTimeInput(startTime),
    endTime: formatTime(endTime),
    rawEndTime: normalizeTimeInput(endTime),
    createdByName: normalizeCreatorName(event),
    event_status: rawStatus ?? status.toUpperCase().replace(/ /g, "_"),
    status,
    venue: event.venue ?? "-",
    description: event.event_description ?? event.description ?? "",
    images: event.event_documents ?? event.images ?? [],
  };
}

function formatStatus(status, date, time) {
  if (status)
    return String(status)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  const eventDate = date ? new Date(date) : null;
  if (eventDate && eventDate.toDateString() === new Date().toDateString())
    return "Ongoing";
  return eventDate && eventDate < new Date() ? "Completed" : "Upcoming";
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function formatDatePart(value, part) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : part === "day"
      ? String(date.getDate())
      : date.toLocaleDateString("en-GB", { month: "short" });
}

function formatTime(value) {
  if (!value) return "-";
  const timeInput = normalizeTimeInput(value);
  if (/^\d{2}:\d{2}$/.test(timeInput)) {
    const [hours, minutes] = timeInput.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
}

function normalizeTimeInput(value) {
  if (!value) return "";
  const stringValue = String(value);
  const timeMatch =
    stringValue.match(/(?:T|\s)(\d{2}:\d{2})/) ||
    stringValue.match(/^(\d{2}:\d{2})/);
  return timeMatch ? timeMatch[1] : stringValue;
}

function normalizeCreatorName(event) {
  const creator =
    event.created_by_name ??
    event.created_by ??
    event.createdBy ??
    event.creator_name ??
    event.mobilizer_name ??
    event.created_by_user?.name ??
    event.createdByUser?.name ??
    event.user?.name ??
    event.mobilizer?.name;
  if (!creator) return "Mobilizer";
  if (typeof creator === "object")
    return (
      creator.name ??
      creator.full_name ??
      ([creator.first_name, creator.last_name].filter(Boolean).join(" ") ||
        "Mobilizer")
    );
  return String(creator);
}
