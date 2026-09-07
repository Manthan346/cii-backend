import React, { useCallback, useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import Button from "../../../shared/Button/Button";
import CoursesFilterBar from "../CoursesFilterBar/CoursesFilterBar";
import CoursesTable from "../CoursesTable/CoursesTable";
import {
  fetchAdminCourses,
  fetchAdminCourseCompanyOptions,
} from "../../../../../../api/admin/coursesService";
import "./CourseManagement.css";

// Matches the course_mode values getCourses actually filters on.

const COURSE_MODE_OPTIONS = [
  { value: "all", label: "All modes" },
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid", label: "Hybrid" },
];

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalResults: 0,
};

// getCourses' select doesn't include course_desc, even though the API docs
// mention it — every row will show "—" for Description until the backend
// adds that field to its query.
const normalizeCourse = (course) => ({
  id: course.course_id,
  name: course.course_name,
  description: course.course_desc,
  duration: course.course_duration,
  mode: course.course_mode,
  companyName: course.company_name,
});

/**
 * CourseManagement (Admin)
 *
 * "Manage course catalog, batches and trainers" page: filter bar +
 * paginated courses table, backed by GET /admin/courses.
 */
const CourseManagement = () => {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [company, setCompany] = useState("all");
  const [page, setPage] = useState(1);

  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyOptions, setCompanyOptions] = useState([
    { value: "all", label: "All Companies" },
  ]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchAdminCourses({
        page,
        limit: 10,
        search,
        companyId: company,
        courseMode: mode,
      });

      setCourses((data.courses ?? []).map(normalizeCourse));
      setPagination({
        currentPage: Number(data.page ?? page),
        totalPages: Number(data.totalPages ?? 1),
        pageSize: Number(data.limit ?? 10),
        totalResults: Number(data.total ?? 0),
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to load courses right now.",
      );
      setCourses([]);
      setPagination(DEFAULT_PAGINATION);
    } finally {
      setLoading(false);
    }
  }, [page, search, company, mode]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    let cancelled = false;

    fetchAdminCourseCompanyOptions()
      .then((options) => {
        if (!cancelled) setCompanyOptions(options);
      })
      .catch(() => {
        // fall back to whatever's already in state (just 'All Companies')
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handleExport = () => {
    // TODO: GET /api/admin/courses/export?format=csv
    console.log("export courses");
  };

  return (
    <div className="admin-course-management">
      <div className="admin-course-management__heading">
        <div>
          <h1 className="admin-course-management__title">Course management</h1>
          <p className="admin-course-management__subtitle">
            Manage course catalog, batches and trainers
          </p>
        </div>
        <Button icon={FileDown} onClick={handleExport}>
          Export As
        </Button>
      </div>

      <CoursesFilterBar
        search={search}
        onSearchChange={setSearch}
        mode={mode}
        onModeChange={setMode}
        company={company}
        onCompanyChange={setCompany}
        modeOptions={COURSE_MODE_OPTIONS}
        companyOptions={companyOptions}
        onApply={handleApplyFilters}
      />

      {error && <div className="admin-course-management__error">{error}</div>}

      <CoursesTable
        courses={courses}
        pagination={{ ...pagination, currentPage: page }}
        onPageChange={setPage}
        onEditCourse={(id) => console.log("edit course", id)}
        onDeleteCourse={(id) => console.log("delete course", id)}
      />

      {loading && (
        <div className="admin-course-management__loading">
          Loading courses...
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
