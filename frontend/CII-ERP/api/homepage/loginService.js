import API from "../api.js";

export async function getLoginCenters() {
  const response = await API.get("/enquiry/centers");
  return response.data?.data?.centers ?? [];
}

export async function loginUser(credentials) {
  const response = await API.post("/user/login", credentials);
  return response.data?.data ?? response.data;
}