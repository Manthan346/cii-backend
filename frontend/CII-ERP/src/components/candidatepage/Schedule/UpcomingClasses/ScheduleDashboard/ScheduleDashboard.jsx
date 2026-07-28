// src/components/candidatepage/Schedule/UpcomingClasses/ScheduleDashboard.jsx
import { useEffect, useMemo, useState } from "react";

import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";
import StatCard from "../../../shared/StatCard/StatCard";
import WeekSelector from "../WeekSelector/WeekSelector";
import ScheduleList from "../ScheduleList/ScheduleList";
import ClassEtiquette from "../ClassEtiquette/ClassEtiquette";

import { fetchScheduleData, etiquette } from "../../../../../services/Scheduleservice ";

import styles from "./ScheduleDashboard.module.css";
import orgLogo from "../../../../../assets/Logo.png"

function ScheduleDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [selectedDayId, setSelectedDayId] = useState(null);
  const [todayId, setTodayId] = useState(null); // fixed anchor for ordering, doesn't change on click
  const [statistics, setStatistics] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [scheduleDays, setScheduleDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let cancelled = false;
  fetchScheduleData().then((result) => {
    if (cancelled) return;
    setStatistics(result.statistics);
    setWeekData(result.weekData);
    setScheduleDays(result.scheduleDays);
    setSelectedDayId(result.defaultSelectedDayId);
    setTodayId(result.todayId); // was: result.defaultSelectedDayId
    setLoading(false);
  });
  return () => { cancelled = true; };
}, []);

  // Reorder the week so today is first, followed by the upcoming days,
  // with any earlier days (already passed) pushed to the end.
  const orderedWeekData = useMemo(() => {
    if (!weekData.length || todayId == null) return weekData;
    const todayIndex = weekData.findIndex((day) => day.id === todayId);
    if (todayIndex === -1) return weekData;
    return [...weekData.slice(todayIndex), ...weekData.slice(0, todayIndex)];
  }, [weekData, todayId]);

  // Only the classes belonging to the currently selected week day are shown.
  const visibleScheduleDays = useMemo(
    () => scheduleDays.filter((group) => group.weekDayId === selectedDayId),
    [scheduleDays, selectedDayId]
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

          {loading ? (
            <div className={styles.loading}>Loading your schedule…</div>
          ) : (
            <>
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
                <WeekSelector days={orderedWeekData} selectedId={selectedDayId} onSelect={setSelectedDayId} />
              </section>

              <div className={styles.contentGrid}>
                <section className={styles.scheduleColumn} aria-label="Today's schedule">
                  <ScheduleList days={visibleScheduleDays} />
                </section>

                <ClassEtiquette items={etiquette} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ScheduleDashboard;