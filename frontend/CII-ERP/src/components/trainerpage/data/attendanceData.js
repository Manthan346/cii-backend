// Dummy data for the Attendance Management page.
// Replace with API responses later, e.g.
//   GET /api/attendance/stats                     -> attendanceStats
//   GET /api/attendance/sessions?date=2026-07-08   -> attendanceSessions
//   GET /api/batches/:batchCode/roster             -> batchRosters[batchCode]
//   POST /api/attendance/sessions/:id/mark         -> save a session's roster

// ---- Summary cards: todays Sessions / Present / Absent / Avg. attendance ----
export const attendanceStats = [
  {
    id: 'sessions',
    label: 'todays Sessions',
    value: 2,
    icon: 'calendar',
    tone: 'teal',
  },
  {
    id: 'present',
    label: 'Present',
    value: 30,
    icon: 'check',
    tone: 'green',
  },
  {
    id: 'absent',
    label: 'Absent',
    value: 2,
    icon: 'close',
    tone: 'peach',
  },
  {
    id: 'average',
    label: 'Avg. attendance',
    value: '90%',
    icon: 'refresh',
    tone: 'yellow',
  },
];

// ---- Page-level meta (header subtitle, table caption, pagination) ----
export const attendanceMeta = {
  totalActiveBatches: 6,
  attendanceDate: '8 July 2026',
  totalRecords: 50,
  totalPages: 45,
};

// Dropdown options for the tracker's "SESSION" filter field.
export const sessionFilterOptions = [
  'All Sessions',
  'Introduction to CS',
  'Common Cyber Threats',
  'Cyber Hygiene',
  'Data Privacy & Protection',
];

// Roster the trainer marks attendance against, keyed by batch code.
// Kept separate from data/candidates.js since a real "get roster"
// endpoint will likely return just { candidateId, name } per student
// rather than a full candidate profile.
export const batchRosters = {
  'CS-24': [
    { candidateId: 'CII-CS-2001', name: 'Nitu Patil' },
    { candidateId: 'CII-CS-2002', name: 'Ravi Deshmukh' },
    { candidateId: 'CII-CS-2003', name: 'Kirti mehta' },
    { candidateId: 'CII-CS-2004', name: 'Vaishnavi Rane' },
    { candidateId: 'CII-CS-2005', name: 'Karan wagh' },
    { candidateId: 'CII-CS-2006', name: 'Sumedh wagh' },
    { candidateId: 'CII-CS-2007', name: 'Raj thakur' },
  ],
};

// ---- "Today's Attendance" session rows ----
// Each session starts unmarked (`marked: false`, `attendance: []`).
// Once the trainer opens "Mark attendance" for a session and saves,
// `marked` flips to true and `attendance` is filled with one entry
// per student ({ candidateId, name, status }). The read-only detail
// view (3rd screen) only becomes reachable for a session once
// `marked` is true.
export const attendanceSessions = [
  {
    id: 1,
    title: 'Introduction to CS',
    subtitle: 'What is cybersecurity?',
    batch: 'CS-24',
    date: 'Jul 08,2026',
    time: '11:00 AM',
    classroom: 'Room 01',
    marked: false,
    attendance: [],
  },
  {
    id: 2,
    title: 'Common Cyber Threats',
    subtitle: 'Phishing and email scams',
    batch: 'CS-24',
    date: 'Jul 10,2026',
    time: '11:00 AM',
    classroom: 'Room 01',
    marked: false,
    attendance: [],
  },
  {
    id: 3,
    title: 'Cyber Hygiene',
    subtitle: 'Multi-Factor Authentication (MFA)',
    batch: 'CS-24',
    date: 'Jul 12,2026',
    time: '11:00 AM',
    classroom: 'Room 01',
    marked: false,
    attendance: [],
  },
  {
    id: 4,
    title: 'Data Privacy & Protection',
    subtitle: 'Privacy principles',
    batch: 'CS-24',
    date: 'Jul 14,2026',
    time: '11:00 AM',
    classroom: 'Room 01',
    marked: false,
    attendance: [],
  },
];
