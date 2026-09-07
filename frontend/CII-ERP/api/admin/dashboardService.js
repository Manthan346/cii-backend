import API from "../api";

export async function fetchCenterStats() {
  const response = await API.get("/admin/center/stats");

  return (
    response?.data?.data ?? {
      totalUsers: 0,
      totalInstructors: 0,
      totalCandidates: 0,
      newUsersThisMonth: 0,
    }
  );
}

export async function fetchCoursePerformance() {
  const response = await API.get("/admin/center/course-performance");

  return response?.data?.data?.course_performance ?? [];
}