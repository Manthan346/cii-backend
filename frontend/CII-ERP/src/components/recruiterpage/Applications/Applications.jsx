import React, { useCallback, useEffect, useMemo, useState } from "react";
import ApplicationsList from "./ApplicationsList/ApplicationsList";
import CandidateProfile from "./CandidateProfile/CandidateProfile";
import {
  fetchRecruiterApplications,
  updateApplicationStatus,
} from "../../../../api/recruiter/applicationService";

const PAGE_SIZE = 15;

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusError, setStatusError] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const dateFilters = {
        limit: PAGE_SIZE,
        from_date: filters.from || undefined,
        to_date: filters.to || undefined,
      };
      const firstPage = await fetchRecruiterApplications({
        ...dateFilters,
        page: 1,
      });
      const totalPages = Math.max(
        1,
        Number(firstPage.pagination.totalPages) || 1,
      );

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          fetchRecruiterApplications({
            ...dateFilters,
            page: index + 2,
          }),
        ),
      );
      const allApplications = [
        ...firstPage.applications,
        ...remainingPages.flatMap(({ applications: pageApplications }) =>
          pageApplications,
        ),
      ];

      setApplications(allApplications);
    } catch (loadError) {
      console.error("Failed to load applications:", loadError);
      setApplications([]);
      setError(
        loadError?.response?.data?.message ||
          "Unable to load applications right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters.from, filters.to]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();
    const status = filters.status?.trim().toUpperCase();

    return applications.filter((application) => {
      const matchesSearch =
        !search ||
        [application.name, application.company, application.jobRole]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus =
        !status ||
        application.status.toUpperCase().replace(/\s+/g, "_") === status;

      return matchesSearch && matchesStatus;
    });
  }, [applications, filters.search, filters.status]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

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
        applications={paginatedApplications}
        currentPage={currentPage}
        totalItems={filteredApplications.length}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        error={error}
        onViewProfile={setSelectedId}
        onStatusChange={handleStatusChange}
        onPageChange={setCurrentPage}
        onFilterChange={(nextFilters) => {
          setCurrentPage(1);
          setFilters(nextFilters);
        }}
      />
    </>
  );
};

export default Applications;
