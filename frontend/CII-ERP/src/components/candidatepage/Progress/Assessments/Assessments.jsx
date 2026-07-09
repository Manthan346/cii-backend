// ============================================================================
// Assessments.jsx
// ----------------------------------------------------------------------------
// Main "Assessments" page (Progress > Assessments in the sidebar).
// Mirrors the layout used by the other candidate pages (Dashboard,
// Attendance, Profile, My Courses):
//
//   <Sidebar />  <Topbar />
//                <page content>
//
// Composition (each imported from its own component folder):
//   - AssessmentsStats/        -> top 4 stat cards
//   - PendingAssessments/       -> left column, "Pending" card
//   - CompletedAssessments/     -> left column, "Completed" card
//   - PerformanceByCourse/      -> right column, progress bars
//   - TipsCard/                 -> right column, "Tips before you start"
//
// BACKEND INTEGRATION:
// Replace the local `useState(mockData)` calls with real fetches, e.g.:
//
//   const [stats, setStats] = useState([]);
//   const [pending, setPending] = useState([]);
//   const [completed, setCompleted] = useState([]);
//   const [coursePerf, setCoursePerf] = useState([]);
//
//   useEffect(() => {
//     let isMounted = true;
//     Promise.all([
//       fetch(`/api/candidates/${candidateId}/assessments/stats`).then((r) => r.json()),
//       fetch(`/api/candidates/${candidateId}/assessments/pending`).then((r) => r.json()),
//       fetch(`/api/candidates/${candidateId}/assessments/completed`).then((r) => r.json()),
//       fetch(`/api/candidates/${candidateId}/performance-by-course`).then((r) => r.json()),
//     ]).then(([statsRes, pendingRes, completedRes, perfRes]) => {
//       if (!isMounted) return;
//       setStats(statsRes);
//       setPending(pendingRes);
//       setCompleted(completedRes);
//       setCoursePerf(perfRes);
//     });
//     return () => { isMounted = false; };
//   }, [candidateId]);
//
// Then pass `stats`, `pending`, `completed`, `coursePerf` down as props
// instead of relying on each child component's local mock-data fallback.
// ============================================================================

import React, { useState } from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Topbar from "../../layout/Topbar/Topbar";

import AssessmentsStats from "./AssessmentsStats/AssessmentsStats";
import PendingAssessments from "./PendingAssessments/PendingAssessments";
import CompletedAssessments from "./CompletedAssessments/CompletedAssessments";
import PerformanceByCourse from "./PerformanceByCourse/PerformanceByCourse";
import TipsCard from "./TipsCard/TipsCard";

import orgLogo from '../../../../assets/Logo.png';

import "./Assessments.css";

const Assessments = () => {
  // Local UI state only (e.g. search box on the Topbar). Replace with real
  // data-fetching state as described in the comment block above once the
  // backend endpoints are ready.
  const [searchTerm, setSearchTerm] = useState("");

  // Handler passed to PendingAssessments -> PendingAssessmentItem.
  // BACKEND NOTE: wire this up to navigation, e.g. navigate(`/assessments/${assessment.id}/take`)
  const handleStartAssessment = (assessment) => {
    console.log("Start assessment:", assessment.id);
  };

  // Handler passed to CompletedAssessments -> CompletedAssessmentItem.
  // BACKEND NOTE: wire this up to navigation, e.g. navigate(`/assessments/${assessment.id}/results`)
  const handleReviewAssessment = (assessment) => {
    console.log("Review assessment:", assessment.id);
  };

  return (
    <div className="assessments-page">
      <Sidebar 
        orgLogoSrc={orgLogo}
        activeItem="Assessments" 
      />

      <div className="assessments-page__main">
        <Topbar
          searchPlaceholder="Search courses, classes..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="assessments-page__content">
          <header className="assessments-page__header">
            <h1 className="assessments-page__title">Assessments</h1>
            <p className="assessments-page__subtitle">
              Quizzes, assignments, and exams across your courses.
            </p>
          </header>

          <AssessmentsStats />

          <div className="assessments-page__body">
            <div className="assessments-page__left">
              <PendingAssessments onStart={handleStartAssessment} />
              <CompletedAssessments onReview={handleReviewAssessment} />
            </div>

            <div className="assessments-page__right">
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
