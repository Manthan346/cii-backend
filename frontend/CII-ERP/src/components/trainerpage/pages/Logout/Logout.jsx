import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Sidebar from '../../../layout/Sidebar/Sidebar';
import Topbar from '../../../layout/Topbar/Topbar';
import { Button } from '../../../shared';
import ciiLogo from '../../../assets/cii-logo2.png';
import '../../../styles/variables.css';
import './Logout.css';

/**
 * Logout (full page, "Log out of CII Portal?")
 *
 * Staff "Logout" page, reached via the sidebar's Logout item (last
 * item in the WORK section). Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page) around a single
 * centered confirmation card, matching the reference screenshot.
 *
 * "Yes, log me out" fires onLogout so a parent app can wire this up
 * to real auth (clearing the session/token and redirecting to the
 * login screen) once that exists - for now it just navigates to the
 * root route as a stand-in. "Cancel" simply returns to wherever the
 * staff member came from.
 */
const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    // TODO: wire up to real auth (clear session/token) once available.
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: 'Staff Admin' }}
        hasUnreadNotifications={true}
        onMenuToggle={() => {}}
        onSearch={() => {}}
      />

      <div className="staff-dashboard__content">
        <Sidebar />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="logout-page">
              <div className="logout-page__card">
                <img
                  src={ciiLogo}
                  alt="CII"
                  className="logout-page__logo"
                />

                <h1 className="logout-page__title">Log out of CII Portal?</h1>
                <p className="logout-page__subtitle">
                  You'll need to sign in again to access the staff
                  dashboard, candidate records and reports.
                </p>

                <Button
                  variant="primary"
                  icon={LogOut}
                  iconPosition="left"
                  onClick={handleConfirm}
                >
                  Yes, log me out
                </Button>

                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Logout;
