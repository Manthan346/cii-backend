// MyCourses.jsx
// My Courses page component. Composes Sidebar, Topbar, StatGrid, and CourseList.
//
// ─── Backend hookup ──────────────────────────────────────────────────────────
// When your API is ready, remove the static imports from data/courseCards.js
// and replace with useEffect fetches:
//
//   const [courses, setCourses]   = useState([]);
//   const [stats, setStats]       = useState([]);
//   const [orgLogoSrc, setOrgLogo] = useState(null);
//
//   useEffect(() => {
//     fetch('/api/courses')
//       .then(r => r.json())
//       .then(data => setCourses(data.map(c => ({ ...c, logoSrc: c.logoUrl }))));
//
//     fetch('/api/candidate/stats')
//       .then(r => r.json())
//       .then(setStats);
//
//     fetch('/api/organisation')
//       .then(r => r.json())
//       .then(d => setOrgLogo(d.logoUrl));
//   }, []);
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';

import Sidebar          from '../../layout/Sidebar/Sidebar';
import Topbar           from '../../layout/Topbar/Topbar';
import { StatGrid }     from '../StatCard/StatCard';
import CourseList       from '../CourseList/CourseList';
import CompletedCourses from '../CompletedCourses/CompletedCourses';
import UpSkillActivities from '../UpSkillActivities/UpSkillActivities';
import SuggestedCourses from '../SuggestedCourses/SuggestedCourses';

import {
  courseCards,
  candidateStats,
  completedCourses,
  upSkillActivities,
  suggestedCourses,
} from '../data/myCoursesData';
import orgLogo from '../../../../assets/Logo.png';

import './MyCourses.css';

export default function MyCourses() {
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const courses    = courseCards;
  const stats      = candidateStats;
  const completed  = completedCourses;
  const upSkill    = upSkillActivities;
  const suggested  = suggestedCourses;
  const orgLogoSrc = orgLogo;

  // TODO: replace with POST /api/candidate/courses/:id/enroll
  const handleEnroll = (courseId) => {
    console.log('enroll requested for course', courseId);
  };

  return (
    <div className="my-courses">

      <Sidebar orgLogoSrc={orgLogoSrc} activeItem="My Courses" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="my-courses__main">

        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <main className="my-courses__body">
          <StatGrid stats={stats} />

          <div className="my-courses__progress-row">
            <CompletedCourses courses={completed} />
            <UpSkillActivities activities={upSkill} />
          </div>

          <SuggestedCourses suggestions={suggested} onEnroll={handleEnroll} />

          <CourseList cards={courses} search={search} />
        </main>

      </div>
    </div>
  );
}
