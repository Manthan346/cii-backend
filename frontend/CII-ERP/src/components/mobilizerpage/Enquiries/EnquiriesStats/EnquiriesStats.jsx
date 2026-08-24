import React from 'react';
import { ClipboardList, FileEdit, UserX, BadgeCheck } from 'lucide-react';
import { enquiriesStats } from '../../data/enquiriesData';
import './EnquiriesStats.css';

const ICON_MAP = { ClipboardList, FileEdit, UserX, BadgeCheck };

/**
 * EnquiriesStats
 * Unlike the Dashboard's StatCard, these 4 cards use a plain navy icon
 * with no colored background square — a simpler, flatter style specific
 * to this page's reference design.
 */
export default function EnquiriesStats() {
  return (
    <div className="eq-stats">
      {enquiriesStats.map((stat) => {
        const Icon = ICON_MAP[stat.icon];
        return (
          <div className="eq-stat-card" key={stat.id}>
            <Icon size={20} className="eq-stat-card__icon" />
            <span className="eq-stat-card__value">{stat.value.toLocaleString()}</span>
            <span className="eq-stat-card__label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
