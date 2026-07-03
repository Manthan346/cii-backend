// dashboardMetrics.js
// Dashboard-specific summary data.
// TODO: replace with API responses:
//   fetch('/api/candidate/stats')      -> METRIC_DATA
//   fetch('/api/candidate/courses')    -> COURSE_PROGRESS (in-progress courses only, with pct)

export const METRIC_DATA = [
  { icon: 'courses',      iconBg: 'var(--blue-light)',  iconColor: 'var(--blue)',   target: 3,  suffix: '',  label: 'Enrolled courses'     },
  { icon: 'attendance',   iconBg: 'var(--orange-soft)', iconColor: 'var(--orange)', target: 85, suffix: '%', label: 'Attendance rate'      },
  { icon: 'pending',      iconBg: 'var(--gold-soft)',   iconColor: 'var(--gold)',   target: 2,  suffix: '',  label: 'Pending assessments'  },
  { icon: 'certificates', iconBg: 'var(--green-soft)',  iconColor: 'var(--green)',  target: 4,  suffix: '',  label: 'Certificates earned'  },
];

export const COURSE_PROGRESS = [
  { name: 'Graphic Design', pct: 78, emoji: '🎨', bgColor: '#F0EBFF', barColor: 'var(--purple)' },
  { name: 'Housekeeping',   pct: 54, emoji: '🏠', bgColor: '#FFF5E0', barColor: 'var(--gold)'   },
  { name: 'Cyber Security', pct: 98, emoji: '🛡️', bgColor: '#FFE8E8', barColor: 'var(--blue)'   },
];
