import React, { useEffect, useState } from 'react';
import { ClipboardList, FileEdit, UserX, BadgeCheck } from 'lucide-react';
import { fetchEnquiryStats } from '../../../../../api/mobilizer/enquiryService';
import './EnquiriesStats.css';

const STAT_CONFIG = {
  'Total Enquiries': { id: 'total', icon: ClipboardList },
  'Pending Enquiries': { id: 'pending', icon: FileEdit },
  'Not Connected': { id: 'not-connected', icon: UserX },
  'Center Visited': { id: 'centre-visited', icon: BadgeCheck },
};

/**
 * EnquiriesStats
 * Unlike the Dashboard's StatCard, these 4 cards use a plain navy icon
 * with no colored background square — a simpler, flatter style specific
 * to this page's reference design.
 */
export default function EnquiriesStats() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetchEnquiryStats()
      .then((enquiryStats) => {
        if (isMounted) setStats(enquiryStats);
      })
      .catch(() => {
        if (isMounted) setError('Unable to load enquiry stats');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;

  return (
    <div className="eq-stats">
      {stats.length === 0 ? (
        <p>Loading enquiry stats...</p>
      ) : stats.map((stat) => {
        const config = STAT_CONFIG[stat.label];
        const Icon = config?.icon ?? ClipboardList;
        return (
          <div className="eq-stat-card" key={config?.id ?? stat.label}>
            <Icon size={20} className="eq-stat-card__icon" />
            <span className="eq-stat-card__value">{Number(stat.count).toLocaleString()}</span>
            <span className="eq-stat-card__label">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
