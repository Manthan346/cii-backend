import API from "../api";

export async function fetchInstructorDashboard() {
  const res = await API.get("/instructor/instructor-dashboard");
  return res.data.data; // { summary: {...}, batchOverview: [...] }
}