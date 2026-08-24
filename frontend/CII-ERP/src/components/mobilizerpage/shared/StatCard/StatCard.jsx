import React from 'react';
import {
  Calendar,
  FileText,
  PhoneMissed,
  Link2,
  Share2,
  MonitorCheck,
  LogIn,
  IdCard,
  FileCheck2,
  Layers,
  Circle,
} from 'lucide-react';
import './StatCard.css';

// Only the icons this page actually uses — keeps the bundle small.
// Add more here if a future stat card needs a different icon.
const ICON_MAP = {
  Calendar,
  FileText,
  PhoneMissed,
  Link2,
  Share2,
  MonitorCheck,
  LogIn,
  IdCard,
  FileCheck2,
  Layers,
};

/**
 * StatCard
 * Icon in a colored rounded square (top), then a large value, a bold
 * label, and an optional subtext line underneath.
 *
 * Props:
 *  - icon: string — key into ICON_MAP above, e.g. 'Calendar'
 *  - value: number | string
 *  - label: string
 *  - subtext: string (optional)
 *  - subtextTone: 'green' | 'gray' (optional, default 'gray')
 *  - tone: 'blue' | 'green' | 'cyan' | 'magenta' | 'purple' | 'teal' | 'orange'
 */
export default function StatCard({ icon, value, label, subtext, subtextTone = 'gray', tone = 'blue' }) {
  const Icon = ICON_MAP[icon] || Circle;

  return (
    <div className="md-statcard">
      <span className={`md-statcard__icon md-statcard__icon--${tone}`}>
        <Icon size={20} />
      </span>
      <span className="md-statcard__value">{value}</span>
      <span className="md-statcard__label">{label}</span>
      {subtext && (
        <span className={`md-statcard__subtext md-statcard__subtext--${subtextTone}`}>{subtext}</span>
      )}
    </div>
  );
}
