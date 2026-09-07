import API from "../api.js";

export async function getPublicEvents(params = {}) {
	const response = await API.get("/events/public", { params });
	return response.data?.data ?? { events: [], pagination: {} };
}

export async function getPublicJobEvents(params = {}) {
	const response = await API.get("/events/job-events", { params });
	return response.data?.data ?? {
		jobFairs: [],
		jobDrives: [],
		pagination: {},
	};
}

export default getPublicEvents;
