// MobilizerDashboard.jsx
// Top-level page for the mobilizer portal — mirrors AdminDashboard.jsx.
// Mount this once in App.jsx and it internally handles navigation between
// Dashboard / Enquiries / Report / Placement / etc. using the Sidebar
// <NavLink> items that already exist in layout/Sidebar.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import MobilizerDashboard from './pages/MobilizerDashboard';
//
//   <Route path="/mobilizer/*" element={<MobilizerDashboard />} />
//
// Sidebar's <NavLink> targets are relative to /mobilizer, so as long as
// this is mounted on a wildcard path ("/mobilizer/*"), they resolve to
// "/mobilizer/dashboard", "/mobilizer/enquiries", etc. automatically.
//
// CRITICAL: every route below sits inside <Route element={<MobilizerLayout />}>.
// That's what actually renders Sidebar + Topbar around the page content via
// MobilizerLayout's <Outlet />. If routes are listed as flat siblings without
// that wrapping element, Sidebar/Topbar never mount — you'd only ever see
// whatever page component matched, full-bleed with no chrome. This is the
// same bug that hit AdminDashboard.jsx before it was wrapped the same way.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from "react-router-dom";

import MobilizerLayout from "../components/mobilizerpage/layout/MobilizerLayout";
import Dashboard from "../components/mobilizerpage/Dashboard/Dashboard/Dashboard";
import Enquiries from "../components/mobilizerpage/Enquiries/Enquiries/Enquiries";
import Report from "../components/mobilizerpage/Report/Report/Report";
import PlacementDashboard from "../components/mobilizerpage/Placement/PlacementDashboard/PlacementDashboard/PlacementDashboard";
import PlacementEvent from "../components/mobilizerpage/Placement/PlacementEvent/PlacementEvent/PlacementEvent";
import Event from "../components/mobilizerpage/Event/Event/Event";
import Profile from '../components/mobilizerpage/Profile/Profile/Profile';
import Notifications from '../components/mobilizerpage/Notifications/Notifications/Notifications';
export default function MobilizerDashboard() {
  return (
    <Routes>
      <Route element={<MobilizerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="report" element={<Report />} />
        <Route path="placement/dashboard" element={<PlacementDashboard />} />
        <Route path="placement/event" element={<PlacementEvent />} />
        <Route path="events" element={<Event />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}
