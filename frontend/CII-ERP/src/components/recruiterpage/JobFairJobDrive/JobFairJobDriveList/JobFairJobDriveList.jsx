import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '../../shared/StatCard/StatCard';
import Pagination from '../../shared/Pagination/Pagination';
import EventFilterBar from '../EventFilterBar/EventFilterBar';
import EventTable from '../EventTable/EventTable';
import { placementStatCards } from '../../data';
import './JobFairJobDriveList.css';

const EMPTY_FILTERS = { search: '', type: 'All', status: 'All status' };
const PAGE_SIZE = 5;

/**
 * JobFairJobDriveList
 *
 * The default Job Fair / Job Drive view: page header + "+ Add
 * Events" button, the 4 stat cards, EventFilterBar, the events
 * table, and pagination. Filtering here is live (every change in
 * EventFilterBar re-filters immediately) - unlike Job Management's
 * "apply on click" pattern, this design has no Apply button.
 */
const JobFairJobDriveList = ({ events, onAddEvent, onViewEvent, onEditEvent, onDeleteEvent }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        !filters.search || event.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'All' || event.type === filters.type;
      const matchesStatus = filters.status === 'All status' || event.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEvents.slice(start, start + PAGE_SIZE);
  }, [filteredEvents, currentPage]);

  return (
    <div className="job-fair-job-drive">
      <header className="job-fair-job-drive__header">
        <div>
          <h1 className="job-fair-job-drive__title">Job Fair / Job Drive</h1>
          <p className="job-fair-job-drive__subtitle">Create and manage every job fair &amp; job drive on the platform</p>
        </div>

        <button type="button" className="job-fair-job-drive__add-btn" onClick={onAddEvent}>
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

      <EventTable
        events={paginatedEvents}
        onViewEvent={onViewEvent}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredEvents.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default JobFairJobDriveList;
