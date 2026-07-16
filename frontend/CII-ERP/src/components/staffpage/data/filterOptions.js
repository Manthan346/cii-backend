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
