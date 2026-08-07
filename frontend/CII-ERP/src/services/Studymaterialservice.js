// Studymaterialservice.js
// Data layer for the Study Materials page.
//
// LIVE: single call to GET /candidate/candidate-studymaterial. The
// backend now resolves the candidate's enrolled batches internally and
// defaults to querying across ALL of them when batch_id is omitted —
// no per-batch fan-out, no separate "my courses" call.
//
// The "course" dropdown is derived client-side from batch_details
// already embedded in each returned row.
//
// ⚠️ Only the first MAX_PAGE_SIZE (50) materials are pulled, so the
// course dropdown only lists batches that appear among those 50 — a
// batch with zero materials, or materials past page 1, won't show up.
// Fine for now; revisit with real pagination if that becomes a problem.
//
// ⚠️ The backend's `search` param matches title/description, not course
// name. The UI's search box says "search by course name," so course-name
// filtering happens client-side instead — the backend search param is
// unused here for now.

import API from "../../api/api"; // ⚠️ adjust if your axios instance lives elsewhere

const MAX_PAGE_SIZE = 50; // backend caps `limit` at 50

const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const FILE_TYPE_ALIASES = {
  pdf: "pdf", ppt: "ppt", pptx: "ppt", doc: "doc", docx: "doc", xls: "xls", xlsx: "xls",
};

function startOfDay(value) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayMonth(date) {
  return `${date.getDate()} ${MONTH_ABBR[date.getMonth()]}`;
}

function formatDisplayDate(isoString) {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
}

// No file_type column on study_material — infer the badge from the
// document_link's extension instead.
function normalizeFileType(documentLink) {
  const match = (documentLink ?? "").toLowerCase().match(/\.(pdf|pptx?|docx?|xlsx?)(\?|#|$)/);
  if (!match) return "link";
  return FILE_TYPE_ALIASES[match[1]] ?? "link";
}

function formatUploaderName(instructorDetails) {
  if (!instructorDetails) return "—";
  const { instructor_first_name, instructor_last_name } = instructorDetails;
  const initial = instructor_first_name ? `${instructor_first_name[0]}.` : "";
  return `${initial}${instructor_last_name ?? ""}`.trim() || "—";
}

// Maps one raw study_material row (as returned by
// GET /candidate/candidate-studymaterial) into the { id, type, title,
// course, uploader, date, driveUrl } shape MaterialCard expects.
function mapRawToItem(raw) {
  return {
    id: raw.study_material_id,
    type: normalizeFileType(raw.document_link),
    title: raw.title,
    course: raw.batch_details?.batch_name ?? "",
    uploader: formatUploaderName(raw.user_login?.instructor_details),
    date: formatDisplayDate(raw.created_at),
    driveUrl: raw.document_link,
    created_at: raw.created_at,
    batch_id: raw.batch_id,
  };
}

// Buckets already-mapped items into date-labeled groups, newest first —
// matches "Today, 3 JUL" / "Yesterday, 2 JUL" / "Friday, 31 JUL" labels.
export function groupByDate(items) {
  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(today.getTime() - 86400000));

  const order = [];
  const buckets = new Map();

  for (const item of items) {
    const d = startOfDay(item.created_at);
    const label =
      d.getTime() === today.getTime() ? `Today, ${formatDayMonth(d)}` :
      d.getTime() === yesterday.getTime() ? `Yesterday, ${formatDayMonth(d)}` :
      `${WEEKDAY_LONG[d.getDay()]}, ${formatDayMonth(d)}`;

    if (!buckets.has(label)) {
      buckets.set(label, []);
      order.push(label);
    }
    buckets.get(label).push(item);
  }

  return order.map((label) => ({ label, items: buckets.get(label) }));
}

// GET /candidate/candidate-studymaterial?page=...&limit=...
// batch_id intentionally omitted — backend returns materials across
// every ACTIVE-enrolled batch when it's absent.
async function fetchStudyMaterialsRaw({ page = 1, limit = MAX_PAGE_SIZE } = {}) {
  const res = await API.get("/candidate/candidate-studymaterial", {
    params: { page, limit },
  });
  return res.data.data; // { studyMaterials, pagination }
}

// Fetches study materials across all enrolled batches in one call, and
// derives the batch/course list from what came back. Main entry point
// the page calls.
export async function getAllStudyMaterials() {
  const { studyMaterials } = await fetchStudyMaterialsRaw();

  const items = studyMaterials.map(mapRawToItem);

  const batchMap = new Map();
  for (const item of items) {
    if (item.batch_id && !batchMap.has(item.batch_id)) {
      batchMap.set(item.batch_id, { batch_id: item.batch_id, batch_name: item.course });
    }
  }

  return { items, batches: Array.from(batchMap.values()) };
}

export function getStudyMaterialGroups(items) {
  return groupByDate(items);
}