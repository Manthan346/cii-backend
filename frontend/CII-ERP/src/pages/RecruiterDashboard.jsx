// RecruiterDashboard.jsx
// Top-level page for the recruiter portal — mirrors MobilizerDashboard.jsx.
// Mount this once in App.jsx and it internally handles navigation between
// Dashboard / Job Management / Placement Management / Applications / etc.
// using the Sidebar <NavLink> items that already exist in layout/Sidebar.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import RecruiterDashboard from './pages/RecruiterDashboard';
//
//   <Route path="/recruiter/*" element={<RecruiterDashboard />} />
//
// Sidebar's <NavLink> targets are relative to /recruiter, so as long as
// this is mounted on a wildcard path ("/recruiter/*"), they resolve to
// "/recruiter/dashboard", "/recruiter/job-management", etc. automatically.
//
// CRITICAL: every route below sits inside <Route element={<RecruiterLayout />}>.
// That's what actually renders Sidebar + Topbar around the page content via
// RecruiterLayout's <Outlet />. If routes are listed as flat siblings without
// that wrapping element, Sidebar/Topbar never mount — you'd only ever see
// whatever page component matched, full-bleed with no chrome. Same bug that
// hit AdminDashboard.jsx / MobilizerDashboard.jsx before they were wrapped
// the same way.
//
// NOTE: JobManagement, PlacementManagement, Applications, Notifications, and
// Profile are currently ComingSoonCard placeholders (see their folders under
// components/recruiterpage/) — swap each page's default export for the real
// component as it gets built, no route/import changes needed here.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from "react-router-dom";

import RecruiterLayout from "../components/recruiterpage/layout/RecruiterLayout";
import Dashboard from "../components/recruiterpage/Dashboard/Dashboard";
import JobManagement from "../components/recruiterpage/JobManagement/JobManagement";
import JobFairJobDrive from "../components/recruiterpage/JobFairJobDrive/JobFairJobDrive";
import Applications from "../components/recruiterpage/Applications/Applications";
import Notifications from "../components/recruiterpage/Notifications/Notifications";
import Profile from "../components/recruiterpage/Profile/Profile";

export default function RecruiterDashboard() {
  return (
    <Routes>
      <Route element={<RecruiterLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="job-management" element={<JobManagement />} />
        <Route path="job-fair-job-drive" element={<JobFairJobDrive />} />
        <Route path="notifications" element={<Notifications />} />
         <Route path="profile" element={<Profile />} />
        <Route path="applications" element={<Applications />} />
        
       
      </Route>
    </Routes>
  );
}
