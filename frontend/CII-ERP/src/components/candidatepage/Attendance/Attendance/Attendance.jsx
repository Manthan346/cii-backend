// Attendance.jsx
// Root Attendance page. Sits at:
//   src/components/candidatepage/Attendance/Attendance/Attendance.jsx
// and should be imported by CandidateDashboard.jsx (or your router)
// as the "/attendance" route — see Sidebar.jsx's NAV_MAIN entry.
//
// Mirrors Dashboard.jsx's conventions: this component is the only one
// that talks to the service layer (`attendanceService`). Every child
// below only receives plain props, so swapping mock data for a real
// API later means changing `attendanceService.js` alone.

import { useEffect, useState } from 'react';

import Sidebar from '../../layout/Sidebar/Sidebar';
import Topbar from '../../layout/Topbar/Topbar';
import { StatGrid } from '../../shared/StatCard/StatCard';
import AttendanceBanner from '../AttendanceBanner/AttendanceBanner';
import AttendanceCalendar from '../AttendanceCalendar/AttendanceCalendar';
import CourseAttendanceList from '../CourseAttendanceList/CourseAttendanceList';
import RecentAttendanceLog from '../RecentAttendanceLog/RecentAttendanceLog';
import AttendanceOverview from '../AttendanceOverview/AttendanceOverview';

import { fetchAttendanceData } from '../../../../services/attendanceService';

import './Attendance.css';
import orgLogo from '../../../../assets/Logo.png';

// Static stat-tile chrome (icon + colours). Values come from the
// service layer so this file never needs to change for new numbers.
const STAT_META = [
  { key: 'overallPct', icon: 'attendance', iconBg: '#E6EEF8', iconColor: '#2F6FB0', label: 'Overall attendance', suffix: '%' },
  { key: 'sessionsAttended', icon: 'checkCircle', iconBg: '#E4F6EC', iconColor: '#1B8A4F', label: 'Sessions attended', suffix: '' },
  { key: 'sessionsMissed', icon: 'xCircle', iconBg: '#FBE8E4', iconColor: '#D8432B', label: 'Sessions missed', suffix: '' },
  { key: 'lateArrivals', icon: 'clock', iconBg: '#FCEFD9', iconColor: '#B8892A', label: 'Late arrivals', suffix: '' },
];

export default function Attendance() {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchAttendanceData().then(result => {
      if (!cancelled) setData(result);
    });
    return () => { cancelled = true; };
  }, []);

  // TODO: wire these up once the API supports paging the calendar
  // by month; for now the arrows are present but inert.
  const handlePrevMonth = () => {};
  const handleNextMonth = () => {};

  const stats = data
    ? STAT_META.map(meta => ({
        icon: meta.icon,
        iconBg: meta.iconBg,
        iconColor: meta.iconColor,
        label: meta.label,
        value: `${data.summary[meta.key]}${meta.suffix}`,
      }))
    : [];

  return (
    <div className="attendance-page">

      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Attendance"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="attendance-page__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main className="attendance-page__body">
          {!data ? (
            <div className="attendance-page__loading">Loading your attendance…</div>
          ) : (
            <>
              {/* 1. Page title */}
              <div className="attendance-page__heading">
                <h1 className="attendance-page__title">Attendence</h1>
                <p className="attendance-page__subtitle">Your session-wise attendance across all enrolled courses.</p>
              </div>

              {/* 2. Eligibility warning */}
              <AttendanceBanner
                courseName={data.alert?.courseName}
                thresholdPct={data.alert?.thresholdPct}
              />

              {/* 3. Stat tiles */}
              <StatGrid stats={stats} />

              {/* 4. Calendar + By Courses */}
              <div className="attendance-page__row attendance-page__row--split">
                <AttendanceCalendar
                  monthLabel={data.calendar.monthLabel}
                  year={data.calendar.year}
                  month={data.calendar.month}
                  days={data.calendar.days}
                  todayDate={data.calendar.todayDate}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                />
                <CourseAttendanceList courses={data.courses} />
              </div>

              {/* 5. Recent log + Overview */}
              <div className="attendance-page__row attendance-page__row--split">
                <RecentAttendanceLog logs={data.recentLog} />
                <AttendanceOverview
                  presentPct={data.overview.presentPct}
                  absentPct={data.overview.absentPct}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
