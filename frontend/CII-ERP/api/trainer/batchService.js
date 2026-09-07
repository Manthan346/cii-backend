import api from "../api";

/**
 * Maps backend b_status enum -> UI status label.
 * ASSUMPTION: only "ACTIVE" is confirmed from the controller code you
 * shared. "INACTIVE" -> "Dropped" is a guess based on the UI's status
 * pills — confirm the real enum and correct this map if wrong.
 */
const STATUS_ENUM_TO_LABEL = {
  ACTIVE: "Active",
  INACTIVE: "Dropped",
  UPCOMING: "Upcoming",
};

const STATUS_LABEL_TO_ENUM = {
  Active: "ACTIVE",
  Dropped: "INACTIVE",
  Upcoming: "UPCOMING",
};

function isAllStatusOption(value) {
  return !value || value.toLowerCase().startsWith("all status");
}

function isAllOption(value) {
  return !value || value.toLowerCase().startsWith("all ");
}

/**
 * Formats an ISO date string -> "12 jan 2026" to match the existing
 * dummy-data style already used across the batch table.
 */
function formatDate(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Transforms one raw batch row from getInstructorBatches into the
 * shape BatchTable/data/batches.js already expects.
 *
 * NOTE: batch_end_date is NOT selected by the current backend
 * controller, so endDate always renders as "—" for now (per explicit
 * decision — revisit once batch_end_date is added to the select).
 */
function mapBatch(raw) {
  return {
    id: raw.batch_id,
    code: raw.batch_code,
    course: raw.course_name ?? "—",
    courseId: raw.course_id ?? null, // needed to build the Courses filter client-side
    candidates: raw.total_candidates_enrolled ?? 0,
    startDate: formatDate(raw.batch_start_date),
    endDate: "—", // TODO: swap to formatDate(raw.batch_end_date) once backend adds it
    status: STATUS_ENUM_TO_LABEL[raw.status] ?? raw.status,
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
 * @param {string} [params.status]      - UI label e.g. "Active"; mapped to enum
 */
export async function fetchBatches({
  page = 1,
  limit = 6,
  search,
  courseId,
  courseType,
  status,
} = {}) {
  const params = { page, limit };

  if (search && search.trim()) params.search = search.trim();
  if (courseId) params.courseId = courseId;
  if (courseType && !isAllOption(courseType)) params.courseType = courseType;
  if (!isAllStatusOption(status)) {
    const enumStatus = STATUS_LABEL_TO_ENUM[status];
    if (enumStatus) params.status = enumStatus;
  }

  const res = await api.get("/instructor/batches-details", { params });
  const data = res.data.data;

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

  return {
    batches: (data.batches ?? []).map(mapBatch),
    pagination: data.pagination, // { currentPage, limit, totalRecords, totalPages, hasNextPage, hasPrevPage }
    courses: coursesFromPage,
  };
}

/**
 * Fetches the 3 confirmed stat card counts. "Batches Completed" is
 * deliberately omitted — deferred per earlier decision. Caller should
 * render it as a static "—" until that endpoint/logic exists.
 */
export async function fetchBatchStats() {
  const res = await api.get("/instructor/batches-card-data");
  const data = res.data.data; // { totalBatch, ActiveBatches, upcomingBatches }
  return {
    totalBatches: data.totalBatch ?? 0,
    active: data.ActiveBatches ?? 0,
    upcoming: data.upcomingBatches ?? 0,
  };
}

/**
 * Fetches full detail for one batch — powers the eye icon.
 */
export async function fetchBatchDetails(batchId) {
  const res = await api.get(`/instructor/batch-details/${batchId}`);
  return res.data.data.batchDetails;
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
    batch_desc: form.notes?.trim() || undefined,
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
