import React, { useCallback, useEffect, useState } from "react";
import ApplicationsList from './ApplicationsList/ApplicationsList';
import CandidateProfile from './CandidateProfile/CandidateProfile';
import { fetchRecruiterApplications } from "../../../../api/recruiter/applicationService";

/**
 * Applications (Recruiter)
 *
 * Owns the applications list and switches between two views entirely
 * on the client, same pattern as Job Management:
 *   - 'list'    -> ApplicationsList (filter bar + table + pagination)
 *   - 'profile' -> CandidateProfile (opened by a row's "View Profile")
 *
 * "Shortlist" / "Reject" / "Schedule Interview" on CandidateProfile
 * all just update that one candidate's `status` in place via
 * handleUpdateStatus - same local-state pattern used everywhere else
 * in this app (no backend yet).
 */
const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const selectedCandidate = applications.find((item) => item.id === selectedId) ?? null;

  const handleUpdateStatus = (nextStatus) => {
    setApplications((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, status: nextStatus } : item))
    );
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
    <ApplicationsList
      applications={applications}
      currentPage={currentPage}
      totalItems={pagination.totalItems ?? 0}
      pageSize={pagination.limit ?? 10}
      isLoading={isLoading}
      error={error}
      onViewProfile={setSelectedId}
      onPageChange={setCurrentPage}
      onApplyFilters={(nextFilters) => {
        setCurrentPage(1);
        setFilters(nextFilters);
      }}
    />
  );
};

export default Applications;
