// mockDashboardData.js
// Placeholder data shaped exactly like the future API response for
// GET /api/candidate/dashboard. Swap `dashboardService.js` to call the
// real endpoint later — no component needs to change, since every
// component only ever consumes props in this same shape.

export const MOCK_DASHBOARD_DATA = {
  candidate: {
    name: 'Anisha',
    initials: 'AS',
    fullName: 'Aisha Sheikh',
    role: 'Candidate',
    batch: 'Batch DS-24',
    avatarSrc: null,
    streakDays: 12,
  },

  stats: [
    { icon: 'courses',      iconBg: 'rgb(230, 238, 248)',  iconColor: 'var(--blue)',   value: '3',   label: 'Enrolled courses'    },
    { icon: 'attendance',   iconBg: '#fff0eb', iconColor: 'var(--orange)', value: '85%', label: 'Attendance rate'     },
    { icon: 'pending',      iconBg: '#fff5e0',   iconColor: 'var(--gold)',   value: '2',   label: 'Pending assessments' },
    { icon: 'certificates', iconBg: '#e2f4ee',  iconColor: 'var(--green)',  value: '4',   label: 'Certificates earned' },
  ],

  // Single source of truth for the three enrolled courses — reused by
  // both "My Courses Progress" and "Certificate Progress Overview" so
  // course identity/icon data isn't duplicated across components.
  courses: [
    {
      id: 'graphic-design',
      name: 'Graphic Design',
      icon: 'profile',
      iconBg: 'var(--orange-soft)',
      iconColor: 'var(--orange)',
      courseProgressPct: 78,
      attendancePct: 78,
      assessmentsPct: 75,
      overallPct: 78,
      eligible: false,
    },
    {
      id: 'housekeeping',
      name: 'Housekeeping',
      icon: 'home',
      iconBg: 'var(--orange-soft)',
      iconColor: 'var(--orange)',
      courseProgressPct: 54,
      attendancePct: 54,
      assessmentsPct: 74,
      overallPct: 74,
      eligible: false,
    },
    {
      id: 'cyber-security',
      name: 'Cyber Security',
      icon: 'shield',
      iconBg: 'var(--orange-soft)',
      iconColor: 'var(--orange)',
      courseProgressPct: 70,
      attendancePct: 95,
      assessmentsPct: 96,
      overallPct: 97,
      eligible: true,
    },
  ],

  unlockCertificate: {
    title: 'Unlock Your Course Certifcate',
    subtitle: 'Reach 100% for completion of each course',
    heading: 'How to unlock to course certification',
    requirements: [
      'All Assessment should be approved',
      'Maintain at least 85% attendance during the program',
    ],
  },

  eligibility: {
    overallPct: 85,
    criteria: [
      { key: 'attendance', label: 'Attendance',      pct: 85, requiredLabel: 'Required: 85%', met: true  },
      { key: 'practical',  label: 'Practical Tests',  pct: 80, requiredLabel: 'Required: 85%', met: true  },
      { key: 'theory',     label: 'Theory Tests',     pct: 65, requiredLabel: 'Need 20% more',  met: false },
    ],
    checklist: [
      { label: 'Attendance',      met: true  },
      { label: 'Practical',       met: true  },
      { label: 'Theory Pending',  met: false },
    ],
  },

  alerts: [
    { text: 'Assignment "Brand Identity" due tomorrow',  meta: 'Graphic Design · 2h ago' },
    { text: 'New study material uploaded for Cyber Sec', meta: 'Academics · 5h ago'       },
    { text: "Attendance marked for today's session",     meta: 'Housekeeping · Today'     },
  ],

  upcoming: [
    { text: 'Graphic Design live session', meta: 'Tomorrow · 10:00 AM'    },
    { text: 'Cyber Security assessment',   meta: 'Wed, 02 Jul · 2:00 PM'  },
    { text: 'Housekeeping practical test', meta: 'Fri, 04 Jul · 11:00 AM' },
  ],

  jobs: [
    { role: 'Graphic Design', company: 'Cosmos', location: 'Remote', logoSrc: null, accentColor: 'var(--purple)' },
    { role: 'Cyber Security', company: 'DSCI',   location: 'Mumbai', logoSrc: null, accentColor: 'var(--teal)'   },
  ],
};
