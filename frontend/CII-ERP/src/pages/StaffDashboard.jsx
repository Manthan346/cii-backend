// StaffDashboard.jsx
// Top-level page for the staff portal. Mounts this once in your app
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

import Dashboard from '../components/staffpage/pages/Dashboard/Dashboard/Dashboard';
import CandidateManagement from '../components/staffpage/pages/CandidateManagement/CandidateManagement';
import BatchManagement from '../components/staffpage/pages/BatchManagement/BatchManagement';
import AttendanceManagement from '../components/staffpage/pages/AttendanceManagement/AttendanceManagement';
import Resources from '../components/staffpage/pages/Resources/Resources';
import StudyMaterialUpload from '../components/staffpage/pages/StudyMaterialUpload/StudyMaterialUpload';
import Reports from '../components/staffpage/pages/Reports/Reports';
import Work from '../components/staffpage/pages/Work/Work';

export default function StaffDashboard() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/candidates" element={<CandidateManagement />} />
      <Route path="/batches" element={<BatchManagement />} />
      <Route path="/attendance" element={<AttendanceManagement />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/study-material" element={<StudyMaterialUpload />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/work" element={<Work />} />
      {/* Default redirect to dashboard */}
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}
