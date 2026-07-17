// Dummy options for the filter bar dropdowns.
// Swap these arrays for API-driven lists once the backend is connected
// (e.g. GET /api/batches, GET /api/courses).

// NOTE: "All braches" reproduces the label exactly as it appears in the
// reference design. Rename to "All branches" if that was a design typo.
export const batchOptions = ['All Batches', 'All braches', 'DS-24', 'PY-18', 'SQL-20'];

export const courseOptions = [
  'All Courses',
  'Data Science',
  'Python programming',
  'Business comm.',
];

export const statusOptions = ['All Status', 'All status', 'Active', 'Dropped', 'Ending soon'];

/* ---- Batch Management additions ----
   Options for the Batch List page's filter bar (Search / Trainers /
   Courses / Status). Kept separate from the candidate filter arrays
   above since the label set/wording differs slightly. */
export const trainerFilterOptions = ['All Trainers', 'rohit mehta', 'Anjali patil', 'Neha wagh'];

export const batchCourseOptions = ['All Courses', 'Data Science', 'Python programming', 'Business comm.'];

export const batchStatusOptions = ['All Status', 'Active', 'Dropped', 'Ending Soon', 'Upcoming'];

/* ---- Attendance Management additions ----
   Status filter for the "Today's Attendance" table. Batch dropdown
   reuses `batchOptions` above since the batch list is shared across
   Candidate/Attendance pages. */
export const attendanceStatusOptions = ['All Status', 'Present', 'Late', 'Absent'];
