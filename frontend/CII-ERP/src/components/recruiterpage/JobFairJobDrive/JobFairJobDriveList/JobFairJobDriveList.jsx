import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StatCard from "../../shared/StatCard/StatCard";
import Pagination from "../../shared/Pagination/Pagination";
import EventFilterBar from "../EventFilterBar/EventFilterBar";
import EventTable from "../EventTable/EventTable";
import { placementStatCards } from "../../data";
import { fetchJobEvents } from "../../../../../api/recruiter/jobEventService";
import "./JobFairJobDriveList.css";

const EMPTY_FILTERS = { search: "", type: "All", status: "All status" };
const PAGE_SIZE = 10;

/**
 * JobFairJobDriveList
 *
 * Fetches from GET /hr/job-event with server-side pagination and
 * filtering (search / type / status all passed as query params, not
 * filtered client-side anymore). Debounces search slightly isn't
 * done here — every filter change refetches immediately per the
 * original "no Apply button" design.
 */
const JobFairJobDriveList = ({
  onAddEvent,
  onImportEvent,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onStatusChange,
}) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchJobEvents({
      page: currentPage,
      limit: PAGE_SIZE,
      search: filters.search,
      type: filters.type,
      status: filters.status,
    })
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events);
        setPagination({
          totalRecords: data.pagination.totalRecords ?? 0,
          totalPages: data.pagination.totalPages ?? 1,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load job events:", err);
        setError(
          err?.response?.data?.message || "Unable to load events right now.",
        );
        setEvents([]);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [currentPage, filters]);

  return (
    <div className="job-fair-job-drive">
      <header className="job-fair-job-drive__header">
        <div>
          <h1 className="job-fair-job-drive__title">Job Fair / Job Drive</h1>
          <p className="job-fair-job-drive__subtitle">
            Create and manage every job fair &amp; job drive on the platform
          </p>
        </div>

        <button
          type="button"
          className="job-fair-job-drive__add-btn"
          onClick={onAddEvent}
        >
          <Plus size={18} strokeWidth={2.4} />
          Add Events
        </button>
      </header>

      <div className="job-fair-job-drive__stats">
        {placementStatCards.map((card) => (
          <StatCard
            key={card.id}
            icon={card.icon}
            iconBg={card.iconBg}
            value={card.value}
            label={card.label}
          />
        ))}
      </div>

      <EventFilterBar filters={filters} onChange={setFilters} />

      {error && <p className="job-fair-job-drive__error">{error}</p>}

      <EventTable
        events={loading ? [] : events}
        onViewEvent={onViewEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
        onImportEvent={onImportEvent}
        onStatusChange={onStatusChange}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={pagination.totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default JobFairJobDriveList;
