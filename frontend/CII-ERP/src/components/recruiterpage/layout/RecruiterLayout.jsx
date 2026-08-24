import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import './RecruiterLayout.css';

/**
 * RecruiterLayout
 *
 * Shell for every recruiter page: Topbar across the top, Sidebar down
 * the left, routed page content on the right via <Outlet />.
 * Individual sections (Dashboard, Job Management, Placement Management,
 * Applications, Notifications, Profile, ...) stay unaware of the
 * chrome around them - they just render into the outlet. Same shape
 * as mobilizerpage's MobilizerLayout.
 *
 * Also owns the Logout action - Sidebar just calls `onLogout`, this
 * is where that actually clears the session and redirects.
 *
 * Wire this up in your router as the layout route, e.g.:
 *   <Route path="/recruiter" element={<RecruiterLayout />}>
 *     <Route path="dashboard" element={<Dashboard />} />
 *     <Route path="job-management" element={<JobManagement />} />
 *     <Route path="job-fair-job-drive" element={<JobFairJobDrive />} />
 *     <Route path="applications" element={<Applications />} />
 *     <Route path="notifications" element={<Notifications />} />
 *     <Route path="profile" element={<Profile />} />
 *   </Route>
 */
const RecruiterLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: replace with whatever this project actually uses for auth -
    // e.g. clearing a token from localStorage/cookies, calling
    // POST /api/auth/logout, or an AuthContext's own logout() method.
    // localStorage.removeItem('authToken');
    navigate('/LoginPage', { replace: true });
  };

  return (
    <div className="recruiter-layout">
      <Topbar onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="recruiter-layout__body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <main className="recruiter-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
