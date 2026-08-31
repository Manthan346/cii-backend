import API from "../api.js";

const STATUS_LABELS = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  REJECTED: "Rejected",
};

const AVATAR_COLORS = ["#7c3aed", "#0f766e", "#b45309", "#2563eb"];

const formatDisplayDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatStatus = (value) => {
  const normalized = String(value ?? "APPLIED").trim().toUpperCase();
  return STATUS_LABELS[normalized] ?? normalized.replace(/_/g, " ");
};

export function normalizeRecruiterApplication(application = {}, index = 0) {
  return {
    id: application.application_id ?? application.id,
    name: application.applicant_name ?? "Unknown candidate",
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    jobRole: application.placement?.job_role ?? "-",
    company: application.placement?.company_name ?? "-",
    contactNo: application.contact_no ?? "-",
    appliedDate: formatDisplayDate(application.applied_date),
    appliedDateISO: application.applied_date?.slice(0, 10) ?? "",
    resumeUrl: application.resume ?? "",
    source: application.source ?? "-",
    status: formatStatus(application.application_status),
    email: application.email ?? "-",
  };
}

export async function fetchRecruiterApplications(params = {}) {
  const response = await API.get("/hr/applications", {
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });

  const applications = Array.isArray(response.data?.data)
    ? response.data.data
    : [];

  return {
    applications: applications.map(normalizeRecruiterApplication),
    pagination: response.data?.pagination ?? {},
  };
}
