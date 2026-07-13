// src/components/candidatepage/Schedule/UpcomingClasses/ScheduleDashboard.jsx
import { useMemo, useState } from "react";

import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import StatCard from "../../../shared/StatCard/StatCard";
import WeekSelector from "../WeekSelector/WeekSelector";
import ScheduleList from "../ScheduleList/ScheduleList";
import ClassEtiquette from "../ClassEtiquette/ClassEtiquette";

import {
  statistics,
  weekData,
  scheduleDays,
  etiquette,
  defaultSelectedDayId,
} from "../../../../../data/upcomingClasses";

import styles from "./ScheduleDashboard.module.css";
import orgLogo from "../../../../../assets/Logo.png"

/**
 * Upcoming Classes (Schedule Dashboard) page.
 *
 * Composes Sidebar + Topbar itself, following the same pattern as
 * Dashboard / MyCourses / Profile / Attendance (see the usage note at
 * the top of Sidebar.jsx). This is what makes the sidebar + mobile
 * drawer show up correctly here too.
 *
 * BACKEND INTEGRATION:
 * Replace the imported mock arrays with API results, e.g.
 *
 *   const [statistics, setStatistics] = useState([]);
 *   const [weekData, setWeekData] = useState([]);
 *   const [scheduleDays, setScheduleDays] = useState([]);
 *   const [etiquette, setEtiquette] = useState([]);
 *
 *   useEffect(() => {
 *     api.getScheduleStatistics().then(setStatistics);
 *     api.getScheduleWeek().then(setWeekData);
 *     api.getScheduleClasses().then(setScheduleDays);
 *     api.getClassEtiquette().then(setEtiquette);
 *   }, []);
 *
 * No child component needs to change — they all just consume props.
 */
function ScheduleDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDayId, setSelectedDayId] = useState(defaultSelectedDayId);
  const [searchValue, setSearchValue] = useState("");

  // Only the classes belonging to the currently selected week day are shown.
  // Swap this filter for a server-side query once the backend is connected
  // (e.g. api.getScheduleClasses({ date })).
  const visibleScheduleDays = useMemo(
    () => scheduleDays.filter((group) => group.weekDayId === selectedDayId),
    [selectedDayId]
  );

  return (
    <div className={styles.layout}>
      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Upcoming Classes"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={styles.content}>
        <Topbar
          search={searchValue}
          onSearch={setSearchValue}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen((open) => !open)}
        />

        <main className={styles.main}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Upcoming Classes</h1>
            <p className={styles.subtitle}>Your live session and lab schedule for this week.</p>
          </div>

          <section className={styles.statsGrid} aria-label="Schedule statistics">
            {statistics.map((stat) => (
              <StatCard
                key={stat.id}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
              />
            ))}
          </section>

          <section className={styles.weekSection} aria-label="Week calendar">
            <WeekSelector days={weekData} selectedId={selectedDayId} onSelect={setSelectedDayId} />
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.scheduleColumn} aria-label="Today's schedule">
              <ScheduleList days={visibleScheduleDays} />
            </section>

            <ClassEtiquette items={etiquette} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ScheduleDashboard;
