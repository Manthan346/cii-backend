// Dummy options for the filter bar dropdowns.
// Swap these arrays for API-driven lists once the backend is connected
// (e.g. GET /api/batches, GET /api/courses).

export const batchOptions = ["All Batches", "DS-24", "PY-18", "SQL-20"];

export const courseOptions = [
  "All Courses",
  "Data Science",
  "Python programming",
  "Business comm.",
];

export const statusOptions = [
  "All Status",
  "All status",
  "Active",
  "Dropped",
  "Ending soon",
  "Blacklisted", // 👈 add this
];

/* ---- Batch Management additions ----
   Options for the Batch List page's filter bar (Search / Trainers /
   Courses / Status). Kept separate from the candidate filter arrays
   above since the label set/wording differs slightly. */
export const trainerFilterOptions = [
  "All Trainers",
  "rohit mehta",
  "Anjali patil",
  "Neha wagh",
];

export const batchCourseOptions = [
  "All Courses",
  "Data Science",
  "Python programming",
  "Business comm.",
];

export const batchStatusOptions = [
  "All Status",
  "Active",
  "Dropped",
  "Ending Soon",
  "Upcoming",
];

/* ---- Attendance Management additions ----
   Status filter for the "Today's Attendance" table. Batch dropdown
   reuses `batchOptions` above since the batch list is shared across
   Candidate/Attendance pages. */
export const attendanceStatusOptions = [
  "All Status",
  "Present",
  "Late",
  "Absent",
];

/* ---- Study Material Upload additions ----
   Status filter for the "All Materials" table. Batch dropdown reuses
   `batchOptions` above (backend only filters study materials by
   batch_id — there is no course-level filter on that endpoint). */
export const materialTypeOptions = ["All type", "PDF", "Video", "PPT", "DOC"];

export const materialStatusOptions = ["All Status", "Published", "Draft"];

/* ---- Task Assigned additions ----
   Assignee / Priority / Status filters for the "Task assigned" page's
   filter bar. Wording (casing) reproduces the reference design exactly,
   same convention as "All braches" above. */
export const taskAssigneeOptions = [
  "All Assignees",
  "Rohit mehta",
  "Anjali rane",
  "karan bhosale",
];

export const taskPriorityOptions = ["All priorities", "High", "medium", "low"];

export const taskStatusOptions = ["All status", "Present", "absent", "late"];
