// Dummy batch rows for the Batch Management "All Batches" table.
// Replace with an API response later, e.g. GET /api/batches?page=1
//
// Shape mirrors the reference design: each batch has one trainer, one
// course (with a completion %), a running candidate count, a start
// date, and a status pill.
export const batches = [
  {
    id: 1,
    code: 'DS-24',
    trainer: 'rohit mehta',
    course: 'Data Science',
    progress: 85,
    candidates: 32,
    startDate: '12 jan 2026',
    status: 'Active',
  },
  {
    id: 2,
    code: 'PY-18',
    trainer: 'rohit mehta',
    course: 'Python programming',
    progress: 98,
    candidates: 48,
    startDate: '16 jan 2026',
    status: 'Active',
  },
  {
    id: 3,
    code: 'DS-18',
    trainer: 'Anjali patil',
    course: 'Data Science',
    progress: 50,
    candidates: 24,
    startDate: '2 feb 2026',
    status: 'Dropped',
  },
  {
    id: 4,
    code: 'BC-18',
    trainer: 'rohit mehta',
    course: 'Business comm.',
    progress: 30,
    candidates: 30,
    startDate: '20 feb 2026',
    status: 'Active',
  },
  {
    id: 5,
    code: 'BC-18',
    trainer: 'Neha wagh',
    course: 'Business comm.',
    progress: 75,
    candidates: 35,
    startDate: '12 feb 2026',
    status: 'Ending Soon',
  },
  {
    id: 6,
    code: 'PY-18',
    trainer: 'rohit mehta',
    course: 'Python programming',
    progress: 60,
    candidates: 38,
    startDate: '12 mar 2026',
    status: 'Active',
  },
];

// Summary counts shown above the table/search (kept independent from
// batches.length because the reference design shows "9 batches" total
// while only 6 rows are loaded on page 1 - swap for a real count once
// the backend paginates this list).
export const batchListMeta = {
  totalBatches: 9,
  totalCourses: 4,
  showing: 6,
};
