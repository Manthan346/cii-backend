import API from "../api.js";

function formatSalary(min, max) {
  if (min == null && max == null) return "Not specified";

  const toLpa = (amount) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return amount;
    return value >= 100000 ? value / 100000 : value;
  };

  if (min == null) return `${toLpa(max)} LPA`;
  if (max == null) return `${toLpa(min)} LPA`;
  return `${toLpa(min)}-${toLpa(max)} LPA`;
}

export function mapPublicJob(job) {
  return {
    id: job.placement_id,
    title: job.job_role,
    company: job.company_name,
    vacancy: job.vacancy,
    location: job.location,
    description: job.job_description,
    deadline: job.last_date_to_apply,
    workMode: job.work_mode,
    qualification: job.eligible_qualification,
    percentageCgpa: job.eligible_percentage_cgpa,
    salary: formatSalary(job.salary_min, job.salary_max),
    employmentType: job.employment_type,
    sector: job.sector,
    experience: job.experience,
    createdAt: job.created_at,
  };
}

export async function getPublicJobPostings(params = {}) {
  const response = await API.get("/job-portal", { params });
  const data = response.data?.data ?? {};

  return {
    jobs: (data.jobPostings ?? []).map(mapPublicJob),
    pagination: data.pagination ?? {},
  };
}

export async function submitJobApplication(placementId, application) {
  const response = await API.post(
    `/job-portal/${placementId}/apply`,
    application,
  );
  return response.data;
}

export default getPublicJobPostings;
