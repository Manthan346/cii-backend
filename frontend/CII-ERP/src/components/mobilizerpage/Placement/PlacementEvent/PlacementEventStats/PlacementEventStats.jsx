import React, { useEffect, useState } from 'react';
import { FileText, FileEdit, BadgeCheck, Users } from 'lucide-react';
import { fetchJobEventStats } from '../../../../../../api/mobilizer/placementEventsService';
import './PlacementEventStats.css';

const ICON_MAP = { FileText, FileEdit, BadgeCheck, Users };

export default function PlacementEventStats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchJobEventStats().then((jobEventStats) => {
      if (isMounted) setStats(jobEventStats);
    }).catch(() => {
      if (isMounted) setStats([]);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="pe-stats">
      {stats.map((stat) => {
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
