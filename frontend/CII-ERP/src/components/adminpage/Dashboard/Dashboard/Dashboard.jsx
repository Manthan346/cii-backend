import React, { useEffect, useState } from "react";
import { Users, IdCard, UserCog, CalendarCheck } from "lucide-react";
import StatsOverview from "../StatsOverview/StatsOverview";
import CoursePerformance from "../CoursePerformance/CoursePerformance";
import {
  fetchCenterStats,
  fetchCoursePerformance,
} from "../../../../../api/admin/dashboardService";
import "./Dashboard.css";

// Maps getCenterStats' raw counts to the 4 stat cards.
//
// Two of these are best-effort given what the backend currently returns:
//  - "Total staff" only has `totalInstructors` to draw from — getCenterStats
//    has no combined staff figure (instructors + HR + mobilizers). Swap this
//    for a real `totalStaff` field once the backend adds one.
//  - "Monthly Enrollments" uses `newUsersThisMonth`, which counts new
//    user_login rows of ANY role created this month (new candidates, new
//    staff, everyone) — not batch_enrollment rows. It's a proxy, not a real
//    enrollments count, until the backend exposes one.
const buildSummaryStats = (data = {}) => [
  {
    id: "total-users",
    label: "Total User",
    value: (data.totalUsers ?? 0).toLocaleString(),
    icon: Users,
    iconBg: "#6c5ce7",
  },
  {
    id: "total-candidates",
    label: "Total Candidates",
    value: (data.totalCandidates ?? 0).toLocaleString(),
    icon: IdCard,
    iconBg: "#6c5ce7",
  },
  {
    id: "total-staff",
    label: "Total staff",
    value: (data.totalInstructors ?? 0).toLocaleString(),
    icon: UserCog,
    iconBg: "#1f9d5c",
  },
  {
    id: "monthly-enrollments",
    label: "Monthly Enrollments",
    value: `${(data.newUsersThisMonth ?? 0).toLocaleString()}+`,
    icon: CalendarCheck,
    iconBg: "#f2913b",
  },
];

/**
 * Dashboard (Admin)
 *
 * Top-level "Institution overview" landing page. Now backed by real data:
 * StatsOverview <- GET /admin/center/stats
 * CoursePerformance <- GET /admin/center/course-performance
 */
const Dashboard = () => {
  const [stats, setStats] = useState(() => buildSummaryStats());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsData, courseData] = await Promise.all([
          fetchCenterStats(),
          fetchCoursePerformance(),
        ]);
        if (cancelled) return;
        setStats(buildSummaryStats(statsData));
        setCourses(courseData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              "Unable to load dashboard data right now.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__heading">
        <h1 className="admin-dashboard__title">Institution overview</h1>
        <p className="admin-dashboard__subtitle">
          Snapshot across all centers
        </p>
      </div>

      <StatsOverview stats={stats} />

      {error && <p className="admin-dashboard__error">{error}</p>}
      {loading ? (
        <p className="admin-dashboard__loading">Loading course performance…</p>
      ) : (
        <CoursePerformance courses={courses} />
      )}
    </div>
  );
};

export default Dashboard;