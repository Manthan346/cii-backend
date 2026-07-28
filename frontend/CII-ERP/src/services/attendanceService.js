// attendanceService.js
// Data layer for the Attendance page.
//
// LIVE:  summary stat tiles, eligibility banner, "By Courses" panel,
//        and the course/batch filter options — all backed by real
//        endpoints.
// MOCK:  calendar days, recent log, attendance overview donut — see
//        the comment above each block for why.

import API from "../../api/api"; // axios instance with baseURL + auth interceptor

const ELIGIBILITY_THRESHOLD = 75;

// ────────────────────────────────────────────────────────────
// LIVE ENDPOINTS
// ────────────────────────────────────────────────────────────

// GET /candidate/candidate-attendance?courseId=...
// courseId is optional — omit it for the "all courses" view.
async function fetchAttendanceSummary(courseId) {
  const res = await API.get("/candidate/candidate-attendance", {
    params: courseId ? { courseId } : {},
  });
  return res.data.data; // ApiResponse(200, data, message) → unwrap `.data`
}

// GET /candidate/candidate-allCourses-attendance
// Per-course totals — feeds both the "By Courses" panel and the
// filter dropdown's option list.
async function fetchAllCoursesAttendance() {
  const res = await API.get("/candidate/candidate-allCourses-attendance");
  return res.data.data.courses; // [{ course_id, course_name, totalSessions, attendedSessions, attendancePercentage }]
}

// GET /candidate/candidate-attendance-calendar?courseId=&month=&year=
// ⚠️ Verify this route against your router file — only the handler
// name (candidateAttendanceCalendar) was shared.
//
// courseId is REQUIRED for real day data: the backend returns
// `calendar: null` when it's omitted (its "all courses" case is
// summary-only, no day grid). fetchAttendanceCalendar below guards
// for this and skips the network call entirely without a courseId.
async function fetchCalendarRaw({ courseId, month, year }) {
  const res = await API.get("/candidate/candidate-attendance", {
    params: { courseId, month, year },
  });
  return res.data.data; // { month, year, courseId, summary, courses, calendar }
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Returns null if no courseId is given — AttendanceCalendar treats
// `days === null` as "no course selected" and shows a placeholder
// instead of an (inaccurate) empty grid.
export async function fetchAttendanceCalendar({ courseId, month, year }) {
  if (!courseId) return null;

  const raw = await fetchCalendarRaw({ courseId, month, year });

  if (!raw || !raw.calendar) return null;

  // Backend returns a status per calendar day, including nulls for
  // weekends/future/out-of-batch dates. The calendar component only
  // needs entries that actually have a status.
  const days = raw.calendar
    .filter((d) => d.status)
    .map((d) => ({
      date: Number(d.date.slice(8, 10)), // "2026-07-16" -> 16
      // NOTE: backend can return "late" as a status. AttendanceCalendar's
      // CSS only defines swatches for present/absent/holiday — add a
      // `.calendar__cell--late` rule if you want it styled distinctly,
      // otherwise it'll render as a plain unstyled cell.
      status: d.status,
    }));

  return {
    monthLabel: `${MONTH_NAMES[raw.month - 1]} ${raw.year}`,
    year: raw.year,
    month: raw.month,
    days,
  };
}

// Deterministic icon/colour per course so "By Courses" doesn't need
// backend-supplied styling. Cycles through a fixed palette.
const COURSE_ICON_STYLES = [
  { icon: "person", iconBg: "#EFE8FB", iconColor: "#7A4FBF" },
  { icon: "star", iconBg: "#FCEFD9", iconColor: "#B8892A" },
  { icon: "shield", iconBg: "#E6EEF8", iconColor: "#2F6FB0" },
  { icon: "checkCircle", iconBg: "#E4F6EC", iconColor: "#1B8A4F" },
];
const styleForIndex = (i) => COURSE_ICON_STYLES[i % COURSE_ICON_STYLES.length];

// GET /candidate/candidate-attendance-recentLog
// ⚠️ Verify this route against your router file.
// Global feed across all enrolled courses — not scoped by the course
// filter, so it's fetched once rather than re-fetched on every filter
// change (see Attendance.jsx).
async function fetchRecentLogRaw() {
  const res = await API.get("/candidate/candidate-attendance-recentLog");
  return res.data.data.recentLogs; // [{ date, status, course_id, course_name }]
}

// "2026-07-17" -> "17 Jul", to match the existing UI style. Adjust the
// locale/options if you want a different format.
function formatLogDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export async function fetchRecentLog() {
  const raw = await fetchRecentLogRaw();
  return raw.map((entry) => ({
    id: `${entry.date}-${entry.course_id}`, // no id from backend — synthesize one
    date: formatLogDate(entry.date),
    course: entry.course_name,
    status: entry.status,
  }));
}

// ────────────────────────────────────────────────────────────
// MOCK — intentionally left in place, per instruction / missing
// backend support. Do not wire these to real endpoints yet:
//   • calendar   — course-scoped only; "All courses" has no day grid (see above)
//   • overview   — left static, don't touch
// ────────────────────────────────────────────────────────────

const MOCK_OVERVIEW = { presentPct: 85, absentPct: 15 };

// ────────────────────────────────────────────────────────────
// Public API — consumed by Attendance.jsx
// ────────────────────────────────────────────────────────────

// Options for the course/batch filter dropdown.
// Kept as its own call so the filter can populate independently of
// the rest of the page finishing its fetch.
export async function fetchCourseOptions() {
  const courses = await fetchAllCoursesAttendance();
  return courses.map((c) => ({ id: c.course_id, name: c.course_name }));
}

// courseId: null/undefined => unfiltered ("All courses")
export async function fetchAttendanceData(courseId = null) {
  const [summaryRes, courses] = await Promise.all([
    fetchAttendanceSummary(courseId),
    fetchAllCoursesAttendance(),
  ]);

  const { attendedSessions, missedSessions, attendancePercentage } =
    summaryRes.summary;

  // Eligibility banner: surface whichever course is furthest below
  // threshold. If nothing's below threshold, hide the banner.
  const lowest = courses.reduce(
    (min, c) =>
      min === null || c.attendancePercentage < min.attendancePercentage
        ? c
        : min,
    null,
  );
  const alert =
    lowest && lowest.attendancePercentage < ELIGIBILITY_THRESHOLD
      ? { courseName: lowest.course_name, thresholdPct: ELIGIBILITY_THRESHOLD }
      : null;

  return {
    summary: {
      overallPct: attendancePercentage,
      sessionsAttended: attendedSessions,
      sessionsMissed: missedSessions,
      // TODO: candidateAttendanceSummary currently counts "present"
      // and "late" together as attendedSessions, so there's no way
      // to isolate late arrivals yet. Wire this up once the backend
      // exposes it separately.
      lateArrivals: 0,
    },
    alert,
    // NOTE: calendar is fetched separately via fetchAttendanceCalendar,
    // since it needs its own month/year state independent of this
    // (all-time) summary. See Attendance.jsx.
    courses: courses.map((c, i) => ({
      id: c.course_id,
      name: c.course_name,
      pct: c.attendancePercentage,
      ...styleForIndex(i),
    })),
    overview: MOCK_OVERVIEW, // untouched, per instruction
  };
}
