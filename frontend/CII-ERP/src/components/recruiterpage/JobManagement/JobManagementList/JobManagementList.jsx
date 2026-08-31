import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import JobFilterBar from "../JobFilterBar/JobFilterBar";
import JobTable from "../JobTable/JobTable";
import Pagination from "../../shared/Pagination/Pagination";
import "./JobManagementList.css";

const EMPTY_FILTERS = {
  search: "",
  jobRole: "",
  sector: "",
  companyName: "",
  mode: "",
  location: "",
};

const PAGE_SIZE = 5;

/**
 * JobManagementList
 *
 * The default Job Management view: page header, JobFilterBar, the
 * jobs table, pagination, and the floating "Create Job" button.
 *
 * Filtering is "apply on click" - JobFilterBar keeps its own draft
 * input state and only calls back here (via onApplyFilter) once the
 * user hits "Apply Filter", which is when `appliedFilters` actually
 * updates and the table re-filters.
 *
 * Pagination is client-side over the filtered list via the shared
 * Pagination component - `currentPage` resets to 1 whenever the
 * filters change, so a new filter never leaves you stranded on a
 * page that no longer has any rows.
 */
const JobManagementList = ({
  jobs,
  onCreateJob,
  onViewJob,
  onEditJob,
  onCloseJob,
  isLoading = false,
  error = "",
}) => {
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = (job.jobRole ?? "").toLowerCase();
      const matchesSearch =
        !appliedFilters.search ||
        searchText.includes(appliedFilters.search.toLowerCase());
      const matchesJobRole =
        !appliedFilters.jobRole || job.jobRole === appliedFilters.jobRole;
      const matchesSector =
        !appliedFilters.sector || job.sector === appliedFilters.sector;
      const matchesCompany =
        !appliedFilters.companyName ||
        job.companyName === appliedFilters.companyName;
      const matchesMode =
        !appliedFilters.mode || job.mode === appliedFilters.mode;
      const matchesLocation =
        !appliedFilters.location || job.location === appliedFilters.location;

      return (
        matchesSearch &&
        matchesJobRole &&
        matchesSector &&
        matchesCompany &&
        matchesMode &&
        matchesLocation
      );
    });
  }, [jobs, appliedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  return (
    <div className="job-management">
      <header className="job-management__header">
        <h1 className="job-management__title">Job Management</h1>
        <p className="job-management__subtitle">
          Create and manage every job posting on the platform
        </p>
      </header>

      <JobFilterBar onApplyFilter={setAppliedFilters} />

      {error && <div className="job-management__error">{error}</div>}

      {!isLoading && !error && (
        <>
          <JobTable
            jobs={paginatedJobs}
            onViewJob={onViewJob}
            onEditJob={onEditJob}
            onCloseJob={onCloseJob}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={filteredJobs.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {isLoading && !error && (
        <div className="job-management__loading">Loading job postings...</div>
      )}

      <button
        type="button"
        className="job-management__create-btn"
        onClick={onCreateJob}
      >
        <Plus size={18} strokeWidth={2.4} />
        Create Job
      </button>
    </div>
  );
};

export default JobManagementList;
