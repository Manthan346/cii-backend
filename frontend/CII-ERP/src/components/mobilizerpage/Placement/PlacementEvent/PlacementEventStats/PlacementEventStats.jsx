import React from 'react';
import { FileText, FileEdit, BadgeCheck, Users } from 'lucide-react';
import { placementEventStats } from '../../../data/placementEventData';
import './PlacementEventStats.css';

const ICON_MAP = { FileText, FileEdit, BadgeCheck, Users };

export default function PlacementEventStats() {
  return (
    <div className="pe-stats">
      {placementEventStats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div className="pe-stat-card" key={stat.id}>
            <Icon size={20} className={`pe-stat-card__icon pe-stat-card__icon--${stat.iconTone}`} />
            <span className="pe-stat-card__value">{stat.value.toLocaleString()}</span>
            <span className={`pe-stat-card__label pe-stat-card__label--${stat.labelTone}`}>{stat.label}</span>
            <span className="pe-stat-card__sublabel">{stat.sublabel}</span>
          </div>
        );
      })}
    </div>
  );
}
