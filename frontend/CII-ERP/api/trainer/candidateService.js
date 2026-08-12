import api from "../api";

// Confirmed against batch_enrollment_status_type usage in
// getCandidateStatistics.ts and the update-status PATCH example.
// "Ending soon" in the UI's statusOptions has no backend equivalent —
// omitted here until that's clarified.
const STATUS_LABEL_TO_ENUM = {
  'Active': 'ACTIVE',
  'Dropped': 'DROPPED',
  'Blacklisted': 'BLACKLIST',
  'Enrolled': 'ENROLLED',
};

function isAllStatusOption(value) {
  return !value || value.toLowerCase().startsWith('all status');
}

export async function fetchCandidateOverview({ page = 1, limit = 6, status, search, batchId } = {}) {
  const params = { page, limit };
  if (!isAllStatusOption(status)) {
    const enumStatus = STATUS_LABEL_TO_ENUM[status];
    if (enumStatus) params.status = enumStatus;
  }
  if (search && search.trim()) params.search = search.trim();
  if (batchId) params.batch_code = batchId;   // 👈 add this

  const res = await api.get("/instructor/candidate-management/candidate-overview", { params });
  return res.data.data;
}

/**
 * ASSUMED route path — only the controller (getCandidateStatistics)
 * was shared, not its route registration. Confirm/correct this path
 * against your router file.
 */
export async function fetchCandidateStats() {
  const res = await api.get("/instructor/candidate-management/statistics");
  return res.data.data.summary; // { totalCandidates, activeCandidates, droppedCandidates, blacklistedCandidates }
}

export async function updateCandidateStatus(enrollmentId, newStatusLabel) {
  const enumStatus = STATUS_LABEL_TO_ENUM[newStatusLabel];
  if (!enumStatus) {
    throw new Error(`Cannot map status "${newStatusLabel}" to a backend enum value`);
  }
  const res = await api.patch("/instructor/candidate-management/update-status", {
    enrollment_id: enrollmentId,
    enrollment_status: enumStatus,
  });
  return res.data;
}

/**
 * Fetches detailed profile info for one candidate, for the "eye" view
 * modal. Confirmed against the real viewCandidateProfile controller —
 * supersedes the earlier (incorrect) API spec doc.
 */
export async function fetchCandidateProfile(enrollmentId) {
  const res = await api.get("/instructor/candidate-management/view-candidate-profile", {
    params: { enrollment_id: enrollmentId },
  });
  return res.data.data; // matches the { ...guardianDetails } convention seen elsewhere
}

/**
 * Fetches real batch/course lists (id + name pairs) for the filter
 * dropdowns, replacing the static name-only arrays in filterOptions.js.
 */
export async function fetchCoursesAndBatches() {
  const res = await api.get("/instructor/get-all-courses-and-batches");
  return res.data.data; // { company_id, courses: [{course_id, course_name}], batches: [{batchId, batch_code}] }
}