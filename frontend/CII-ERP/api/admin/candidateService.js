import API from "../api";

export async function fetchAdminCandidateStats() {
  const response = await API.get("/admin/candidates/stats");

  return response?.data?.data ?? {};
}

export async function fetchAdminCandidateEnrollments({
  page = 1,
  limit = 10,
  search = "",
  attendance,
} = {}) {
  const params = { page, limit };

  if (search?.trim()) params.search = search.trim();
  if (attendance === "high") params.attendance = "70-100";
  if (attendance === "mid") params.attendance = "40-69";
  if (attendance === "low") params.attendance = "0-39";

  const response = await API.get("/admin/candidates/", { params });

  return (
    response?.data?.data ?? {
      enrollments: [],
      pagination: { page, limit, total: 0, totalPages: 1 },
    }
  );
}

export async function uploadAdminCandidateCertificate(
  candidateId,
  enrollmentId,
  file,
) {
  const formData = new FormData();
  formData.append("certificate", file);

  const response = await API.post(
    `/admin/candidates/${candidateId}/enrollments/${enrollmentId}/certificate`,
    formData,
  );

  return response?.data?.data;
}
