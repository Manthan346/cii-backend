import API from "../api.js";

export async function fetchRecruiterDashboard() {
  const response = await API.get("/hr/dashboard");
  return response.data?.data ?? {};
}

export async function fetchRecruiterApplicationsPerJob() {
  const response = await API.get("/hr/dashboard/application-graph");
  return Array.isArray(response.data?.data) ? response.data.data : [];
}
