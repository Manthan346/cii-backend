// Dashboard.jsx
// Root Dashboard page. Sits at:
//   src/components/candidatepage/Dashboard/Dashboard/Dashboard.jsx
// and is imported by CandidateDashboard.jsx as the "/" route.
//
// Data flow: this component is the only one that talks to the service
// layer (`dashboardService`). Every child below only receives plain
// props, so swapping mock data for a real API later means changing
// `dashboardService.js` alone — no component here needs to change.
//
// CHANGED (backend integration):
//   1. Added an `error` state + basic error UI, since fetchDashboardData
//      now makes real network calls that can fail (401, network down, etc).
//   2. CertificateProgress now reads `data.certificateCourses` instead of
//      `data.courses` — `courses` is now LIVE (real attendance %), while
//      CertificateProgress must stay on the static mock data as requested.
//      Everything else is unchanged.

import { useEffect, useState } from 'react';

import Sidebar               from '../../layout/Sidebar/Sidebar';
import Topbar                 from '../../layout/Topbar/Topbar';
import { StatGrid }           from '../../shared/StatCard/StatCard';
import WelcomeBanner          from '../WelcomeBanner/WelcomeBanner';
import CourseProgressList     from '../CourseProgressList/CourseProgressList';
import UnlockCertificate      from '../UnlockCertificate/UnlockCertificate';
import CertificateProgress    from '../CertificateProgress/CertificateProgress';
import CertificateEligibility from '../CertificateEligibility/CertificateEligibility';
import AlertsTabs             from '../AlertsTabs/AlertsTabs';
import JobOpportunities       from '../JobOpportunities/JobOpportunities';

import { fetchDashboardData } from '../../../../services/dashboardService';

import './Dashboard.css';
import orgLogo from '../../../../assets/Logo.png';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // NEW

  useEffect(() => {
    let cancelled = false;
    fetchDashboardData()
      .then(result => {
        if (!cancelled) setData(result);
      })
      .catch(err => {
        if (!cancelled) setError(err.message ?? 'Failed to load dashboard');
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="dashboard">

      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Dashboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="dashboard__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials={data?.candidate.initials ?? 'AS'}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main className="dashboard__body">
          {error ? (
            <div className="dashboard__error">
              Couldn't load your dashboard. {error}
            </div>
          ) : !data ? (
            <div className="dashboard__loading">Loading your dashboard…</div>
          ) : (
            <>
              {/* 1. Welcome banner */}
              <WelcomeBanner
                name={data.candidate.name}
                subText="You're 3 sessions away from completing. Keep going!"
                streakDays={data.candidate.streakDays}
                certificates={data.stats.find(s => s.icon === 'certificates')?.value}
                avatarSrc={data.candidate.avatarSrc}
              />

              {/* 2. Stat tiles */}
              <StatGrid stats={data.stats} />

              {/* 3. My Courses Progress + Unlock Certificate */}
              <div className="dashboard__row dashboard__row--split">
                <CourseProgressList courses={data.courses} />
                <UnlockCertificate {...data.unlockCertificate} />
              </div>

              

            

              {/* 6. Alerts/Upcoming + Job Opportunities */}
              <div className="dashboard__row dashboard__row--split dashboard__row--bottom">
                <AlertsTabs alerts={data.alerts} upcoming={data.upcoming} />
                <JobOpportunities jobs={data.jobs} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}