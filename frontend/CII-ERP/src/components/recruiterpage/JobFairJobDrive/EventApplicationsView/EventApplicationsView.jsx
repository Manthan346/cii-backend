import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Map,
  UserRoundPlus,
  BadgeCheck,
  ClipboardList,
  Laptop,
  CheckSquare,
} from 'lucide-react';
import StatCard from '../../shared/StatCard/StatCard';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import Pagination from '../../shared/Pagination/Pagination';
import ApplicationsFilterBar from './ApplicationsFilterBar/ApplicationsFilterBar';
import ApplicationsTable from './ApplicationsTable/ApplicationsTable';
import CandidateDetailsModal from './CandidateDetailsModal/CandidateDetailsModal';
import {
  eventApplications as allApplications,
  eventTypeStyles,
} from '../../data';
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
  const [applications, setApplications] = useState(() =>
    allApplications.filter((application) => application.eventId === event.id)
  );
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileCandidateId, setProfileCandidateId] = useState(null);

  const profileCandidate = applications.find((item) => item.id === profileCandidateId) ?? null;
  const stats = event.applicationStats ?? {};

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

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

  const handleRemove = (candidateId) => {
    setApplications((prev) => prev.filter((item) => item.id !== candidateId));
  };

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

      <div className="event-applications-view__stats">
        <StatCard icon={UserRoundPlus} iconBg="#c026d3" value={stats.registered ?? 0} label="Registered" />
        <StatCard icon={BadgeCheck} iconBg="#f97316" value={stats.attended ?? 0} label="Attended" />
        <StatCard icon={ClipboardList} iconBg="#14b8a6" value={stats.shortlisted ?? 0} label="Shortlisted" />
        <StatCard icon={Laptop} iconBg="#3b82f6" value={stats.interviewed ?? 0} label="Interviewed" />
        <StatCard icon={CheckSquare} iconBg="#2563eb" value={stats.selected ?? 0} label="Selected" />
      </div>

      <ApplicationsFilterBar filters={filters} onChange={setFilters} />

      <ApplicationsTable
        applications={paginatedApplications}
        onViewProfile={setProfileCandidateId}
        onRemove={handleRemove}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredApplications.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      <CandidateDetailsModal
        candidate={profileCandidate}
        isOpen={Boolean(profileCandidate)}
        onClose={() => setProfileCandidateId(null)}
      />
    </div>
  );
};

export default EventApplicationsView;
