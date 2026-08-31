import React, { useEffect, useState } from "react";
import JobManagementList from "./JobManagementList/JobManagementList";
import CreateJobForm from "./CreateJobForm/CreateJobForm";
import JobDetails from "./JobDetails/JobDetails";
import {
  fetchRecruiterJobPostings,
  fetchRecruiterJobPostingDetails,
  normalizeJobPosting,
  mapFormToRecruiterJobPayload,
  createRecruiterJobPosting,
  updateRecruiterJobPosting,
} from "../../../../api/recruiter/jobManagementService";

/**
 * JobManagement (Recruiter)
 *
 * Owns the jobs list and switches between three views entirely on
 * the client, without extra routes:
 *   - 'list'    -> JobManagementList (filter bar + table + Create Job button)
 *   - 'create'  -> CreateJobForm (opened by the Create Job button, or by
 *                  "Edit" on a row - editing just reopens the same form)
 *   - 'details' -> JobDetails (opened by "View" in a row's action menu)
 *
 * "Close job" is handled right from the row menu without leaving the
 * list - it just flips that job's status to Closed in state.
 */
const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'create' | 'details'
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        setError("");
        const { jobs: liveJobs } = await fetchRecruiterJobPostings({
          page: 1,
          limit: 50,
        });
        setJobs(liveJobs);
      } catch (loadErr) {
        console.error("Failed to load job postings:", loadErr);
        setError(
          loadErr?.response?.data?.message ||
            "Unable to load job postings right now.",
        );
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  const selectedJobFromList =
    jobs.find((job) => job.id === selectedJobId) ?? null;
  const activeSelectedJob = selectedJob ?? selectedJobFromList ?? null;

  const goToList = () => {
    setSelectedJob(null);
    setSelectedJobId(null);
    setView("list");
  };

  const handleViewJob = async (jobId) => {
    try {
      setSelectedJobId(jobId);
      setError("");
      const detail = await fetchRecruiterJobPostingDetails(jobId);
      setSelectedJob(detail);
      setJobs((prev) => {
        const exists = prev.some((job) => job.id === detail.id);
        if (!exists) return [detail, ...prev];

        return prev.map((job) =>
          job.id === detail.id ? { ...job, ...detail } : job,
        );
      });
      setView("details");
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      setError(err?.response?.data?.message || "Unable to load job details.");
    }
  };

  const handleEditJob = async (jobId) => {
    try {
      setSelectedJobId(jobId);
      setError("");
      const detail = await fetchRecruiterJobPostingDetails(jobId);
      setSelectedJob(detail);
      setJobs((prev) =>
        prev.some((job) => job.id === detail.id)
          ? prev.map((job) =>
              job.id === detail.id ? { ...job, ...detail } : job,
            )
          : [detail, ...prev],
      );
      setView("create");
    } catch (err) {
      console.error("Failed to load job for edit:", err);
      setError(
        err?.response?.data?.message ||
          "Unable to load job details for editing.",
      );
    }
  };

  const handleCloseJobStatus = async (jobId) => {
    const target = jobs.find((job) => job.id === jobId);
    if (!target) return;

    try {
      setError("");
      const updated = await updateRecruiterJobPosting(jobId, {
        is_active: false,
      });

      const closedJob = normalizeJobPosting({
        ...target,
        ...updated,
        is_active: false,
        status: "Closed",
      });

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? closedJob : job,
        ),
      );
      setSelectedJob((current) =>
        current?.id === jobId
          ? { ...current, is_active: false, status: "Closed" }
          : current,
      );
    } catch (err) {
      console.error("Failed to close job:", err);
      setError(
        err?.response?.data?.message || "Unable to close this job posting.",
      );
    }
  };

  const handleCreateJob = async (jobPayload, isEditMode = false) => {
    try {
      if (isEditMode && selectedJobId) {
        const updated = await updateRecruiterJobPosting(
          selectedJobId,
          jobPayload,
        );
        setJobs((prev) =>
          prev.map((job) =>
            job.id === selectedJobId
              ? normalizeJobPosting({ ...job, ...updated })
              : job,
          ),
        );
        setSelectedJob(null);
        setSelectedJobId(null);
        goToList();
        return;
      }

      const created = await createRecruiterJobPosting(jobPayload);
      setJobs((prev) => [normalizeJobPosting(created), ...prev]);
      goToList();
    } catch (err) {
      console.error("Failed to create/update job:", err);
      setError(
        err?.response?.data?.message ||
          (isEditMode
            ? "Unable to update job posting."
            : "Unable to create job posting."),
      );
    }
  };

  if (view === "create") {
    return (
      <CreateJobForm
        onCancel={goToList}
        onSubmit={handleCreateJob}
        initialValues={selectedJob ?? selectedJobFromList ?? null}
        isEdit={Boolean(selectedJobId && (selectedJob || selectedJobFromList))}
      />
    );
  }

  if (view === "details" && activeSelectedJob) {
    return (
      <JobDetails
        job={activeSelectedJob}
        onBack={goToList}
        onEdit={() => handleEditJob(activeSelectedJob.id)}
        onCloseJob={goToList}
        error={error}
      />
    );
  }

  return (
    <JobManagementList
      jobs={jobs}
      onCreateJob={() => setView("create")}
      onViewJob={handleViewJob}
      onEditJob={handleEditJob}
      onCloseJob={handleCloseJobStatus}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default JobManagement;
