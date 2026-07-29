// Dummy data for the Resources page.
// Replace with API responses later, e.g.
//   GET /api/resources/stats     -> resourceStats
//   GET /api/resources/summary   -> quickAccessCards
//   GET /api/resources?page=1    -> resourceRecords

// ---- Summary cards: Total resources / Study materials / Added this week / Storage used ----
export const resourceStats = [
  {
    id: 'total',
    label: 'Total resources',
    value: 24,
    icon: 'grid',
    tone: 'blue',
  },
  {
    id: 'studyMaterials',
    label: 'Study materials',
    value: 16,
    icon: 'check',
    tone: 'green',
  },
  {
    id: 'addedThisWeek',
    label: 'Added this week',
    value: 6,
    icon: 'hourglass',
    tone: 'skyblue',
  },
  {
    id: 'storageUsed',
    label: 'Storage used',
    value: 5,
    icon: 'calendar',
    tone: 'yellow',
  },
];

// ---- Quick-access cards row (Study material upload / Reports / Guidelines & templates) ----
export const quickAccessCards = [
  {
    id: 'study-material',
    icon: 'layers',
    title: 'Study material upload',
    subtitle: '168 files · PDFs, videos & slides',
  },
  {
    id: 'reports',
    icon: 'chart',
    title: 'Reports',
    subtitle: '38 generated reports',
  },
  {
    id: 'guidelines',
    icon: 'bookmark',
    title: 'Guidelines & templates',
    subtitle: '8 shared documents',
  },
];

// ---- Filter bar dropdown options (Category / Type) ----
export const resourceCategoryOptions = [
  'All categories',
  'Study material',
  'Preparation quiz',
  'Reports',
  'Guidelines',
];

export const resourceTypeOptions = ['All types', 'PDF', 'PPT', 'Video', 'Doc'];

// ---- Page-level meta (subtitle, table caption, pagination) ----
export const resourceMeta = {
  totalResources: 24,
  totalPages: 10,
};

// ---- "All Task" table rows ----
export const resourceRecords = [
  {
    id: 1,
    name: 'cyber security module 6 -Notes.pdf',
    subtitle: 'cyber security',
    category: 'Study material',
    updatedBy: 'Anjali rane',
    date: '10 july 2026',
    size: '3.2 MB',
  },
  {
    id: 2,
    name: 'artificial intelligence ppt',
    subtitle: 'AI',
    category: 'Study material',
    updatedBy: 'rohit mehta',
    date: '15 july 2026',
    size: '3.2 MB',
  },
  {
    id: 3,
    name: 'prepare AI quiz',
    subtitle: 'Artificial intelligence',
    category: 'preparation quiz',
    updatedBy: 'karan bhosale',
    date: '19 july 2026',
    size: '3.2 MB',
  },
];
