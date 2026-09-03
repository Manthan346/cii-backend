import React, { useCallback, useEffect, useState } from "react";
import ApplicationsList from "./ApplicationsList/ApplicationsList";
import CandidateProfile from "./CandidateProfile/CandidateProfile";
import {
  fetchRecruiterApplications,
  updateApplicationStatus,
} from "../../../../api/recruiter/applicationService";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const { applications: records, pagination: pageData } =
        await fetchRecruiterApplications({
          page: currentPage,
          limit: 10,
          search: filters.search || undefined,
          company_name: filters.company || undefined,
          job_role: filters.role || undefined,
          from_date: filters.from || undefined,
          to_date: filters.to || undefined,
        });
      setApplications(records);
      setPagination(pageData);
    } catch (loadError) {
      console.error("Failed to load applications:", loadError);
      setApplications([]);
      setPagination({});
      setError(
        loadError?.response?.data?.message ||
          "Unable to load applications right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const selectedCandidate =
    applications.find((item) => item.id === selectedId) ?? null;

  const handleUpdateStatus = async (nextStatus) => {
    // Used by CandidateProfile (Shortlist / Reject / Schedule Interview buttons)
    await handleStatusChange(selectedId, nextStatus);
  };

  const handleStatusChange = async (candidateId, nextStatus) => {
    setStatusError("");
    try {
      await updateApplicationStatus(candidateId, nextStatus);
      setApplications((prev) =>
        prev.map((item) =>
          item.id === candidateId ? { ...item, status: nextStatus } : item,
        ),
      );
    } catch (err) {
      console.error("Failed to update application status:", err);
      setStatusError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update status.",
      );
    }
  };

  if (selectedCandidate) {
    return (
      <CandidateProfile
        candidate={selectedCandidate}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <>
      {statusError && (
        <div className="applications-list__error" role="alert">
          {statusError}
        </div>
      )}
      <ApplicationsList
        applications={applications}
        currentPage={currentPage}
        totalItems={pagination.totalItems ?? 0}
        pageSize={pagination.limit ?? 10}
        isLoading={isLoading}
        error={error}
        onViewProfile={setSelectedId}
        onStatusChange={handleStatusChange}
        onPageChange={setCurrentPage}
        onApplyFilters={(nextFilters) => {
          setCurrentPage(1);
          setFilters(nextFilters);
        }}
      />
    </>
  );
};

export default Applications;
