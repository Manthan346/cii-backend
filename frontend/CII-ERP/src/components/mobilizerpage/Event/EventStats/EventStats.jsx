import React, { useEffect, useState } from 'react';
import { FileText, FileEdit, MessageSquare, BadgeCheck } from 'lucide-react';
import { fetchEventStats } from '../../../../../api/mobilizer/eventService';
import './EventStats.css';

const ICON_MAP = { FileText, FileEdit, MessageSquare, BadgeCheck };

export default function EventStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchEventStats().then(setStats).catch(() => setStats([]));
  }, []);

  return (
    <div className="ev-stats">
      {stats.map((stat) => {
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
