import API from "../api";

export async function createSuperAdminAdmin(payload) {
	const response = await API.post("/super-admin/createAdmin", payload);
	return response?.data?.data ?? {};
}
