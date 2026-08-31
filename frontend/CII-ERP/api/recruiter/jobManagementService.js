import API from "../api.js";

const normalizeMode = (mode) => {
  const normalized = String(mode ?? "")
    .trim()
    .toLowerCase();

  if (!normalized) return "Hybrid";
  if (["online", "remote"].includes(normalized)) return "Remote";
  if (["offline", "onsite", "on-site", "on site"].includes(normalized))
    return "On-Site";
  if (["hybrid"].includes(normalized)) return "Hybrid";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

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

export function normalizeJobPosting(job = {}) {
  const companyName = job.company_name ?? job.companyName ?? "Company";
  const jobRole = job.job_role ?? job.jobRole ?? "Untitled Role";
  const sector = job.sector ?? job.department ?? "General";
  const location = job.location ?? "Remote";
  const isActive =
    typeof job.is_active === "boolean"
      ? job.is_active
      : job.status !== "Closed";
  const employmentType =
    job.employment_type ?? job.employmentType ?? "Full-time";

  return {
    ...job,
    id: job.placement_id ?? job.id ?? `${job.job_role ?? "job"}-${Date.now()}`,
    jobRole,
    sector,
    companyName,
    location,
    type: employmentType,
    mode: normalizeMode(job.work_mode ?? job.mode),
    vacancy: Number(job.vacancy ?? 0),
    applications: Number(job.applications ?? 0),
    status: isActive ? "Published" : "Closed",
    postedDate: formatDisplayDate(job.created_at ?? job.postedDate),
    deadline: formatDisplayDate(job.last_date_to_apply ?? job.deadline),
    department: sector,
    role: job.role ?? job.job_role ?? jobRole,
    employmentType,
    experience: job.experience ?? "",
    salary: job.salary ?? "",
    description: job.job_description ?? job.description ?? "",
    eligibility: {
      qualification: job.eligible_qualification ?? job.qualification ?? "",
      minPercentage: job.eligible_percentage_cgpa ?? job.minPercentage ?? "",
    },
    stats: {
      totalApplications: Number(job.total_applications ?? 0),
      shortlisted: Number(job.shortlisted ?? 0),
      interviewed: Number(job.interviewed ?? 0),
      hired: Number(job.hired ?? 0),
    },
    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    preferredSkills: Array.isArray(job.preferredSkills)
      ? job.preferredSkills
      : [],
    responsibilities: Array.isArray(job.responsibilities)
      ? job.responsibilities
      : [],
  };
}

export async function fetchRecruiterJobPostings(params = {}) {
  const query = {
    page: 1,
    limit: 100,
    ...params,
  };

  const response = await API.get("/hr/job-management", { params: query });
  const payload = response.data?.data ?? {};
  const jobs = Array.isArray(payload.jobPostings) ? payload.jobPostings : [];

  return {
    jobs: jobs.map(normalizeJobPosting),
    pagination: payload.pagination ?? {},
  };
}

export async function fetchRecruiterJobPostingDetails(placementId) {
  const response = await API.get(`/hr/job-management/${placementId}/view`);
  const payload = response.data?.data ?? {};
  const jobDetails = payload.jobDetails ?? {};
  const applicationSummary = payload.applicationSummary ?? {};

  const normalized = normalizeJobPosting(jobDetails);

  return {
    ...normalized,
    id: jobDetails.placement_id ?? normalized.id,
    companyName: jobDetails.company_name ?? normalized.companyName,
    department: jobDetails.sector ?? normalized.department,
    role: jobDetails.job_role ?? normalized.role,
    employmentType: jobDetails.employment_type ?? normalized.employmentType,
    mode: normalizeMode(jobDetails.work_mode ?? normalized.mode),
    description: jobDetails.job_description ?? normalized.description,
    deadline: formatDisplayDate(
      jobDetails.last_date_to_apply ?? normalized.deadline,
    ),
    eligibility: {
      qualification:
        jobDetails.eligible_qualification ??
        normalized.eligibility?.qualification ??
        "",
      minPercentage:
        jobDetails.eligible_percentage_cgpa ??
        normalized.eligibility?.minPercentage ??
        "",
    },
    stats: {
      totalApplications: Number(applicationSummary.totalApplications ?? 0),
      shortlisted: Number(applicationSummary.shortlisted ?? 0),
      interviewed: Number(applicationSummary.interview ?? 0),
      hired: Number(applicationSummary.selected ?? 0),
    },
  };
}

export async function createRecruiterJobPosting(payload) {
  const response = await API.post("/hr/job-management/create-job", payload);
  const placement = response.data?.data?.placement ?? response.data?.data ?? {};
  return normalizeJobPosting(placement);
}

export async function updateRecruiterJobPosting(placementId, payload) {
  const response = await API.patch(
    `/hr/job-management/${placementId}`,
    payload,
  );
  const updated = response.data?.data ?? {};
  return normalizeJobPosting(updated);
}

export function mapFormToRecruiterJobPayload(form = {}) {
  const companyName = form.companyName || form.company_name || "Company";
  const jobRole = form.jobRole || form.job_role || "Role";
  const department = form.department || form.sector || "General";
  const city = form.location || form.city || "";
  const workMode = form.mode || form.workMode || "hybrid";

  return {
    company_name: companyName,
    sector: department,
    vacancy: Number(form.vacancy ?? form.vacancies ?? 0),
    location: city,
    job_role: jobRole,
    job_description: form.description ?? form.job_description ?? "",
    salary: form.salary ?? form.salaryAmount ?? "",
    employment_type: form.employmentType ?? form.type ?? "Full-time",
    work_mode: String(workMode).trim().toLowerCase().replace(/\s+/g, "-"),
    eligible_qualification:
      form.eligibility?.qualification ?? form.qualification ?? "",
    eligible_percentage_cgpa:
      form.eligibility?.minPercentage ?? form.minPercentage ?? "",
    application_link: form.applicationLink ?? form.application_link ?? "",
    last_date_to_apply: form.deadline || form.last_date_to_apply || "",
    experience: form.experience ?? "",
  };
}
