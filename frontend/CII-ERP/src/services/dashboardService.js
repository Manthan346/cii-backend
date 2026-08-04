// dashboardService.js
// Still the ONLY file that talks to the backend. Dashboard.jsx and its
// children keep receiving plain props — nothing changes for them except
// CertificateProgress, which reads `certificateCourses` instead of
// `courses` (see the one-line change noted in Dashboard.jsx).
//
// Uses your existing `API` instance (axios + Bearer token from
// localStorage + withCredentials). Adjust the import path below to
// wherever that file actually lives in your project.
//
// NOTE: your API instance's baseURL is ".../api/v1" (no "/candidate"),
// so every call here is prefixed with "/candidate/...".
//
// LIVE (real API calls):
//   candidate.name / initials          <- GET /candidate/candidate-profile
//   stats (courses/attendance/pending) <- GET /candidate/dashboard-data + /candidate/candidate-attendance
//   courses (CourseProgressList)       <- GET /candidate/candidate-allCourses-attendance
//   upcoming (AlertsTabs "Upcoming")   <- GET /candidate/candidate-sessions
//
// STATIC — kept exactly as-is per your instruction, no backend endpoint exists:
//   certificateCourses (CertificateProgress), eligibility (CertificateEligibility)
//
// STATIC — no backend endpoint exists yet at all (flagged inline below):
//   streakDays, avatarSrc, certificates-earned count, unlockCertificate, alerts, jobs

import API from '../../api/api'; // <-- adjust path to wherever your API.js lives
import { MOCK_DASHBOARD_DATA } from '../data/mockDashboardData';

// ── Session date/time formatting ──
// `session_date` arrives as a full ISO datetime (e.g. "2026-07-13T00:00:00.000Z").
// `session_time` arrives as a TIME-only value serialized against the Unix
// epoch (e.g. "1970-01-01T05:00:00.000Z") — only the time-of-day part is
// meaningful, the date part is always 1970-01-01 and should be ignored.
//
// ASSUMPTION (please confirm with backend if this looks wrong): both values
// are read here as UTC wall-clock time with NO timezone conversion — i.e.
// "05:00:00.000Z" is displayed as "5:00 AM" as-is, not shifted to IST. If
// these timestamps are meant to be genuine UTC instants that should be
// converted for an India-based audience, change `timeZone: 'UTC'` to
// `timeZone: 'Asia/Kolkata'` in both functions below.

function formatSessionDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'short', day: '2-digit', month: 'short', timeZone: 'UTC',
  });
}

function formatSessionTime(timeStr) {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  if (isNaN(d)) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  });
}

export async function fetchDashboardData() {
  const [
    dashboardRes,
    profileRes,
    attendanceSummaryRes,
    allCoursesAttendanceRes,
    sessionsRes,
  ] = await Promise.all([
    API.get('/candidate/dashboard-data'),
    API.get('/candidate/candidate-profile'),
    API.get('/candidate/candidate-attendance'),
    API.get('/candidate/candidate-allCourses-attendance'),
    API.get('/candidate/candidate-sessions'),
  ]);

  // Every endpoint wraps its payload as { status, data, message } — since
  // API.js doesn't unwrap responses, we read res.data.data.* here.
  const dashboardData = dashboardRes.data.data.dasbhoardData;
  const personalInfo = profileRes.data.data.personalInfo;
  const attendanceSummary = attendanceSummaryRes.data.data.summary;
  const coursesAttendance = allCoursesAttendanceRes.data.data.courses;
  const upcomingSessions = sessionsRes.data.data.sessions;

  const firstName = personalInfo.candidate_first_name ?? '';
  const lastName = personalInfo.candidate_last_name ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return {
    candidate: {
      name: `${firstName} ${lastName}`.trim(),
      initials: initials || 'NA',
      streakDays: MOCK_DASHBOARD_DATA.candidate.streakDays, // no endpoint yet
      avatarSrc: MOCK_DASHBOARD_DATA.candidate.avatarSrc,   // no endpoint yet
    },

    stats: [
      { icon: 'courses', label: 'Enrolled courses', value: dashboardData.enrolledCourses },
      { icon: 'calendar', label: 'Attendance rate', value: `${Math.round(attendanceSummary.attendancePercentage)}%` },
      { icon: 'pending', label: 'Pending assessments', value: dashboardData.pendingAssesment },
      // "Certificates earned" tile removed per product request — the
      // mock-data stat entry is no longer pulled in here at all.
    ],

    // -> feeds <CourseProgressList />, now LIVE
    courses: coursesAttendance.map((c) => ({
      id: c.course_id,
      name: c.course_name,
      // Using attendance % as the progress metric — there's no dedicated
      // "course progress" endpoint yet. Swap this out once one exists.
      progress: Math.round(c.attendancePercentage),
    })),

    // -> feeds ONLY <CertificateProgress />, kept STATIC per your instruction
    certificateCourses: MOCK_DASHBOARD_DATA.courses,

    unlockCertificate: MOCK_DASHBOARD_DATA.unlockCertificate, // no endpoint yet
    eligibility: MOCK_DASHBOARD_DATA.eligibility,             // kept static per your instruction

    // -> feeds the "Upcoming" tab of <AlertsTabs />, now LIVE
    // text/meta restore the original prop contract AlertsTabs.jsx expects
    // (see DEFAULT_UPCOMING in that file) — no changes needed there anymore.
    upcoming: upcomingSessions.map((s) => ({
      id: s.session_id,
      text: s.topic_name,
      meta: [formatSessionDate(s.session_date), formatSessionTime(s.session_time)]
              .filter(Boolean)
              .join(' · '),
      // Raw fields kept in case a future detail view needs them.
      date: s.session_date,
      time: s.session_time,
      instructor: s.instructor,
      mode: s.attendance_mode,
      room: s.room_no,
    })),

    alerts: MOCK_DASHBOARD_DATA.alerts, // no endpoint yet
    jobs: MOCK_DASHBOARD_DATA.jobs,     // no endpoint yet
  };
}