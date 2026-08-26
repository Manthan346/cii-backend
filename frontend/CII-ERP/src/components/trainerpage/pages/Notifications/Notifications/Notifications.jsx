import React, { useMemo, useState } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import { Button } from "../../../shared";
import NotificationTabs from "../NotificationTabs/NotificationTabs";
import NotificationList from "../NotificationList/NotificationList";
import {
  notificationTabs,
  notificationMeta,
  notificationRecords,
} from "../../../data";
import "../../../styles/variables.css";
import "./Notifications.css";

/**
 * Notifications (full page)
 *
 * Staff "Notification" page. Mounts the shared Topbar + Sidebar shell
 * (identical composition to every other staff page, e.g.
 * CandidateManagement/TaskAssigned) around the page-specific content:
 * header + "Mark all as read", the All/Unread/Task/Resources/System
 * filter pills, and the "Recent Notifications" list. All fake data
 * comes from data/notificationsData.js so it can be swapped for API
 * responses later without touching this file.
 */
const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notificationRecords;
    if (activeTab === "unread")
      return notificationRecords.filter((n) => n.unread);
    return notificationRecords.filter((n) => n.category === activeTab);
  }, [activeTab]);

  const handleMarkAllRead = () => {
    // Wire up to PATCH /api/notifications/read-all when the backend is ready.
  };

  return (
    <div className="staff-dashboard">
      <Topbar
        user={{ name: "Staff Admin" }}
        hasUnreadNotifications={true}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="staff-dashboard__content">
        <Sidebar /*isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}*/
        />

        <div className="staff-dashboard__main">
          <main className="staff-dashboard__body">
            <div className="notifications-page">
              <div className="notifications-page__header">
                <div>
                  <h1 className="notifications-page__title">Notification</h1>
                  <p className="notifications-page__subtitle">
                    you have {notificationMeta.unreadCount} unread notification
                  </p>
                </div>
                <Button variant="outline" onClick={handleMarkAllRead}>
                  Mark all as read
                </Button>
              </div>

              <div className="notifications-page__tabs-card">
                <NotificationTabs
                  tabs={notificationTabs}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              <NotificationList notifications={filteredNotifications} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
