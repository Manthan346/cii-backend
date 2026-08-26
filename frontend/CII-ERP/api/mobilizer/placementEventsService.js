import API from "../api.js";

export async function fetchJobEvents(params = {}) {
	const response = await API.get("/mobilizer/job-event", { params });
	const data = response.data?.data;
	const events = data?.jobEvents ?? data?.job_events;

	if (!Array.isArray(events)) {
		throw new Error("Job events response has an invalid format");
	}

	const pagination = data?.pagination ?? {};
	return {
		events: events.map(normalizeJobEvent),
		pagination: {
			page: pagination.page ?? params.page ?? 1,
			limit: pagination.limit ?? params.limit ?? 20,
			totalRecords: pagination.totalRecords ?? pagination.total ?? events.length,
			totalPages: pagination.totalPages ?? (pagination.hasNextPage ? (params.page ?? 1) + 1 : 1),
			hasNextPage: pagination.hasNextPage ?? false,
		},
	};
}

export async function fetchJobEventStats() {
	const statuses = ["UPCOMING", "COMPLETED", "CANCELLED"];
	const [all, ...statusResults] = await Promise.all([
		fetchJobEvents({ page: 1, limit: 1 }),
		...statuses.map((event_status) => fetchJobEvents({ page: 1, limit: 1, event_status })),
	]);

	return [
		{ id: "total", label: "Total", sublabel: "Placement Events", value: all.pagination.totalRecords, icon: "FileText", iconTone: "plain", labelTone: "plain" },
		{ id: "upcoming", label: "Upcoming", sublabel: "Placement events", value: statusResults[0].pagination.totalRecords, icon: "FileEdit", iconTone: "plain", labelTone: "amber" },
		{ id: "completed", label: "Completed", sublabel: "Placement events", value: statusResults[1].pagination.totalRecords, icon: "BadgeCheck", iconTone: "navy", labelTone: "green" },
		{ id: "cancelled", label: "Cancelled", sublabel: "Placement Events", value: statusResults[2].pagination.totalRecords, icon: "Users", iconTone: "navy", labelTone: "red" },
	];
}

export async function uploadJobEventImages(jobEventId, files) {
	if (!files.length || files.length > 10) {
		throw new Error("Select between 1 and 10 images");
	}

	const formData = new FormData();
	files.forEach((file) => formData.append("event_images", file));

	const response = await API.post(`/mobilizer/job-event/${jobEventId}/images`, formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return response.data?.data;
}

function normalizeJobEvent(event) {
	const eventDate = event.event_date ?? event.eventDate;
	const status = formatStatus(event.event_status ?? event.status);

	return {
		...event,
		id: event.job_event_id ?? event.id,
		title: event.event_name ?? event.title ?? "Untitled event",
		status,
		date: formatDate(eventDate),
		time: event.event_time ?? event.time ?? "",
		address: event.address ?? event.location ?? "-",
		venue: event.venue ?? event.address ?? event.location ?? "-",
		expectedCandidates: event.expected_candidates ?? event.expectedCandidates ?? 0,
		organizers: event.organizers ?? [],
		description: event.description ?? "",
		images: event.jobevent_photos ?? event.images ?? [],
	};
}

function formatStatus(status) {
	if (!status) return "Upcoming";
	return String(status).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
