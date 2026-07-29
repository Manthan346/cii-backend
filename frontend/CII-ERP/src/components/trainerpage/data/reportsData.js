// Dummy data for the Reports page.
// Replace with API responses later, e.g.
//   GET /api/reports/stats            -> reportStats
//   GET /api/reports/attendance-overview -> attendanceOverviewByBatch
//   GET /api/reports?page=1           -> reportRecords

// ---- Summary cards: Total reports / Scheduled / Generated this month / Avg. generation time ----
export const reportStats = [
  {
    id: 'total',
    label: 'Total reports',
    value: 38,
    icon: 'grid',
    tone: 'teal',
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    value: 6,
    icon: 'clock',
    tone: 'green',
  },
  {
    id: 'generatedThisMonth',
    label: 'generated this month',
    value: 9,
    icon: 'file',
    tone: 'peach',
  },
  {
    id: 'avgGenerationTime',
    label: 'Avg. generation time',
    value: '1.2 min',
    icon: 'trend',
    tone: 'yellow',
  },
];

// ---- "Attendance overview by batch" panel (label + completion percent) ----
export const attendanceOverviewByBatch = [
  { id: 1, label: 'CS-24. cyber security', value: 94 },
  { id: 2, label: 'AI-08. Artificial intelligence', value: 75 },
  { id: 3, label: 'HK-04. Housekeeping', value: 80 },
  { id: 4, label: 'HK-04. Housekeeping', value: 60 },
];

export const attendanceOverviewMeta = {
  title: 'Attendance overview by batch-june 2026',
};

// ---- Filter bar / Generate report modal dropdown options ----
export const reportTypeOptions = [
  'All type',
  'Attendance',
  'Performance',
  'Batch summary',
];

export const reportBatchOptions = ['All Batches', 'CS-24', 'AI-08', 'HK-04'];

export const reportFormatOptions = ['PDF', 'XLSX', 'CSV'];

// ---- Page-level meta (subtitle, table caption, pagination) ----
export const reportMeta = {
  totalReports: 38,
  totalPages: 10,
};

// ---- "All reports" table rows ----
export const reportRecords = [
  {
    id: 1,
    name: 'monthly attendance report-june',
    type: 'Attendance',
    batch: 'All batches',
    generatedOn: '07 july 2026',
    generatedBy: 'Rohit mehta',
    format: 'XLSX',
  },
  {
    id: 2,
    name: 'CS-24 performance summary-Q2',
    type: 'performance',
    batch: 'CS-24',
    generatedOn: '03 july 2026',
    generatedBy: 'Anjali rane',
    format: 'PDF',
  },
  {
    id: 3,
    name: 'batch summary-CS-18',
    type: 'batch summary',
    batch: 'CS-18',
    generatedOn: '17 jun 2026',
    generatedBy: 'Karan bhosale',
    format: 'PDF',
  },
];
