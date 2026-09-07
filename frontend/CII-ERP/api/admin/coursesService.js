import API from "../api";

export async function fetchAdminCourses({
  page = 1,
  limit = 10,
  search = "",
  companyId = "all",
  courseMode = "all",
} = {}) {
  const params = { page, limit };

  if (search?.trim()) params.search = search.trim();
  if (companyId && companyId !== "all") params.company_id = companyId;
  if (courseMode && courseMode !== "all") params.course_mode = courseMode;

  const response = await API.get("/admin/courses", { params });

  return (
    response?.data?.data ?? {
      courses: [],
      total: 0,
      page,
      limit,
      totalPages: 1,
    }
  );
}

export async function fetchAdminCourseCompanyOptions() {
  const data = await fetchAdminCourses({ page: 1, limit: 100 });
  const courses = data.courses ?? [];

  const seen = new Map();
  courses.forEach((course) => {
    if (
      course.company_id &&
      course.company_name &&
      !seen.has(course.company_id)
    ) {
      seen.set(course.company_id, course.company_name);
    }
  });

  const companies = Array.from(seen, ([value, label]) => ({ value, label }));
  companies.sort((a, b) => a.label.localeCompare(b.label));

  return [{ value: "all", label: "All Companies" }, ...companies];
}

export async function fetchAdminCourseFilterOptions() {
  const data = await fetchAdminCourses({ page: 1, limit: 100 });
  const courses = data.courses ?? [];

  const options = courses.map((course) => ({
    value: course.course_id,
    label: course.course_name,
  }));

  return [{ value: "all", label: "All Courses" }, ...options];
}
