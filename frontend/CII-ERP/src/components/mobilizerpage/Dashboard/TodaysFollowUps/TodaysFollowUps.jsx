import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import StatusPill from '../../shared/StatusPill/StatusPill';
import InitialsAvatar from '../../shared/InitialsAvatar/InitialsAvatar';
import { todaysFollowUps } from '../../data/dashboardData';
import './TodaysFollowUps.css';

export default function TodaysFollowUps() {
  return (
    <SectionCard
      title="Today's Follow-ups"
      headerAction={
        <button type="button" className="md-view-all">
          View all
        </button>
      }
    >
      <ul className="md-followup-list">
        {todaysFollowUps.map((person) => (
          <li className="md-followup-row" key={person.id}>
            <InitialsAvatar name={person.name} tone={person.avatarTone} />
            <div className="md-followup-row__main">
              <p className="md-followup-row__name">{person.name}</p>
              <p className="md-followup-row__course">{person.course}</p>
            </div>
            <StatusPill status={person.status} />
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
