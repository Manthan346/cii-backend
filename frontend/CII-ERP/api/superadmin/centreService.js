import API from "../api";

export async function fetchCenterDetails() {
  const response = await API.get("/super-admin/center/details");
  return response?.data?.data?.centers ?? [];
}

export async function createCenter(payload) {
  const response = await API.post("/super-admin/createCenter", payload);
  return response?.data?.data ?? {};
}
