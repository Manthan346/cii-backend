import React from 'react';
import { enquiryTabs, enquiriesStats } from '../../data/enquiriesData';
import './EnquiriesTabs.css';

/**
 * EnquiriesTabs
 * Props:
 *  - activeTab: string
 *  - onChange: (tab: string) => void
 */
export default function EnquiriesTabs({ activeTab, onChange }) {
  const total = enquiriesStats.find((s) => s.id === 'total')?.value ?? 0;

  return (
    <div className="eq-tabs">
      {enquiryTabs.map((tab) => (
        <button
          type="button"
          key={tab}
          className={`eq-tab ${tab === activeTab ? 'eq-tab--active' : ''}`}
          onClick={() => onChange?.(tab)}
        >
          {tab === 'All' ? `All (${total.toLocaleString()})` : tab}
        </button>
      ))}
    </div>
  );
}
