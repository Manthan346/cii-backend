import api from "../api";
import { fetchPaginatedPage } from "./paginationService";

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

export async function fetchCandidateOverview({
  page = 1,
  limit = 15,
  status,
  search,
  batchId,
  courseName,
} = {}) {
  const params = { limit };
  if (!isAllStatusOption(status)) {
    const enumStatus = STATUS_LABEL_TO_ENUM[status];
    if (enumStatus) params.status = enumStatus;
  }
  if (search && search.trim()) params.search = search.trim();

  const fetchPage = async (requestPageNumber, batchCode) => {
    const res = await api.get(
      "/instructor/candidate-management/candidate-overview",
      {
        params: {
          ...params,
          page: requestPageNumber,
          ...(batchCode ? { batch_code: batchCode } : {}),
        },
      },
    );
    return res.data.data;
  };

  if (courseName) {
    const firstPage = await fetchPage(1, batchId);
    const firstCandidates = firstPage.candidates ?? [];
    const pagination = firstPage.pagination ?? {};
    const total =
      Number(pagination.totalCandidates ?? pagination.totalRecords) ||
      firstCandidates.length;
    const reportedPageSize = Number(pagination.limit);
    const serverPageSize =
      firstCandidates.length > 0 && firstCandidates.length < total
        ? Math.min(reportedPageSize || firstCandidates.length, firstCandidates.length)
        : reportedPageSize || firstCandidates.length || limit;
    const serverTotalPages = Math.ceil(total / serverPageSize);
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, serverTotalPages - 1) }, (_, index) =>
        fetchPage(index + 2, batchId),
      ),
    );
    const matchingCandidates = [
      ...firstCandidates,
      ...remainingPages.flatMap((result) => result.candidates ?? []),
    ].filter((candidate) => {
      const name =
        candidate.course_name ??
        candidate.course_details?.course_name ??
        candidate.batch_details?.course_details?.course_name;
      return String(name ?? "").trim().toLowerCase() === courseName.trim().toLowerCase();
    });
    const startIndex = (page - 1) * limit;

    return {
      candidates: matchingCandidates.slice(startIndex, startIndex + limit),
      pagination: {
        currentPage: page,
        totalCandidates: matchingCandidates.length,
        totalRecords: matchingCandidates.length,
        totalPages: Math.max(1, Math.ceil(matchingCandidates.length / limit)),
        limit,
      },
    };
  }

  return fetchPaginatedPage({
    fetchPage: (requestPage) => fetchPage(requestPage, batchId),
    page,
    limit,
    itemsKey: "candidates",
    totalKeys: ["totalCandidates", "totalRecords"],
  });
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