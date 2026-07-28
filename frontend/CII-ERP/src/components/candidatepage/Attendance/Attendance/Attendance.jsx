// Attendance.jsx
// Root Attendance page. Sits at:
//   src/components/candidatepage/Attendance/Attendance/Attendance.jsx
// and should be imported by CandidateDashboard.jsx (or your router)
// as the "/attendance" route — see Sidebar.jsx's NAV_MAIN entry.
//
// Mirrors Dashboard.jsx's conventions: this component is the only one
// that talks to the service layer (`attendanceService`). Every child
// below only receives plain props, so swapping mock data for a real
// API later means changing `attendanceService.js` alone.
//
// NOTE: AttendanceOverview is intentionally still fed from
// attendanceService's mock data — leave it as-is until the backend
// work for it lands. RecentAttendanceLog is now live.

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import { StatGrid } from "../../shared/StatCard/StatCard";
import AttendanceBanner from "../AttendanceBanner/AttendanceBanner";
import AttendanceCalendar from "../AttendanceCalendar/AttendanceCalendar";
import AttendanceCourseFilter from "../AttendanceCourseFilter/AttendanceCourseFilter";
import CourseAttendanceList from "../CourseAttendanceList/CourseAttendanceList";
import RecentAttendanceLog from "../RecentAttendanceLog/RecentAttendanceLog";
import AttendanceOverview from "../AttendanceOverview/AttendanceOverview";

import {
  fetchAttendanceData,
  fetchCourseOptions,
  fetchAttendanceCalendar,
  fetchRecentLog,
} from "../../../../services/attendanceService";

import "./Attendance.css";
import orgLogo from "../../../../assets/Logo.png";

// Static stat-tile chrome (icon + colours). Values come from the
// service layer so this file never needs to change for new numbers.
const STAT_META = [
  {
    key: "overallPct",
    icon: "attendance",
    iconBg: "#E6EEF8",
    iconColor: "#2F6FB0",
    label: "Overall attendance",
    suffix: "%",
  },
  {
    key: "sessionsAttended",
    icon: "checkCircle",
    iconBg: "#E4F6EC",
    iconColor: "#1B8A4F",
    label: "Sessions attended",
    suffix: "",
  },
  {
    key: "sessionsMissed",
    icon: "xCircle",
    iconBg: "#FBE8E4",
    iconColor: "#D8432B",
    label: "Sessions missed",
    suffix: "",
  },
  {
    key: "lateArrivals",
    icon: "clock",
    iconBg: "#FCEFD9",
    iconColor: "#B8892A",
    label: "Late arrivals",
    suffix: "",
  },
];

export default function Attendance() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);

  // Course/batch filter + calendar month/year all live in the URL's
  // query params (?courseId=&month=&year=), so the view is bookmarkable/
  // shareable and survives a refresh. The URL is the single source of
  // truth — read values out of it, write changes back into it.
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();

  const selectedCourseId = searchParams.get("courseId") || null;
  const selectedMonth = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : today.getMonth() + 1;
  const selectedYear = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : today.getFullYear();

  // Merge partial updates into the existing query string without
  // clobbering unrelated params (e.g. anything else the app adds later).
  // `replace: true` so month/course browsing doesn't spam browser history.
  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next, { replace: true });
  };

  const setSelectedCourseId = (id) => updateParams({ courseId: id });

  const [courseOptions, setCourseOptions] = useState([]);
  // Distinguish "first load" (full-page loader) from "filter change"
  // (keep existing content visible, just dim/disable the filter).
  const [refreshing, setRefreshing] = useState(false);

  const [calendarData, setCalendarData] = useState(null); // { monthLabel, year, month, days } | null
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [recentLog, setRecentLog] = useState([]);

  // Filter options only need loading once.
  useEffect(() => {
    let cancelled = false;
    fetchCourseOptions().then((options) => {
      if (!cancelled) setCourseOptions(options);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recent log is a global feed, not scoped by the course filter —
  // load it once rather than re-fetching on every filter change.
  useEffect(() => {
    let cancelled = false;
    fetchRecentLog().then((logs) => {
      if (!cancelled) setRecentLog(logs);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Re-fetch summary/banner/courses (all-time) whenever the filter changes.
  useEffect(() => {
    let cancelled = false;
    setRefreshing(true);
    fetchAttendanceData(selectedCourseId).then((result) => {
      if (!cancelled) {
        setData(result);
        setRefreshing(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCourseId]);

  // Re-fetch the calendar grid whenever the course, month, or year
  // changes. No courseId => backend has no day grid to give us, so
  // skip the call and let AttendanceCalendar show its placeholder.
  useEffect(() => {
    let cancelled = false;

    if (!selectedCourseId) {
      setCalendarData(null);
      setCalendarLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setCalendarLoading(true);
    fetchAttendanceCalendar({
      courseId: selectedCourseId,
      month: selectedMonth,
      year: selectedYear,
    }).then((result) => {
      if (!cancelled) {
        setCalendarData(result);
        setCalendarLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    const m = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const y = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    updateParams({ month: m, year: y });
  };

  const handleNextMonth = () => {
    const m = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const y = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    updateParams({ month: m, year: y });
  };

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const calendarMonthLabel = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;
  const isCurrentMonth =
    selectedYear === today.getFullYear() &&
    selectedMonth === today.getMonth() + 1;

  const stats = data
    ? STAT_META.map((meta) => ({
        icon: meta.icon,
        iconBg: meta.iconBg,
        iconColor: meta.iconColor,
        label: meta.label,
        value: `${data.summary[meta.key]}${meta.suffix}`,
      }))
    : [];

  return (
    <div className="attendance-page">
      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Attendance"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="attendance-page__main">
        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />

        <main className="attendance-page__body">
          {!data ? (
            <div className="attendance-page__loading">
              Loading your attendance…
            </div>
          ) : (
            <>
              {/* 1. Page title */}
              <div className="attendance-page__heading">
                <h1 className="attendance-page__title">Attendence</h1>
                <p className="attendance-page__subtitle">
                  Your session-wise attendance across all enrolled courses.
                </p>
              </div>

              {/* 2. Eligibility warning */}
              <AttendanceBanner
                courseName={data.alert?.courseName}
                thresholdPct={data.alert?.thresholdPct}
              />

              {/* 3. Stat tiles */}
              <StatGrid stats={stats} />

              {/* 4. Course/batch filter */}
              <AttendanceCourseFilter
                courses={courseOptions}
                value={selectedCourseId}
                onChange={setSelectedCourseId}
                loading={refreshing}
              />

              {/* 5. Calendar + By Courses */}
              <div className="attendance-page__row attendance-page__row--split">
                <AttendanceCalendar
                  monthLabel={calendarMonthLabel}
                  year={selectedYear}
                  month={selectedMonth}
                  days={selectedCourseId ? (calendarData?.days ?? []) : null}
                  todayDate={isCurrentMonth ? today.getDate() : null}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                  navDisabled={calendarLoading}
                />
                <CourseAttendanceList courses={data.courses} />
              </div>

              {/* 6. Recent log (live) + Overview (still mock-fed) */}
              <div className="attendance-page__row attendance-page__row--split">
                <RecentAttendanceLog logs={recentLog} />
                <AttendanceOverview
                  presentPct={data.overview.presentPct}
                  absentPct={data.overview.absentPct}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
