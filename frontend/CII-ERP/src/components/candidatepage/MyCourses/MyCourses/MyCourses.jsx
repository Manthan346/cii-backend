// MyCourses.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import { StatGrid } from "../StatCard/StatCard";
import CompletedCourses from "../CompletedCourses/CompletedCourses";

import API from "../../../../../api/api";

import orgLogo from "../../../../assets/Logo.png";

import "./MyCourses.css";

// ─── Map /candidate/course-stats -> StatGrid's expected shape ─────────
function mapCourseStats(courseStats) {
  return [
    {
      label: "Total enrolled courses",
      value: String(courseStats?.total_enrolled_courses ?? 0),
      iconBg: "#E6EEF8",
      iconColor: "#003C7E",
      icon: "courses",
    },
    {
      label: "In progress courses",
      value: String(courseStats?.in_progress_courses ?? 0),
      iconBg: "#FFF5E0",
      iconColor: "#B8892A",
      icon: "dashboard",
    },
    {
      label: "Completed course",
      value: String(courseStats?.completed_courses ?? 0),
      iconBg: "#E2F4EE",
      iconColor: "#0D6E50",
      icon: "certificates",
    },
    // No data source for learning hours yet — left static
    // {
    //   label: "Learning time of courses",
    //   value: "42h",
    //   iconBg: "#FFF0EB",
    //   iconColor: "#E05A2B",
    //   icon: "assessments",
    // },
  ];
}

// ─── Map academicDetails.courses -> course panel rows ─────────────────
function mapCourseDetails(academicDetails) {
  const courses = academicDetails?.courses ?? [];

  return courses.map((c, idx) => ({
    id: c.course_id ?? c.id ?? `completed-course-${idx}`,
    icon: "book", // TODO: swap once we know if backend sends an icon/category field
    iconBg: "#E2F4EE",
    iconColor: "#0D6E50",
    title: c.title ?? c.course ?? "-",
    courseName: c.course ?? "-",
    enrolledDate: c.enrolled_date ?? null,
    startingDate: c.starting_date ?? null,
    company: c.company ?? "-",
    location: c.location ?? "-",
    endDate: c.end_date ?? null,
    trainer: c.trainer_name ?? "-",
    description: c.description ?? "",
  }));
}

export default function MyCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [academicDetails, setAcademicDetails] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAcademics() {
      try {
        setLoading(true);
        const [academicsRes, statsRes] = await Promise.all([
          API.get("/candidate/candidate-academics"),
          API.get("/candidate/course-stats"),
        ]);
        if (!cancelled) {
          setAcademicDetails(academicsRes.data?.data?.academicDetails ?? null);
          setCourseStats(statsRes.data?.data?.courseStats ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAcademics();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = mapCourseStats(courseStats);
  const courseDetails = mapCourseDetails(academicDetails);
  const orgLogoSrc = orgLogo;

  if (error) {
    return (
      <div className="my-courses__error">
        Couldn't load your courses. Please try again.
      </div>
    );
  }

  return (
    <div className="my-courses">
      <Sidebar
        orgLogoSrc={orgLogoSrc}
        activeItem="My Courses"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="my-courses__main">
        <Topbar
          search={search}
          onSearch={setSearch}
          userInitials="AS"
          onMenuClick={() => setSidebarOpen((o) => !o)}
        />

        <main className="my-courses__body">
          {loading ? <p>Loading stats…</p> : <StatGrid stats={stats} />}

          <div className="my-courses__progress-row">
            {loading ? (
              <p>Loading courses…</p>
            ) : (
              <CompletedCourses
                courses={courseDetails}
                onViewAll={() => navigate("/progress/certificates")}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
