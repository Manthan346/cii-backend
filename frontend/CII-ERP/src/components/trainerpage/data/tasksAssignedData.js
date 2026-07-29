// Dummy data for the (full) Task Assigned page.
// Replace with API responses later, e.g.
//   GET /api/tasks/stats   -> taskAssignedStats
//   GET /api/tasks         -> taskAssignedRecords
//
// NOTE: this is distinct from data/workData.js's `tasksAssigned`, which
// only feeds the 4-item preview list on the Dashboard widget. This file
// backs the dedicated /staff/task-assigned page (stat cards + filter
// bar + full table + pagination).

// ---- Summary cards: Total Task / in progress / completed / overdue ----
export const taskAssignedStats = [
  {
    id: 'total',
    label: 'Total Task',
    value: 24,
    icon: 'grid',
    tone: 'blue',
  },
  {
    id: 'in-progress',
    label: 'in progress',
    value: 7,
    icon: 'history',
    tone: 'green',
  },
  {
    id: 'completed',
    label: 'completed',
    value: 9,
    icon: 'check',
    tone: 'blue',
  },
  {
    id: 'overdue',
    label: 'overdue',
    value: '1.2 min',
    icon: 'calendar',
    tone: 'orange',
  },
];

// ---- Page-level meta (header subtitle, pagination) ----
export const taskAssignedMeta = {
  totalRecords: 24,
  pendingCount: 6,
  totalPages: 10,
};

// ---- "All Task" table rows ----
// NOTE: "15 july 20264" and "weekly attenweek 6 assessment questions"
// reproduce the reference design's mock data exactly, typos included
// (same convention as "All braches" in filterOptions.js above).
export const taskAssignedRecords = [
  {
    id: 'task-1',
    title: 'Review cyber security batch performance',
    subtitle: 'assess py-18 mid courses scores',
    assignee: 'Anjali rane',
    priority: 'High',
    dueDate: '10 july 2026',
    status: 'Present',
  },
  {
    id: 'task-2',
    title: 'Upload CS-24 attendance sheet',
    subtitle: 'weekly attendance compliation',
    assignee: 'rohit mehta',
    priority: 'medium',
    dueDate: '15 july 20264',
    status: 'Absent',
  },
  {
    id: 'task-3',
    title: 'prepare AI quiz',
    subtitle: 'weekly attenweek 6 assessment questions',
    assignee: 'karan bhosale',
    priority: 'low',
    dueDate: '19 july 2026',
    status: 'Late',
  },
];
