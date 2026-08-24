import React from 'react';
import { FileText, FileEdit, MessageSquare, BadgeCheck } from 'lucide-react';
import { eventStats } from '../../data/eventData';
import './EventStats.css';

const ICON_MAP = { FileText, FileEdit, MessageSquare, BadgeCheck };

export default function EventStats() {
  return (
    <div className="ev-stats">
      {eventStats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div className="ev-stat-card" key={stat.id}>
            <Icon size={20} className={`ev-stat-card__icon ev-stat-card__icon--${stat.iconTone}`} />
            <span className="ev-stat-card__value">{stat.value}</span>
            <span className="ev-stat-card__label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
