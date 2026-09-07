import API from "../api.js";

export async function fetchJobEvents(params = {}) {
  const sortOrder = params.sort_order ?? "desc";
  const response = await API.get("/mobilizer/job-event", {
    params: { ...params, sort_order: sortOrder },
  });
  const data = response.data?.data;
  const events = data?.jobEvents ?? data?.job_events;

  if (!Array.isArray(events)) {
    throw new Error("Job events response has an invalid format");
  }

  const orderedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.event_date ?? a.eventDate ?? a.date ?? 0).getTime();
    const dateB = new Date(b.event_date ?? b.eventDate ?? b.date ?? 0).getTime();

    if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
    if (Number.isNaN(dateA)) return 1;
    if (Number.isNaN(dateB)) return -1;

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const pagination = data?.pagination ?? {};
  return {
    events: orderedEvents.map(normalizeJobEvent),
    pagination: {
      page: pagination.page ?? params.page ?? 1,
      limit: pagination.limit ?? params.limit ?? 20,
      totalRecords:
        pagination.totalRecords ?? pagination.total ?? events.length,
      totalPages:
        pagination.totalPages ??
        (pagination.hasNextPage ? (params.page ?? 1) + 1 : 1),
      hasNextPage: pagination.hasNextPage ?? false,
    },
  };
}

export async function fetchJobEventDetails(eventId) {
  const response = await API.get(`/mobilizer/job-event/${eventId}`);
  const data = response.data?.data;
  const event = data?.jobEvent ?? data?.job_event ?? data;

  if (!event) {
    throw new Error("Job event details response has an invalid format");
  }

  return normalizeJobEvent(event);
}

export async function fetchJobEventStats() {
  const statuses = ["UPCOMING", "COMPLETED", "CANCELLED"];
  const [all, ...statusResults] = await Promise.all([
    fetchJobEvents({ page: 1, limit: 1 }),
    ...statuses.map((event_status) =>
      fetchJobEvents({ page: 1, limit: 1, event_status }),
    ),
  ]);

  return [
    {
      id: "total",
      label: "Total",
      sublabel: "Placement Events",
      value: all.pagination.totalRecords,
      icon: "FileText",
      iconTone: "plain",
      labelTone: "plain",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      sublabel: "Placement events",
      value: statusResults[0].pagination.totalRecords,
      icon: "FileEdit",
      iconTone: "plain",
      labelTone: "amber",
    },
    {
      id: "completed",
      label: "Completed",
      sublabel: "Placement events",
      value: statusResults[1].pagination.totalRecords,
      icon: "BadgeCheck",
      iconTone: "navy",
      labelTone: "green",
    },
    {
      id: "cancelled",
      label: "Cancelled",
      sublabel: "Placement Events",
      value: statusResults[2].pagination.totalRecords,
      icon: "Users",
      iconTone: "navy",
      labelTone: "red",
    },
  ];
}

export async function uploadJobEventImages(jobEventId, files) {
  if (!files.length || files.length > 10) {
    throw new Error("Select between 1 and 10 images");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("event_images", file));

  const response = await API.post(
    `/mobilizer/job-event/${jobEventId}/images`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data?.data;
}

function normalizeJobEvent(event = {}) {
  const eventDate = event.event_date ?? event.eventDate ?? event.date;
  const status = formatStatus(event.event_status ?? event.status);
  const createdByName =
    event.hr_name ??
    event.created_by_name ??
    event.created_by ??
    event.creator_name ??
    event.mobilizer_name ??
    event.createdBy ??
    event.created_by_user?.name ??
    event.createdByUser?.name ??
    event.user?.name ??
    "";

  return {
    ...event,
    id: event.job_event_id ?? event.id,
    title: event.event_name ?? event.title ?? "Untitled event",
    type: event.event_type ?? event.type ?? "",
    status,
    date: formatDate(eventDate),
    time: formatTime(event.event_time ?? event.time),
    address: event.address ?? event.location ?? "-",
    venue: event.venue ?? event.address ?? event.location ?? "-",
    expectedCandidates:
      event.expected_candidates ?? event.expectedCandidates ?? 0,
    organizers: event.organizers ?? [],
    description: event.description ?? "",
    images: normalizeImages(event.jobevent_photos ?? event.images ?? []),
    createdByName,
    mapLink:
      event.google_map_link ?? event.mapLink ?? event.googleMapLink ?? "",
  };
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) =>
      typeof image === "string"
        ? image
        : (image?.url ?? image?.secure_url ?? ""),
    )
    .filter(Boolean);
}

function formatStatus(status) {
  if (!status) return "Upcoming";
  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function formatTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}
