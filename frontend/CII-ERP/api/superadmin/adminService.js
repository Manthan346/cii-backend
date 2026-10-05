import API from "../api";

export async function fetchSuperAdminAdmins(page = 1, limit = 20) {
	const response = await API.get("/super-admin/admins", {
		params: { page, limit },
	});
	const data = response?.data?.data ?? {};

	return {
		admins: data.admins ?? [],
		pagination: data.pagination ?? { total: 0, page, limit, totalPages: 0 },
	};
}

export async function createSuperAdminAdmin(payload) {
	const response = await API.post("/super-admin/createAdmin", payload);
	return response?.data?.data ?? {};
}
