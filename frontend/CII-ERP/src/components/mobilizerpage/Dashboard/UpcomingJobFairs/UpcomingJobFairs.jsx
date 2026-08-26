import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import StatusPill from '../../shared/StatusPill/StatusPill';
import { upcomingJobFairs } from '../../data/dashboardData';
import './UpcomingJobFairs.css';

export default function UpcomingJobFairs() {
  return (
    <SectionCard
      title="Upcoming Job Fairs"
      headerAction={
        <button type="button" className="md-view-all">
          View all
        </button>
      }
    >
      <ul className="md-list">
        {upcomingJobFairs.map((fair) => (
          <li className="md-list__row" key={fair.id}>
            <div className="md-list__main">
              <p className="md-list__title">{fair.title}</p>
              <p className="md-list__subtitle">
                {fair.date} · {fair.location}
              </p>
            </div>
            <StatusPill status={fair.status} tone={fair.status === 'Today' ? 'amber' : 'blue'} />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
