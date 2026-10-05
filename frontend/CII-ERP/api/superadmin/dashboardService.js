import API from "../api";

const getData = (response) => response?.data?.data ?? {};

export async function fetchDashboardData() {
  const response = await API.get("/super-admin/dashboardData");
  return getData(response);
}

export async function fetchEnrollmentTrend() {
  const response = await API.get("/super-admin/enrollment-trend");
  return getData(response)?.candidate_enrollment_trend ?? {};
}

export async function fetchCenterWiseEnrollment() {
  const response = await API.get("/super-admin/center-wise-enrollment");
  return getData(response)?.centre_wise_candidate_count ?? {};
}
