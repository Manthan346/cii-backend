// Dummy data for the Attendance Management page.
// Replace with API responses later, e.g.
//   GET /api/attendance/stats            -> attendanceStats
//   GET /api/attendance?date=2026-07-08  -> attendanceRecords
//
// NOTE: candidateId, contact-less shape, batch/course/progress fields
// intentionally mirror data/candidates.js so the same candidate row
// shape can be reused across the Candidate + Attendance tables.

// ---- Summary cards: Sessions today / Present / Absent / Avg. attendance ----
export const attendanceStats = [
  {
    id: 'sessions',
    label: 'Sessions today',
    value: 142,
    icon: 'calendar',
    tone: 'teal',
  },
  {
    id: 'present',
    label: 'Present',
    value: 6,
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
  attendanceDate: '8 july 2026',
  totalRecords: 30,
  totalPages: 5,
};

// ---- "Today's Attendance" table rows ----
export const attendanceRecords = [
  {
    id: 1,
    candidateId: 'CII-DS-1042',
    name: 'Nitu Patil',
    batch: 'DS-24',
    course: 'Data Science',
    progress: 85,
    timeIn: '9:00',
    timeOut: '5:00',
    status: 'Present',
  },
  {
    id: 2,
    candidateId: 'CII-DS-1042',
    name: 'Rahul patil',
    batch: 'PY-18',
    course: 'Python programming',
    progress: 98,
    timeIn: '9:15',
    timeOut: '5:00',
    status: 'Present',
  },
  {
    id: 3,
    candidateId: 'CII-DS-1042',
    name: 'Parth patil',
    batch: 'DS-24',
    course: 'Data Science',
    progress: 50,
    timeIn: '9:30',
    timeOut: '4:55',
    status: 'Present',
  },
  {
    id: 4,
    candidateId: 'CII-DS-1042',
    name: 'Kirti sharma',
    batch: 'BS-18',
    course: 'Business comm.',
    progress: 30,
    timeIn: '—',
    timeOut: '—',
    status: 'Absent',
  },
  {
    id: 5,
    candidateId: 'CII-DS-1042',
    name: 'Neha wagh',
    batch: 'PY-18',
    course: 'Business comm.',
    progress: 75,
    timeIn: '9:00',
    timeOut: '4:45',
    status: 'Present',
  },
  {
    id: 6,
    candidateId: 'CII-DS-1042',
    name: 'raj sharma',
    batch: 'BS-18',
    course: 'Python programming',
    progress: 60,
    timeIn: '10:00',
    timeOut: '5:00',
    status: 'Late',
  },
];
