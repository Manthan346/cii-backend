import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../layout/Sidebar/Sidebar";
import Topbar from "../../../layout/Topbar/Topbar";

import AssessmentsStats from "../AssessmentsStats/AssessmentsStats";
import AvailableAssessments from "../AvailableAssessments/AvailableAssessments";
import PendingAssessments from "../PendingAssessments/PendingAssessments";
import CompletedAssessments from "../CompletedAssessments/CompletedAssessments";
import PerformanceByCourse from "../PerformanceByCourse/PerformanceByCourse";
import TipsCard from "../TipsCard/TipsCard";

import {
  fetchCandidateAssessments,
  fetchAvailableAssessments,
  startAssessment,
} from "../../../../../services/Assessmentsservice";

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

// Matches the confirmed getAllAssessments response shape:
// { assessment_id, title, assessment_desc, assessment_type,
//   assessment_date, assessment_duration, assessment_link,
//   batch_details: { batch_name, batch_code } }
function mapAvailable(availableArr = []) {
  return availableArr.map((a, idx) => {
    const due = a.assessment_date ? new Date(a.assessment_date) : null;
    const isExpired = due ? due < new Date() : false;

    return {
      id: a.assessment_id ?? `available-${idx}`,
      assessmentId: a.assessment_id,
      title: a.title ?? "-",
      course: a.batch_details?.batch_name ?? "-",
      type: a.assessment_type ?? "quiz",
      dueLabel: computeDueLabel(a.assessment_date),
      assessmentLink: a.assessment_link ?? null,
      isExpired,
    };
  });
}

function mapPending(pendingArr = []) {
  return pendingArr.map((p, idx) => ({
    id: p.assessments?.title ? `${p.assessments.title}-${idx}` : `pending-${idx}`,
    title: p.assessments?.title ?? "-",
    course: "-",
    type: p.assessments?.assessment_type ?? "quiz",
    statusLabel: "Being checked",
    startedOn: p.attempted_at
      ? `Submitted ${new Date(p.attempted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
      : "-",
  }));
}

function mapCompleted(completedArr = []) {
  return completedArr.map((c, idx) => ({
    id: c.assessments?.title ? `${c.assessments.title}-${idx}` : `completed-${idx}`,
    title: c.assessments?.title ?? "-",
    course: "-",
    score: null,
    grade: c.assessment_grade ?? "-",
    submittedOn: c.attempted_at
      ? `Submitted ${new Date(c.attempted_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
      : "-",
  }));
}

const Assessments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [available, setAvailable] = useState([]);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptingId, setAttemptingId] = useState(null);
  // Per-assessment error message (e.g. "due date has passed"), keyed by
  // assessment.id, shown inline on that item instead of blowing up the page.
  const [attemptErrors, setAttemptErrors] = useState({});

  const loadAssessments = useCallback(async () => {
    try {
      setLoading(true);

      const [candidateRes, availableRes] = await Promise.all([
        fetchCandidateAssessments(),
        // Wrapped in a catch so a not-yet-verified endpoint/shape doesn't
        // block the rest of the page from loading.
        fetchAvailableAssessments().catch((err) => {
          console.error("Failed to load available assessments:", err);
          return null;
        }),
      ]);

      const data = candidateRes.data?.data;

      // Titles the candidate already has an attempt for (pending or
      // completed). Used below to filter "Available", since the
      // candidate-assesment endpoint doesn't return assessment_id on
      // these records — title is the only reliable-ish match we have
      // without a backend change. NOTE: this will misbehave if two
      // different assessments share the exact same title; the durable
      // fix is having getAllAssessments exclude already-attempted
      // assessments (or the candidate-assesment endpoint return
      // assessment_id) on the backend.
      const attemptedTitles = new Set();

      if (data) {
        setPending(mapPending(data.pending));
        setCompleted(mapCompleted(data.completed));
        setPendingCount(data.pendingCount ?? 0);
        setCompletedCount(data.completedCount ?? 0);

        (data.pending ?? []).forEach((p) => {
          if (p.assessments?.title) attemptedTitles.add(p.assessments.title);
        });
        (data.completed ?? []).forEach((c) => {
          if (c.assessments?.title) attemptedTitles.add(c.assessments.title);
        });
      }

      const availableData = availableRes?.data?.data;
      if (availableData) {
        const mapped = mapAvailable(availableData.assessments).filter(
          (a) => !attemptedTitles.has(a.title)
        );
        setAvailable(mapped);
        setAvailableCount(mapped.length);
      } else {
        setAvailable([]);
        setAvailableCount(0);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) await loadAssessments();
    })();
    return () => { cancelled = true; };
  }, [loadAssessments]);

  const stats = [
    { id: "available", icon: "clipboard", iconBg: "#E8E9FB", iconColor: "#5B5FEF", value: String(availableCount), label: "Available" },
    { id: "pending", icon: "hourGlass", iconBg: "#FDECE3", iconColor: "#E8834A", value: String(pendingCount), label: "Being checked" },
    { id: "completed", icon: "checkCircle", iconBg: "#E1F5EA", iconColor: "#2FAE60", value: String(completedCount), label: "Completed" },
  ];

  const handleAttemptAssessment = async (assessment) => {
    // Client-side guard: we already know this one's due date has passed
    // (computed in mapAvailable), so don't bother hitting the API — just
    // show the same message the backend would give.
    if (assessment.isExpired) {
      setAttemptErrors((prev) => ({
        ...prev,
        [assessment.id]: "The assessment due date has passed. You can no longer attempt this assessment.",
      }));
      return;
    }

    try {
      setAttemptingId(assessment.id);
      setAttemptErrors((prev) => {
        const next = { ...prev };
        delete next[assessment.id];
        return next;
      });

      const res = await startAssessment(assessment.assessmentId);
      const link = res.data?.data?.assessment_link ?? assessment.assessmentLink;

      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
      }

      // Refresh so the item naturally moves from Available into
      // "Being checked", driven by real server state.
      await loadAssessments();
    } catch (err) {
      console.error("Failed to start assessment:", err);

      // Surface backend messages (e.g. expired due date, already started)
      // inline on the item rather than failing the whole page.
      const message =
        err?.response?.data?.message ??
        "Couldn't start this assessment. Please try again.";
      setAttemptErrors((prev) => ({ ...prev, [assessment.id]: message }));

      // If the backend rejected it as expired/already-attempted, refresh
      // so the list reflects the true current state.
      if (err?.response?.status === 403 || err?.response?.status === 409) {
        await loadAssessments();
      }
    } finally {
      setAttemptingId(null);
    }
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
                  <AvailableAssessments
                    items={available}
                    onAttempt={handleAttemptAssessment}
                    attemptingId={attemptingId}
                    attemptErrors={attemptErrors}
                  />
                  <PendingAssessments items={pending} />
                  <CompletedAssessments items={completed} onReview={handleReviewAssessment} />
                </>
              )}
            </div>

            <div className="assessments-page__right">
              {/* <PerformanceByCourse />
              <TipsCard /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessments;