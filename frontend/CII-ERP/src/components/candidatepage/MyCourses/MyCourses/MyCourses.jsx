// MyCourses.jsx
import { useState, useEffect } from "react";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import { StatGrid } from "../StatCard/StatCard";
import CourseList from "../CourseList/CourseList";
import CompletedCourses from "../CompletedCourses/CompletedCourses";
import UpSkillActivities from "../UpSkillActivities/UpSkillActivities";
import SuggestedCourses from "../SuggestedCourses/SuggestedCourses";

import API from "../../../../../api/api";

// Available Courses (courseCards) and Upskill Activities stay static —
// left untouched per request. Completed-courses panel and Suggested-courses
// panel also stay static (no backend for those yet).
import {
  courseCards,
  completedCourses,
  upSkillActivities,
  suggestedCourses,
} from "../../../../data/myCoursesData";
import orgLogo from "../../../../assets/Logo.png";

import "./MyCourses.css";

// ─── Derive stat counts from real academic data ────────────────────────
// candidate-academics doesn't return enrollment_status, so status is
// inferred from starting_date / end_date compared to today.
function computeStats(academicDetails) {
  const courses = academicDetails?.courses ?? [];
  const now = new Date();

  let inProgress = 0;
  let completed = 0;

  courses.forEach((c) => {
    const start = c.starting_date ? new Date(c.starting_date) : null;
    const end = c.end_date ? new Date(c.end_date) : null;

    if (end && end < now) {
      completed += 1;
    } else if (start && start <= now && (!end || end >= now)) {
      inProgress += 1;
    }
    // else: upcoming/enrolled — not counted in either bucket
  });

  return [
    {
      label: "Total enrolled courses",
      value: String(courses.length),
      iconBg: "#E6EEF8",
      iconColor: "#003C7E",
      icon: "courses",
    },
    {
      label: "In progress courses",
      value: String(inProgress),
      iconBg: "#FFF5E0",
      iconColor: "#B8892A",
      icon: "dashboard",
    },
    {
      label: "Completed course",
      value: String(completed),
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

export default function MyCourses() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [academicDetails, setAcademicDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAcademics() {
      try {
        setLoading(true);
        const res = await API.get("/candidate/candidate-academics");
        if (!cancelled) {
          setAcademicDetails(res.data?.data?.academicDetails ?? null);
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

  const stats = computeStats(academicDetails);

  // Untouched — static as before
  const courses = courseCards;
  const completed = completedCourses;
  const upSkill = upSkillActivities;
  const suggested = suggestedCourses;
  const orgLogoSrc = orgLogo;

  const handleEnroll = (courseId) => {
    console.log("enroll requested for course", courseId);
  };

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
            <CompletedCourses courses={completed} />
            <UpSkillActivities activities={upSkill} />
          </div>
          {/* 
          <SuggestedCourses suggestions={suggested} onEnroll={handleEnroll} />

          <CourseList cards={courses} search={search} /> */}
        </main>
      </div>
    </div>
  );
}
