// MyCourses.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";
import { StatGrid } from "../StatCard/StatCard";
import CourseList from "../CourseList/CourseList";
import CompletedCourses from "../CompletedCourses/CompletedCourses";

import API from "../../../../../api/api";

import orgLogo from "../../../../assets/Logo.png";

import "./MyCourses.css";

function mapAcademicCourses(academicDetails) {
  return (academicDetails?.courses ?? []).map((course, index) => ({
    id: course.course_id ?? course.id ?? `academic-course-${index}`,
    title: course.title ?? course.course ?? "Course",
    tag: course.course_type ?? "ACADEMIC",
    tagColor: "#E6EEF8",
    tagTextColor: "#003C7E",
    company: course.company ?? "-",
    mode: course.mode,
    location: course.location,
    startDate: course.starting_date,
    endDate: course.end_date,
    trainer: course.trainer_name,
    desc: course.description ?? "Course details are available here.",
    logoSrc: null,
  }));
}

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

// ─── Map academicDetails.courses -> CompletedCourses' expected shape ───
// A course counts as "completed" when its end_date has passed.
//
// NOTE: field names below (title/professor/grade/certificateUrl) are
// GUESSES — candidate-academics's actual shape hasn't been confirmed for
// anything beyond starting_date/end_date. Once you share a real response,
// swap the right-hand side of each field to match. Until then this will
// likely render "-" / blank for title, professor, grade, and no working
// certificate download link.
function computeCompletedCourses(academicDetails) {
  const courses = academicDetails?.courses ?? [];
  const now = new Date();

  return courses
    .filter((c) => c.end_date && new Date(c.end_date) < now)
    .map((c, idx) => ({
      id: c.course_id ?? c.id ?? `completed-course-${idx}`,
      icon: "book", // TODO: swap once we know if backend sends an icon/category field
      iconBg: "#E2F4EE",
      iconColor: "#0D6E50",
      title: c.course_name ?? c.title ?? "-",
      completedDate: new Date(c.end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      professor: c.professor_name ?? c.instructor_name ?? "-",
      grade: c.grade ?? c.course_grade ?? "-",
      certificateUrl: c.certificate_url ?? c.certificate_link ?? null,
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
  const completed = computeCompletedCourses(academicDetails);
  const academicCourses = mapAcademicCourses(academicDetails);

  const courses = academicCourses;
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
                courses={completed}
                onViewAll={() => navigate("/progress/certificates")}
              />
            )}
          </div>
          {!loading && <CourseList cards={courses} search={search} />}
        </main>
      </div>
    </div>
  );
}
