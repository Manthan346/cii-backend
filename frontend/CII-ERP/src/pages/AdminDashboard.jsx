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

import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../components/adminpage/layout/AdminLayout";
import Dashboard from "../components/adminpage/Dashboard/Dashboard/Dashboard";
import TotalUsers from "../components/adminpage/TotalUsers/TotalUsers/TotalUsers";
import UserRecordView from "../components/adminpage/TotalUsers/UserRecordView/UserRecordView";
import Candidates from "../components/adminpage/Candidates/Candidates/Candidates";
import SuspendedAccounts from "../components/adminpage/SuspendedAccounts/SuspendedAccounts/SuspendedAccounts";
import CourseManagement from "../components/adminpage/Operations/CourseManagement/CourseManagement/CourseManagement";
import ReportsAnalytics from "../components/adminpage/Operations/ReportsAnalytics/ReportsAnalytics/ReportsAnalytics";
import ApprovalRequests from "../components/adminpage/System/ApprovalRequests/ApprovalRequests/ApprovalRequests";
import Profile from "../components/adminpage/Profile/Profile/Profile";

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="total-users" element={<TotalUsers />} />
        <Route path="total-users/:userId" element={<UserRecordView />} />
        <Route path="candidates" element={<Candidates />} />
        <Route
          path="candidates/suspended-accounts"
          element={<SuspendedAccounts />}
        />
        <Route path="course-management" element={<CourseManagement />} />
        <Route path="reports-analytics" element={<ReportsAnalytics />} />
        <Route path="approval-requests" element={<ApprovalRequests />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
