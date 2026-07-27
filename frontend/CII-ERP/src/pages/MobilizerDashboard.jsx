// MobilizerDashboard.jsx
// Top-level page for the mobilizer portal. Mounts this once in your app
// router (see usage notes below). This file ONLY defines which page
// renders at which path — the Topbar + Sidebar shell is mounted inside
// each individual page component (Dashboard.jsx, Enquiries.jsx,
// Enrollments.jsx, etc.), so every route brings its own shell with it.
//
// ─────────────────────────────────────────────────────────────────────
// USAGE — in your main App.jsx:
//
//   import { BrowserRouter, Routes, Route } from 'react-router-dom';
//   import MobilizerDashboard from './pages/MobilizerDashboard';
//
//   <BrowserRouter>
//     <Routes>
//       <Route path="/mobilizer/*" element={<MobilizerDashboard />} />
//     </Routes>
//   </BrowserRouter>
//
// Each page's own Sidebar already contains <NavLink to="/mobilizer/dashboard" />,
// "/mobilizer/enquiries", "/mobilizer/job-fair/dashboard", etc. — so as long as
// MobilizerDashboard is mounted on a wildcard path ("/mobilizer/*"), those links
// will correctly swap between the screens below without a full page reload.
//
// NOTE: Only the Dashboard page has been built out so far. The remaining
// routes below are commented out — as each page is built (following the
// exact same folder + "mount Topbar/Sidebar at the top" pattern used by
// Dashboard.jsx), import it above and uncomment its <Route> here. The
// paths already match what /mobilizerpage/data/sidebarMenu.js links to,
// so the Sidebar needs no changes once a page goes live.
// ─────────────────────────────────────────────────────────────────────

import { Routes, Route } from 'react-router-dom';

import Dashboard from '../components/mobilizerpage/pages/Dashboard/Dashboard/Dashboard';
// import Enquiries from '../components/mobilizerpage/pages/Enquiries/Enquiries/Enquiries';
// import Enrollments from '../components/mobilizerpage/pages/Enrollments/Enrollments/Enrollments';
// import JobFairDashboard from '../components/mobilizerpage/pages/JobFair/JobFairDashboard/JobFairDashboard';
// import RegistrationForms from '../components/mobilizerpage/pages/JobFair/RegistrationForms/RegistrationForms';
// import WalkInRegistrations from '../components/mobilizerpage/pages/JobFair/WalkInRegistrations/WalkInRegistrations';
// import RecruiterRegistrations from '../components/mobilizerpage/pages/JobFair/RecruiterRegistrations/RecruiterRegistrations';
// import JobFairReports from '../components/mobilizerpage/pages/JobFair/JobFairReports/JobFairReports';
// import JobFairExport from '../components/mobilizerpage/pages/JobFair/JobFairExport/JobFairExport';
// import Event from '../components/mobilizerpage/pages/Event/Event/Event';

export default function MobilizerDashboard() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ---- Enquiries ---- */}
      {/* <Route path="/enquiries" element={<Enquiries />} /> */}

      {/* ---- Enrollments ---- */}
      {/* <Route path="/enrollments" element={<Enrollments />} /> */}

      {/* ---- Job Fair (expandable sidebar group) ---- */}
      {/* <Route path="/job-fair/dashboard" element={<JobFairDashboard />} /> */}
      {/* <Route path="/job-fair/registration-forms" element={<RegistrationForms />} /> */}
      {/* <Route path="/job-fair/walk-in-registrations" element={<WalkInRegistrations />} /> */}
      {/* <Route path="/job-fair/recruiter-registrations" element={<RecruiterRegistrations />} /> */}
      {/* <Route path="/job-fair/reports" element={<JobFairReports />} /> */}
      {/* <Route path="/job-fair/export" element={<JobFairExport />} /> */}

      {/* ---- Event ---- */}
      {/* <Route path="/event" element={<Event />} /> */}

      {/* Default redirect to dashboard */}
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}
