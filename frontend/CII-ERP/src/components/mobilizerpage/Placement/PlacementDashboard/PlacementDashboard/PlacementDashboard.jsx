import React, { useMemo, useState } from 'react';
import PlacementFilterBar from '../PlacementFilterBar/PlacementFilterBar';
import JobFairCard from '../JobFairCard/JobFairCard';
import JobFairDetailModal from '../JobFairDetailModal/JobFairDetailModal';
import CandidateStatusChart from '../CandidateStatusChart/CandidateStatusChart';
import QualificationChart from '../QualificationChart/QualificationChart';
import RecruiterOutcomeChart from '../RecruiterOutcomeChart/RecruiterOutcomeChart';
import { jobFairEvents } from '../../../data/placementDashboardData';
import './PlacementDashboard.css';

const PREVIEW_COUNT = 6;

export default function PlacementDashboard() {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [activeEventId, setActiveEventId] = useState(null);

  const filteredEvents = useMemo(() => {
    let list = jobFairEvents;

    if (statusFilter !== 'all') {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((e) => e.location.toLowerCase().includes(q) || e.date.toLowerCase().includes(q));
    }
    // dateFilter isn't cross-checked against event dates here since event
    // dates are display strings ("01 Jun 2026") rather than ISO values —
    // wire this up once real event data has a proper date field to compare.

    return list;
  }, [statusFilter, searchQuery]);

  const visibleEvents = expanded ? filteredEvents : filteredEvents.slice(0, PREVIEW_COUNT);
  const activeEvent = jobFairEvents.find((e) => e.id === activeEventId) || null;

  return (
    <div className="placement-dashboard">
      <h1 className="pd-title">Placement Workspace Dashboard</h1>

      {expanded ? (
        <button type="button" className="pd-back-btn" onClick={() => setExpanded(false)}>
          &lsaquo; BACK
        </button>
      ) : (
        <PlacementFilterBar
          onSearch={setSearchQuery}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
          onApply={() => console.log('Apply filter', { searchQuery, statusFilter, dateFilter })}
        />
      )}

      <div className="pd-events-grid">
        {visibleEvents.map((event) => (
          <JobFairCard key={event.id} event={event} onView={(e) => setActiveEventId(e.id)} />
        ))}
      </div>

      {!expanded && filteredEvents.length > PREVIEW_COUNT && (
        <button type="button" className="pd-see-more" onClick={() => setExpanded(true)}>
          See more&gt;&gt;
        </button>
      )}

      {!expanded && (
        <>
          <div className="pd-row">
            <CandidateStatusChart />
            <QualificationChart />
          </div>
          <div className="pd-row">
            <RecruiterOutcomeChart />
          </div>
        </>
      )}

      <JobFairDetailModal event={activeEvent} onClose={() => setActiveEventId(null)} />
    </div>
  );
}
