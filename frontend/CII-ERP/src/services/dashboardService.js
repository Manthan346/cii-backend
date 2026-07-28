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
      // No "certificates earned" endpoint yet — pulled from mock:
      MOCK_DASHBOARD_DATA.stats.find((s) => s.icon === 'certificates'),
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
    upcoming: upcomingSessions.map((s) => ({
      id: s.session_id,
      title: s.topic_name,
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