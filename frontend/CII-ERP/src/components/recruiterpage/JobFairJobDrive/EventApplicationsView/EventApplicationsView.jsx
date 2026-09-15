import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Map,
} from 'lucide-react';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import Pagination from '../../shared/Pagination/Pagination';
import ApplicationsFilterBar from './ApplicationsFilterBar/ApplicationsFilterBar';
import ApplicationsTable from './ApplicationsTable/ApplicationsTable';
import {
  eventTypeStyles,
} from '../../data';
import { fetchJobEventCandidates } from '../../../../../api/recruiter/jobEventService';
import './EventApplicationsView.css';

const EMPTY_FILTERS = { search: '', status: 'All Status', source: 'All Sources' };
const PAGE_SIZE = 6;

/**
 * EventApplicationsView
 *
 * Full page shown when "View" is clicked on an event row (Job Fair or
 * Job Drive alike - it's the same component either way, driven by
 * `event.type`). Shows the event's header info, 5 application-funnel
 * stat cards, a filter bar, the candidates table, and pagination.
 *
 * "Preview"/resume-preview has been removed from the candidates table
 * entirely per request. "View Profile" (row's action menu) is the
 * only remaining candidate-level action - opens CandidateDetailsModal,
 * a read-only popup with contact info/status.
 *
 * NOTE: "Import" used to live here but per request now lives on
 * JobFairJobDriveList (the main list page) instead - see
 * JobFairJobDrive.jsx / JobFairJobDriveList.jsx.
 *
 * Owns its own copy of that event's applications in state so Remove
 * can drop a row immediately - same local-state pattern used
 * everywhere else in this app (no shared store yet).
 */
const EventApplicationsView = ({ event, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalRecords: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetchJobEventCandidates(event.id, { page: currentPage, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setApplications(response.candidates);
        setPagination(response.pagination);
      })
      .catch((requestError) => {
        if (cancelled) return;
        setApplications([]);
        setPagination((previous) => ({ ...previous, totalRecords: 0, totalPages: 0 }));
        setError(
          requestError?.response?.data?.message ||
            requestError.message ||
            'Unable to load candidates.',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [event.id, currentPage]);

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const matchesSearch = !filters.search || item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'All Status' || item.status === filters.status;
      const matchesSource = filters.source === 'All Sources' || item.source === filters.source;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [applications, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="event-applications-view">
      <button type="button" className="event-applications-view__back" onClick={onBack}>
        ← Back to {event.type === 'Job Drive' ? 'Job Drives' : 'Job Fairs'}
      </button>

      <div className="event-applications-view__header">
        <StatusBadge label={event.type} {...(eventTypeStyles[event.type] ?? {})} />

        <h1 className="event-applications-view__title">{event.name}</h1>

        <div className="event-applications-view__meta">
          <span className="event-applications-view__meta-item">
            <Calendar size={15} className="event-applications-view__meta-icon" />
            {event.date}
          </span>
          <span className="event-applications-view__meta-item">
            <Clock size={15} className="event-applications-view__meta-icon" />
            {event.endTime ? `${event.time} - ${event.endTime}` : event.time}
          </span>
          <span className="event-applications-view__meta-item">
            <MapPin size={15} className="event-applications-view__meta-icon" />
            {event.venue}
          </span>
          {event.mapsLink && (
            <a
              href={event.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="event-applications-view__meta-item event-applications-view__maps-link"
            >
              <Map size={15} className="event-applications-view__meta-icon" />
              Open in Google Maps
            </a>
          )}
        </div>
      </div>

      <ApplicationsFilterBar filters={filters} onChange={setFilters} />

      {error && <div className="event-applications-view__error" role="alert">{error}</div>}

      <ApplicationsTable
        applications={loading ? [] : filteredApplications}
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

export default EventApplicationsView;
