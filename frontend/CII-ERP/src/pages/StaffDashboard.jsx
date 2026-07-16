// StaffDashboard.jsx
// Top-level page for the staff portal. Mounts this once in your app
// router (see usage notes at the bottom of this file) and it internally
// handles navigation between Dashboard / Candidates / Batches / Attendance
// using the Sidebar <Link> components that already exist in each module.
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
// Each module's own <Sidebar> already contains <Link to="/staff/dashboard" /,
// "/staff/candidates", "/staff/batches"> — so as long as StaffDashboard is
// mounted on a wildcard path ("/staff/*"), those links will correctly swap
// between the screens below without a full page reload.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Sidebar from '../components/staffpage/layout/Sidebar/Sidebar';
import Topbar from '../components/staffpage/layout/Topbar/Topbar';
import Dashboard from '../components/staffpage/pages/Dashboard/Dashboard/Dashboard';
import CandidateManagement from '../components/staffpage/pages/CandidateManagement/CandidateManagement';
import BatchManagement from '../components/staffpage/pages/BatchManagement/BatchManagement';
import AttendanceManagement from '../components/staffpage/pages/AttendanceManagement/AttendanceManagement';
import Resources from '../components/staffpage/pages/Resources/Resources';
import StudyMaterialUpload from '../components/staffpage/pages/StudyMaterialUpload/StudyMaterialUpload';
import Reports from '../components/staffpage/pages/Reports/Reports';
import Work from '../components/staffpage/pages/Work/Work';

import './StaffDashboard.css';

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="staff-dashboard">
      {/* Topbar - full width at the top */}
      <div className="staff-dashboard__topbar">
        <Topbar
          user={{ name: "Staff Admin" }}
          hasUnreadNotifications={true}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onSearch={setSearchValue}
        />
      </div>

      {/* Content area - sidebar and main content side by side */}
      <div className="staff-dashboard__content">
        <div className="staff-dashboard__sidebar">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
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
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="staff-sidebar__overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
}