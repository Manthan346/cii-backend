import API from "../api.js";

export async function getPublicEvents(params = {}) {
	const response = await API.get("/events/public", { params });
	return response.data?.data ?? { events: [], pagination: {} };
}

export default getPublicEvents;
