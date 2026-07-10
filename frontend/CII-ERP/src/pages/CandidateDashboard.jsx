// CandidateDashboard.jsx
// Top-level page for the candidate portal. Mounts this once in your app
// router (see usage notes at the bottom of this file) and it internally
// handles navigation between Dashboard / My Profile / My Courses using
// the Sidebar <Link> components that already exist in each module.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import { BrowserRouter, Routes, Route } from 'react-router-dom';
//   import CandidateDashboard from './pages/CandidateDashboard';
//
//   <BrowserRouter>
//     <Routes>
//       <Route path="/*" element={<CandidateDashboard />} />
//     </Routes>
//   </BrowserRouter>
//
// Each module's own <Sidebar> already contains <Link to="/" /,
// "/my-profile", "/my-courses"> — so as long as CandidateDashboard is
// mounted on a wildcard path ("/*"), those links will correctly swap
// between the three screens below without a full page reload.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route } from 'react-router-dom';

import Dashboard from '../components/candidatepage/Dashboard/Dashboard/Dashboard';
import MyCourses from '../components/candidatepage/MyCourses/MyCourses/MyCourses';
import Profile   from '../components/candidatepage/Profile/Profile/Profile';
import Attendance from '../components/candidatepage/Attendance/Attendance/Attendance';
import Assessments from '../components/candidatepage/Progress/Assessments/Assessments/Assessments';
import Certificates from '../components/candidatepage/Progress/Certificates/Certificates/Certificates';

export default function CandidateDashboard() {
  return (
    <Routes>
      <Route path="/my-dashboard" element={<Dashboard />} />
      <Route path="/my-courses"  element={<MyCourses />} />
      <Route path="/my-profile"  element={<Profile />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/progress/assessments" element={<Assessments />} />
      <Route path="/progress/certificates" element={<Certificates />} />
    </Routes>
  );
}
