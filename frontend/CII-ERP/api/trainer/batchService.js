import api from "../api";
import { fetchPaginatedPage } from "./paginationService";

const pendingBatchPageRequests = new Map();
const pendingBatchDetailsRequests = new Map();

function fetchBatchPage(params) {
  const key = JSON.stringify(
    Object.keys(params)
      .sort()
      .map((name) => [name, params[name]]),
  );
  const pending = pendingBatchPageRequests.get(key);
  if (pending) return pending;

  const request = api
    .get("/instructor/batches-details", { params })
    .then((response) => response.data.data);
  pendingBatchPageRequests.set(key, request);
  request.then(
    () => pendingBatchPageRequests.delete(key),
    () => pendingBatchPageRequests.delete(key),
  );
  return request;
}

/**
 * Fallback labels for batches whose start or end date is unavailable.
 * When both dates exist, the table status is derived from the date range.
 */
const STATUS_ENUM_TO_LABEL = {
  ACTIVE: "Active",
  INACTIVE: "Dropped",
  UPCOMING: "Upcoming",
};

function isAllOption(value) {
  return !value || value.toLowerCase().startsWith("all ");
}

function dateKey(value) {
  if (!value) return null;
  if (typeof value === "string") {
    const isoDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    if (isoDate) return isoDate;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateBasedStatus(startDate, endDate) {
  const start = dateKey(startDate);
  const end = dateKey(endDate);
  if (!start || !end) return null;

  const today = dateKey(new Date());
  if (today < start) return "Upcoming";
  if (today > end) return "Expired";
  return "Active";
}

function getBatchStatus(batch) {
  const dateStatus = getDateBasedStatus(
    batch.batch_start_date ??
      batch.start_date ??
      batch.batchStartDate ??
      batch.startDate,
    batch.batch_end_date ??
      batch.end_date ??
      batch.batchEndDate ??
      batch.batch_endDate ??
      batch.endDate,
  );

  return dateStatus ?? STATUS_ENUM_TO_LABEL[batch.status] ?? batch.status;
}

function formatDate(value) {
  if (!value) return "—";

  let date;
  if (typeof value === "string") {
    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) {
      date = new Date(
        Number(isoDate[1]),
        Number(isoDate[2]) - 1,
        Number(isoDate[3]),
      );
    }
  }

  date ??= new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Transforms one raw batch row from getInstructorBatches into the
 * shape BatchTable/data/batches.js already expects.
 *
 */
function mapBatch(raw) {
  const startDate =
    raw.batch_start_date ??
    raw.start_date ??
    raw.batchStartDate ??
    raw.startDate;
  const endDate =
    raw.batch_end_date ??
    raw.end_date ??
    raw.batchEndDate ??
    raw.batch_endDate ??
    raw.endDate;

  return {
    id: raw.batch_id,
    name: raw.batch_name ?? raw.batchName ?? "—",
    code: raw.batch_code,
    course: raw.course_name ?? "—",
    courseId: raw.course_id ?? null, // needed to build the Courses filter client-side
    candidates: raw.total_candidates_enrolled ?? 0,
    startDateValue: startDate,
    endDateValue: endDate,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    status:
      getDateBasedStatus(startDate, endDate) ??
      STATUS_ENUM_TO_LABEL[raw.status] ??
      raw.status,
  };
}

/**
 * Fetches the paginated/filtered batch list.
 *
 * @param {Object} params
 * @param {number} params.page
 * @param {number} params.limit
 * @param {string} [params.search]      - matches batch_name OR batch_code
 * @param {string} [params.courseId]    - real course_id, not display name
 * @param {string} [params.courseType]  - online | offline | hybrid
 * @param {string} [params.status]      - date-derived UI status
 */
export async function fetchBatches({
  page = 1,
  limit = 15,
  search,
  courseId,
  courseType,
  status,
} = {}) {
  const params = { limit };

  if (search && search.trim()) params.search = search.trim();
  if (courseId) params.courseId = courseId;
  if (courseType && !isAllOption(courseType)) params.courseType = courseType;

  const fetchPage = async (requestPage) => {
    return fetchBatchPage({ ...params, page: requestPage });
  };

  let data;
  if (!status || status.toLowerCase().startsWith("all status")) {
    data = await fetchPaginatedPage({
      fetchPage,
      page,
      limit,
      itemsKey: "batches",
    });
  } else {
    const firstPage = await fetchPage(1);
    const firstBatches = firstPage.batches ?? [];
    const serverPagination = firstPage.pagination ?? {};
    const totalRecords = Number(
      serverPagination.totalRecords ??
        serverPagination.totalBatches ??
        serverPagination.total ??
        firstBatches.length,
    );
    const reportedPageSize = Number(serverPagination.limit);
    const serverPageSize =
      firstBatches.length > 0 && firstBatches.length < totalRecords
        ? Math.min(reportedPageSize || firstBatches.length, firstBatches.length)
        : reportedPageSize || firstBatches.length || limit;
    const serverTotalPages =
      Math.ceil(totalRecords / serverPageSize) ||
      Number(serverPagination.totalPages) ||
      1;
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(0, serverTotalPages - 1) }, (_, index) =>
        fetchPage(index + 2),
      ),
    );
    const allBatches = [
      ...firstBatches,
      ...remainingPages.flatMap((result) => result.batches ?? []),
    ];
    const matchingBatches = allBatches.filter(
      (batch) => getBatchStatus(batch) === status,
    );
    const startIndex = (page - 1) * limit;

    data = {
      ...firstPage,
      batches: matchingBatches.slice(startIndex, startIndex + limit),
      pagination: {
        ...serverPagination,
        currentPage: page,
        totalRecords: matchingBatches.length,
        totalPages: Math.max(1, Math.ceil(matchingBatches.length / limit)),
        limit,
      },
    };
  }

  // Course list derived client-side from THIS response's raw batches
  // (not the backend's `data.courses`, which is paginated/duplicated/
  // missing ids). Deduped by course_id. BatchList.jsx merges this
  // across fetches so the dropdown accumulates as the user searches/pages,
  // since a single page/search only ever surfaces a subset of courses.
  const coursesFromPage = Array.from(
    new Map(
      (data.batches ?? [])
        .filter((b) => b.course_id)
        .map((b) => [b.course_id, { id: b.course_id, name: b.course_name }]),
    ).values(),
  );

  const batches = (data.batches ?? []).map(mapBatch);

  return {
    batches,
    pagination: data.pagination, // { currentPage, limit, totalRecords, totalPages, hasNextPage, hasPrevPage }
    courses: coursesFromPage,
  };
}

/** Fetches the total batch count and date-derived status counts. */
export async function fetchBatchStats() {
  const [statsResponse, firstPageResponse] = await Promise.all([
    api.get("/instructor/batches-card-data"),
    fetchBatchPage({ page: 1, limit: 15 }),
  ]);
  const stats = statsResponse.data.data;
  const firstPage = firstPageResponse;
  const firstBatches = firstPage.batches ?? [];
  const pagination = firstPage.pagination ?? {};
  const totalRecords = Number(
    pagination.totalRecords ??
      pagination.totalBatches ??
      pagination.total ??
      firstBatches.length,
  );
  const reportedPageSize = Number(pagination.limit);
  const serverPageSize =
    firstBatches.length > 0 && firstBatches.length < totalRecords
      ? Math.min(reportedPageSize || firstBatches.length, firstBatches.length)
      : reportedPageSize || firstBatches.length || 15;
  const serverTotalPages =
    Math.ceil(totalRecords / serverPageSize) ||
    Number(pagination.totalPages) ||
    1;
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, serverTotalPages - 1) }, (_, index) =>
      fetchBatchPage({ page: index + 2, limit: 15 }),
    ),
  );
  const allBatches = [
    ...firstBatches,
    ...remainingPages.flatMap((page) => page.batches ?? []),
  ];
  const dateBasedStatuses = allBatches.map(getBatchStatus);

  return {
    totalBatches: stats.totalBatch ?? totalRecords,
    active: dateBasedStatuses.filter((status) => status === "Active").length,
    upcoming: dateBasedStatuses.filter((status) => status === "Upcoming").length,
  };
}

/**
 * Fetches full detail for one batch — powers the eye icon.
 */
export async function fetchBatchDetails(batchId) {
  const pending = pendingBatchDetailsRequests.get(batchId);
  if (pending) return pending;

  const request = api
    .get(`/instructor/batch-details/${batchId}`)
    .then((response) => response.data.data.batchDetails);
  pendingBatchDetailsRequests.set(batchId, request);
  request.then(
    () => pendingBatchDetailsRequests.delete(batchId),
    () => pendingBatchDetailsRequests.delete(batchId),
  );
  return request;
}

// ---- Courses (for the Create Batch dropdown) ----

/**
 * Fetches the company's courses for the Create Batch course dropdown.
 * Returns [{ id: course_id, name: course_name }].
 */
export async function fetchCourseOptions() {
  const res = await api.get("/instructor/get-all-courses-and-batches");
  const courses = res.data.data.courses ?? [];
  return courses.map((c) => ({ id: c.course_id, name: c.course_name }));
}

// ---- Create batch ----

const DEFAULT_BATCH_TYPE = "ACADEMIC"; // confirmed from live data
const DEFAULT_B_STATUS = "ACTIVE"; // per instruction, new batches start active

/**
 * Creates a new batch. Expects form.startDate / form.endDate as
 * native <input type="date"> values ("yyyy-mm-dd"), and form.courseId
 * as a real course_id selected from fetchCourseOptions().
 */
export async function createBatch(form) {
  if (!form.courseId) {
    throw new Error("Please select a course.");
  }
  if (!form.startDate || !form.endDate) {
    throw new Error("Please select start and end dates.");
  }

  const max_candidates = Number(form.maxCandidates);
  if (!max_candidates || max_candidates <= 0) {
    throw new Error("Maximum candidates must be a positive number.");
  }

  const payload = {
    batch_name: form.batchName.trim(),
    batch_code: form.batchCode.trim(),
    batch_desc: form.notes?.trim() || "",
    course_id: form.courseId,
    batch_start_date: new Date(form.startDate).toISOString(),
    batch_end_date: new Date(form.endDate).toISOString(),
    max_candidates,
    batch_type: DEFAULT_BATCH_TYPE,
    b_status: DEFAULT_B_STATUS,
  };

  const res = await api.post("/instructor/create-batch", payload);
  return res.data.data.batchDetails;
}

export async function updateBatch(batchId, form, originalDates) {
  const payload = {
    batch_name: form.batchName.trim(),
    batch_code: form.batchCode.trim(),
    batch_desc: form.notes.trim(),
    max_candidates: Number(form.maxCandidates),
    batch_type: form.batchType,
    batch_status: form.batchStatus,
  };

  if (form.startDate !== originalDates.startDate) {
    payload.batch_start_date = new Date(form.startDate).toISOString();
  }
  if (form.endDate !== originalDates.endDate) {
    payload.batch_end_date = new Date(form.endDate).toISOString();
  }

  const res = await api.patch(
    `/instructor/batch-details/${batchId}`,
    payload,
  );
  return res.data.data.updatedBatchDetails;
}
