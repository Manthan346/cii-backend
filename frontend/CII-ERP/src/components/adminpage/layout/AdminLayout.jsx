import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import './AdminLayout.css';

/**
 * AdminLayout
 *
 * Shell for every admin page: Topbar across the top, Sidebar down the
 * left, routed page content on the right via <Outlet />. Individual
 * pages (Dashboard, Candidates, Course Management, ...) stay unaware
 * of the chrome around them - they just render into the outlet.
 *
 * Wire this up in your router as the layout route, e.g.:
 *   <Route path="/admin" element={<AdminLayout />}>
 *     <Route path="dashboard" element={<Dashboard />} />
 *     ...
 *   </Route>
 */
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Topbar onMenuToggle={() => setIsSidebarOpen(true)} />

      <div className="admin-layout__body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
