// AdminDashboard.jsx
// Top-level page for the admin portal — mirrors CandidateDashboard.jsx.
// Mount this once in App.jsx and it internally handles navigation between
// Dashboard / Course Management / Reports & Analytics / etc. using the
// Sidebar <NavLink> items that already exist in layout/Sidebar.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import AdminDashboard from './pages/AdminDashboard';
//
//   <Route path="/admin/*" element={<AdminDashboard />} />
//
// Sidebar's <NavLink> targets ("dashboard", "course-management", ...) are
// relative, so as long as AdminDashboard is mounted on a wildcard path
// ("/admin/*"), those links resolve to "/admin/dashboard",
// "/admin/course-management", etc. automatically — no need to change
// Sidebar if you later mount this page under a different base path.
//
// All routes below render through AdminLayout (Topbar + Sidebar +
// <Outlet />), so every admin page gets the same chrome automatically —
// individual pages like Dashboard stay unaware of the layout around them.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../components/adminpage/layout/AdminLayout';
import Dashboard from '../components/adminpage/Dashboard/Dashboard/Dashboard';
import TotalUsers from '../components/adminpage/TotalUsers/TotalUsers/TotalUsers';

// Not built yet — uncomment as each page lands, same as the candidate
// portal's file. Sidebar already links to all of these paths.

// import Candidates from '../components/adminpage/Candidates/Candidates/Candidates';
// import CourseManagement from '../components/adminpage/CourseManagement/CourseManagement/CourseManagement';
// import ReportsAnalytics from '../components/adminpage/ReportsAnalytics/ReportsAnalytics/ReportsAnalytics';
// import SystemSettings from '../components/adminpage/SystemSettings/SystemSettings/SystemSettings';
// import Profile from '../components/adminpage/Profile/Profile/Profile';
// import ApprovalRequests from '../components/adminpage/ApprovalRequests/ApprovalRequests/ApprovalRequests';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="total-users" element={<TotalUsers />} />
        {/* <Route path="candidates" element={<Candidates />} /> */}
        {/* <Route path="course-management" element={<CourseManagement />} /> */}
        {/* <Route path="reports-analytics" element={<ReportsAnalytics />} /> */}
        {/* <Route path="system-settings" element={<SystemSettings />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
        {/* <Route path="approval-requests" element={<ApprovalRequests />} /> */}
      </Route>
    </Routes>
  );
}