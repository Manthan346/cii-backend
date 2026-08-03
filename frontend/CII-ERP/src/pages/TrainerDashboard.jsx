// TrainerDashboard.jsx
// Top-level page for the trainer portal. Mounts this once in your app
// router (see usage notes below). This file ONLY defines which page
// renders at which path — the Topbar + Sidebar shell is mounted inside
// each individual page component (Dashboard.jsx, CandidateManagement.jsx,
// BatchManagement.jsx, etc.), so every route brings its own shell with it.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import { BrowserRouter, Routes, Route } from 'react-router-dom';
//   import StaffDashboard from './pages/StaffDashboard';
//
//   <BrowserRouter>
//     <Routes>
//       <Route path="/staff/*" element={<StaffDashboard />} />
//     </Routes>
//   </BrowserRouter>
//
// Each page's own Sidebar already contains <Link to="/staff/dashboard" />,
// "/staff/candidates", "/staff/batches" — so as long as StaffDashboard is
// mounted on a wildcard path ("/staff/*"), those links will correctly swap
// between the screens below without a full page reload.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route } from 'react-router-dom';

import Dashboard from '../components/trainerpage/pages/Dashboard/Dashboard/Dashboard';
import CandidateManagement from '../components/trainerpage/pages/CandidateManagement/CandidateManagement/CandidateManagement';
import BatchManagement from '../components/trainerpage/pages/BatchManagement/BatchManagement/BatchManagement';
import AttendanceManagement from '../components/trainerpage/pages/AttendanceManagement/AttendanceManagement/AttendanceManagement';
// import Resources from '../components/trainerpage/pages/Resources/Resources/Resources';
import StudyMaterialUpload from '../components/trainerpage/pages/StudyMaterialUpload/StudyMaterialUpload/StudyMaterialUpload';
// import Reports from '../components/trainerpage/pages/Reports/Reports/Reports';
import Work from '../components/trainerpage/pages/Work/Work/Work';
import Notifications from '../components/trainerpage/pages/Notifications/Notifications/Notifications';
import TaskAssigned from '../components/trainerpage/pages/TaskAssigned/TaskAssigned/TaskAssigned';
import Profile from '../components/trainerpage/pages/Profile/Profile/Profile';
import Events from '../components/trainerpage/pages/Events/Events/Events';
import Logout from '../components/trainerpage/pages/Logout/Logout';

export default function TrainerDashboard() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/candidates" element={<CandidateManagement />} />
      <Route path="/batch-management" element={<BatchManagement />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      {/* <Route path="/resources" element={<Resources />} /> */}
      <Route path="/study-material" element={<StudyMaterialUpload />} />
      {/* <Route path="/reports" element={<Reports />} /> */}
      <Route path="/work" element={<Work />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/task-assigned" element={<TaskAssigned />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/events" element={<Events />} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}