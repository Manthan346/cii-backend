// Dashboard.jsx
// Root page — composes every dashboard section.
//
// ─── Backend hookup ───────────────────────────────────────────────────────────
// Replace static imports with useEffect fetches when the API is ready:
//
//   const [metrics,  setMetrics]  = useState(METRIC_DATA);
//   const [courses,  setCourses]  = useState(COURSE_DATA);
//   const [attendance, setAtt]    = useState({ present: 85 });
//   const [alerts,   setAlerts]   = useState([]);
//   const [upcoming, setUpcoming] = useState([]);
//   const [jobs,     setJobs]     = useState([]);
//   const [orgLogo,  setOrgLogo]  = useState(null);
//
//   useEffect(() => {
//     fetch('/api/candidate/stats').then(r=>r.json()).then(setMetrics);
//     fetch('/api/candidate/courses').then(r=>r.json()).then(setCourses);
//     fetch('/api/candidate/attendance').then(r=>r.json()).then(setAtt);
//     fetch('/api/candidate/alerts').then(r=>r.json()).then(setAlerts);
//     fetch('/api/candidate/upcoming').then(r=>r.json()).then(setUpcoming);
//     fetch('/api/jobs').then(r=>r.json()).then(setJobs);
//     fetch('/api/organisation').then(r=>r.json()).then(d=>setOrgLogo(d.logoUrl));
//   }, []);
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

import Sidebar          from '../Sidebar/Sidebar';
import Topbar           from '../Topbar/Topbar';
import WelcomeBanner    from '../WelcomeBanner/WelcomeBanner';
import { MetricGrid }   from '../MetricCard/MetricCard';
import MyCourses        from '../MyCourses/MyCourses';
import AttendanceChart  from '../AttendanceChart/AttendanceChart';
import AlertsTabs       from '../AlertsTabs/AlertsTabs';
import JobOpportunities from '../JobOpportunities/JobOpportunities';

import './Dashboard.css';
import orgLogo from '../../../Assets/Logo.png';
import { courseCards } from '../data/dashboardData';

// ── Static metric data ───────────────────────────────────────
// TODO: replace with /api/candidate/stats response
const METRIC_DATA = [
  {
    icon:      'courses',
    iconBg:    'var(--blue-light)',
    iconColor: 'var(--blue)',
    target:    3,
    suffix:    '',
    label:     'Enrolled courses',
  },
  {
    icon:      'attendance',
    iconBg:    'var(--orange-soft)',
    iconColor: 'var(--orange)',
    target:    85,
    suffix:    '%',
    label:     'Attendance rate',
  },
  {
    icon:      'pending',
    iconBg:    'var(--gold-soft)',
    iconColor: 'var(--gold)',
    target:    2,
    suffix:    '',
    label:     'Pending assessments',
  },
  {
    icon:      'certificates',
    iconBg:    'var(--green-soft)',
    iconColor: 'var(--green)',
    target:    4,
    suffix:    '',
    label:     'Certificates earned',
  },
];

// ── Static course data ───────────────────────────────────────
// TODO: replace with /api/candidate/courses response
const COURSE_DATA = [
  { name: 'Graphic Design', pct: 78, emoji: '🎨', bgColor: '#F0EBFF', barColor: 'var(--purple)' },
  { name: 'Housekeeping',   pct: 54, emoji: '🏠', bgColor: '#FFF5E0', barColor: 'var(--gold)'   },
  { name: 'Cyber Security', pct: 98, emoji: '🛡️', bgColor: '#FFE8E8', barColor: 'var(--blue)'   },
];

export default function Dashboard() {
  const [search, setSearch] = useState('');

  // TODO: wire these to API responses
  const orgLogoSrc = orgLogo;

  return (
    <div className="dashboard">

      {/* Fixed left sidebar */}
      <Sidebar orgLogoSrc={orgLogoSrc} activeItem="Dashboard" />

      {/* Right: topbar + page body */}
      <div className="dashboard__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
        />

        <main className="dashboard__body">

          {/* 1. Welcome banner */}
          <WelcomeBanner
            name="Anisha"
            subText="You're 3 sessions away from completing. Keep going!"
            streakDays={12}
            certificates={4}
            avatarSrc={null}
          />

          {/* 2. Metric tiles – numbers count up from 0 on mount */}
          <MetricGrid metrics={METRIC_DATA} />

          {/* 3. Bottom two-column grid */}
          <div className="dashboard__grid">

            {/* Left column */}
            <div className="dashboard__left">
              {/* Course progress bars – bars animate from 0 on mount */}
              <MyCourses courses={COURSE_DATA} />

              {/* Alerts / Upcoming tabbed panel */}
              <AlertsTabs />
            </div>

            {/* Right column */}
            <div className="dashboard__right">
              {/* Donut attendance chart – arc draws from 0 on mount */}
              <AttendanceChart present={85} />

              {/* Job opportunities cards */}
              <JobOpportunities />
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
