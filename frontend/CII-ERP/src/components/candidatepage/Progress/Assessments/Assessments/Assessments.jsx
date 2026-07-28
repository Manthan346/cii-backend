import React, { useState, useEffect } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";

import AssessmentsStats from "../AssessmentsStats/AssessmentsStats";
import PendingAssessments from "../PendingAssessments/PendingAssessments";
import CompletedAssessments from "../CompletedAssessments/CompletedAssessments";
import PerformanceByCourse from "../PerformanceByCourse/PerformanceByCourse";
import TipsCard from "../TipsCard/TipsCard";

import API from "../../../../../../api/api";
import orgLogo from '../../../../../assets/Logo.png';

import "./Assessments.css";

// ─── Helpers ────────────────────────────────────────────────────────────
function computeDueLabel(assessmentDate) {
  if (!assessmentDate) return "Due date TBA";
  const due = new Date(assessmentDate);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  return `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

function mapPending(pendingArr = []) {
  return pendingArr.map((p, idx) => ({
    id: p.assessments?.title ? `${p.assessments.title}-${idx}` : `pending-${idx}`,
    title: p.assessments?.title ?? "-",
    course: "-", // no course field in backend response
    type: p.assessments?.assessment_type ?? "quiz",
    dueLabel: computeDueLabel(p.assessments?.assessment_date),
    questions: null, // no field from backend
    duration: null,  // no field from backend
    ctaLabel: "Start Now",
  }));
}

function mapCompleted(completedArr = []) {
  return completedArr.map((c, idx) => ({
    id: c.assessments?.title ? `${c.assessments.title}-${idx}` : `completed-${idx}`,
    title: c.assessments?.title ?? "-",
    course: "-", // no course field in backend response
    score: null,  // no numeric score field in backend response
    grade: c.assessment_grade ?? "-",
    submittedOn: c.attempted_at
      ? `Submitted ${new Date(c.attempted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
      : "-",
  }));
}

const Assessments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAssessments() {
      try {
        setLoading(true);
        const res = await API.get("/candidate/candidate-assesment");
        const data = res.data?.data;
        if (!cancelled && data) {
          setPending(mapPending(data.pending));
          setCompleted(mapCompleted(data.completed));
          setPendingCount(data.pendingCount ?? 0);
          setCompletedCount(data.completedCount ?? 0);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAssessments();
    return () => { cancelled = true; };
  }, []);

  // Average/Best score have no source field yet — kept at 0 per instruction
  const stats = [
    { id: "pending", icon: "hourGlass", iconBg: "#FDECE3", iconColor: "#E8834A", value: String(pendingCount), label: "Pending" },
    { id: "completed", icon: "checkCircle", iconBg: "#E1F5EA", iconColor: "#2FAE60", value: String(completedCount), label: "Completed" },
    { id: "average", icon: "trendingUp", iconBg: "#E8E9FB", iconColor: "#5B5FEF", value: "0%", label: "Average score" },
    { id: "best", icon: "trophy", iconBg: "#FBE9E4", iconColor: "#E8834A", value: "0%", label: "Best score" },
  ];

  const handleStartAssessment = (assessment) => {
    console.log("Start assessment:", assessment.id);
  };

  const handleReviewAssessment = (assessment) => {
    console.log("Review assessment:", assessment.id);
  };

  if (error) {
    return <div className="assessments-page__error">Couldn't load your assessments. Please try again.</div>;
  }

  return (
    <div className="assessments-page">
      <Sidebar
        orgLogoSrc={orgLogo}
        activeItem="Assessments"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="assessments-page__main">
        <Topbar
          searchPlaceholder="Search courses, classes..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <div className="assessments-page__content">
          <header className="assessments-page__header">
            <h1 className="assessments-page__title">Assessments</h1>
            <p className="assessments-page__subtitle">
              Quizzes, assignments, and exams across your courses.
            </p>
          </header>

          <AssessmentsStats stats={stats} />

          <div className="assessments-page__body">
            <div className="assessments-page__left">
              {loading ? (
                <p>Loading assessments…</p>
              ) : (
                <>
                  <PendingAssessments items={pending} onStart={handleStartAssessment} />
                  <CompletedAssessments items={completed} onReview={handleReviewAssessment} />
                </>
              )}
            </div>

            <div className="assessments-page__right">
              {/* No backend data for per-course performance yet — stays static */}
              <PerformanceByCourse />
              <TipsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;