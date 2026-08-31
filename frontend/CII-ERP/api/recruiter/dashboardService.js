import API from "../api.js";

import {
  CalendarDays,
  CheckCircle2,
  Briefcase,
  Lock,
  FileInput,
  Hourglass,
  Star,
  MonitorCheck,
} from "lucide-react";

/**
 * Stat card config for the Recruiter Dashboard — icon/color/label
 * paired with the exact metric key getHrDashboard() returns. Lives
 * here (not data/) since it's a direct display-mapping of this
 * endpoint's response shape, not standalone mock data.
 */
export const statCards = [
  {
    id: "total-job-applications",
    metric: "totalJobApplications",
    icon: FileInput,
    iconBg: "#f97316",
    label: "Total Applications",
  },
  {
    id: "total-job-events",
    metric: "totalJobEvents",
    icon: CalendarDays,
    iconBg: "#3b82f6",
    label: "Total Job Events",
  },
  {
    id: "upcoming-job-events",
    metric: "upcomingJobEvents",
    icon: Hourglass,
    iconBg: "#ec4899",
    label: "Upcoming Job Events",
  },
  {
    id: "completed-job-events",
    metric: "completedJobEvents",
    icon: CheckCircle2,
    iconBg: "#22c55e",
    label: "Completed Job Events",
  },
  {
    id: "shortlisted-students",
    metric: "shortlistedStudents",
    icon: Star,
    iconBg: "#a855f7",
    label: "Shortlisted Students",
  },
  {
    id: "selected-students",
    metric: "selectedStudents",
    icon: MonitorCheck,
    iconBg: "#14b8a6",
    label: "Selected Students",
  },
  {
    id: "current-jobs-posted",
    metric: "currentJobsPosted",
    icon: Briefcase,
    iconBg: "#38bdf8",
    label: "Current Jobs Posted",
  },
  {
    id: "interviewed-candidates",
    metric: "interviewedCandidates",
    icon: Lock,
    iconBg: "#6366f1",
    label: "Interviewed Candidates",
  },
];

export async function fetchRecruiterDashboard() {
  const response = await API.get("/hr/dashboard");
  return response.data?.data ?? {};
}

export async function fetchRecruiterApplicationsPerJob() {
  const response = await API.get("/hr/dashboard/application-graph");
  return Array.isArray(response.data?.data) ? response.data.data : [];
}

export async function fetchRecruiterApplicationsByStatus() {
  const response = await API.get("/hr/dashboard/application-piechart");
  const raw = response.data?.data ?? {};

  const {
    applied = 0,
    screening = 0,
    shortlisted = 0,
    interview = 0,
    selected = 0,
    rejected = 0,
    withdrawn = 0,
  } = raw;

  // `applied` from the backend is the TOTAL application count across
  // all statuses, not an "APPLIED stage" count. Derive the actual
  // count still sitting in the initial stage so the donut slices sum
  // to 100% instead of overcounting.
  const appliedStageOnly = Math.max(
    0,
    applied -
      screening -
      shortlisted -
      interview -
      selected -
      rejected -
      withdrawn,
  );

  return [
    { status: "Applied", value: appliedStageOnly, color: "#2547f4" },
    { status: "Screening", value: screening, color: "#7dd3fc" },
    { status: "Shortlisted", value: shortlisted, color: "#22c55e" },
    { status: "Interview scheduled", value: interview, color: "#f97316" },
    { status: "Selected", value: selected, color: "#a855f7" },
    { status: "Rejected", value: rejected, color: "#ef4444" },
    { status: "Withdrawn", value: withdrawn, color: "#94a3b8" },
  ];
}
