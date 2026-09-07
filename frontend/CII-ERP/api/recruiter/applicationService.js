import API from "../api.js";

const STATUS_LABELS = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  SHORTLISTED: "Shortlisted",
  INTERVIEW: "Interview",
  SELECTED: "Selected",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STATUS_LABEL_TO_ENUM = {
  Screening: "SCREENING",
  Shortlisted: "SHORTLISTED",
  Interview: "INTERVIEW",
  Selected: "SELECTED",
  Rejected: "REJECTED",
  Withdrawn: "WITHDRAWN",
  // "Applied" intentionally excluded — not a valid value to PATCH to,
  // per the endpoint's accepted list (it's only ever a starting state).
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
  const normalized = String(value ?? "APPLIED")
    .trim()
    .toUpperCase();
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
    phone: application.contact_no ?? "-",
    appliedDate: formatDisplayDate(application.applied_date),
    appliedDateISO: application.applied_date?.slice(0, 10) ?? "",
    resumeUrl: application.resume ?? "",
    source: application.source ?? "-",
    status: formatStatus(application.application_status),
    email: application.email ?? "-",
    location: "-",
    dob: "-",
    degree: "-",
    college: "-",
    graduationYear: "-",
    percentage: "-",
    certificates: [],
    coursesCompleted: [],
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

/**
 * Updates a single application's status.
 * @param {string} applicationId
 * @param {string} statusLabel - UI label e.g. "Shortlisted"
 */
export async function updateApplicationStatus(applicationId, statusLabel) {
  const enumStatus = STATUS_LABEL_TO_ENUM[statusLabel];
  if (!enumStatus) {
    throw new Error(`"${statusLabel}" is not a settable status.`);
  }

  const res = await API.patch(`/hr/applications/${applicationId}/status`, {
    application_status: enumStatus,
  });
  return res.data?.data;
}

export const applicationStatusOptions = Object.keys(STATUS_LABEL_TO_ENUM);
// -> ["Screening", "Shortlisted", "Interview", "Selected", "Rejected", "Withdrawn"]
