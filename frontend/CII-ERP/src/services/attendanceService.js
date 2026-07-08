// attendanceService.js
// Mock data layer for the Attendance page. The shape returned here is
// exactly what the real API is expected to return, so Attendance.jsx
// and its children never need to change when this is swapped for a
// real network call — only this file does.
//
// Backend hookup:
//   export async function fetchAttendanceData() {
//     const res = await fetch('/api/candidate/attendance');
//     return res.json();
//   }

const MOCK_ATTENDANCE = {
  // ── Top summary stat tiles ──
  summary: {
    overallPct: 85,
    sessionsAttended: 102,
    sessionsMissed: 17,
    lateArrivals: 5,
  },

  // ── Eligibility warning banner. Set to null to hide the banner
  //    entirely (e.g. when every course is above threshold). ──
  alert: {
    courseName: 'Housekeeping',
    thresholdPct: 75,
  },

  // ── Month calendar. `days` only needs entries for days that have
  //    a status — blank/weekend days can simply be omitted. ──
  calendar: {
    monthLabel: 'July 2026',
    year: 2026,
    month: 7, // 1-12
    todayDate: 23,
    days: [
      { date: 1, status: 'present' },
      { date: 2, status: 'present' },
      { date: 3, status: 'present' },
      { date: 6, status: 'present' },
      { date: 7, status: 'present' },
      { date: 8, status: 'present' },
      { date: 9, status: 'present' },
      { date: 10, status: 'present' },
      { date: 13, status: 'present' },
      { date: 14, status: 'present' },
      { date: 15, status: 'present' },
      { date: 16, status: 'absent' },
      { date: 17, status: 'present' },
      { date: 20, status: 'present' },
      { date: 21, status: 'present' },
      { date: 22, status: 'present' },
      { date: 23, status: 'present' },
      { date: 24, status: 'present' },
    ],
  },

  // ── "By Courses" attendance breakdown ──
  courses: [
    { id: 1, name: 'Graphic Design', icon: 'person', iconBg: '#EFE8FB', iconColor: '#7A4FBF', pct: 78 },
    { id: 2, name: 'Housekeeping', icon: 'star', iconBg: '#FCEFD9', iconColor: '#B8892A', pct: 54 },
    { id: 3, name: 'Cyber Security', icon: 'shield', iconBg: '#E6EEF8', iconColor: '#2F6FB0', pct: 98 },
  ],

  // ── "Recent log" list ──
  recentLog: [
    { id: 1, date: '23 Jun', course: 'Graphic Design', status: 'present' },
    { id: 2, date: '19 Jun', course: 'Cyber Security', status: 'late' },
    { id: 3, date: '18 Jun', course: 'Communication Skills', status: 'present' },
    { id: 4, date: '18 Jun', course: 'Housekeeping', status: 'absent' },
  ],

  // ── "Attendance Overview" donut ──
  overview: {
    presentPct: 85,
    absentPct: 15,
  },
};

export function fetchAttendanceData() {
  return Promise.resolve(MOCK_ATTENDANCE);
}
