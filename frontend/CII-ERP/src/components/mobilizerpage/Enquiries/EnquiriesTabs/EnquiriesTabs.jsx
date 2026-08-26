import React from 'react';
import './EnquiriesTabs.css';

const ENQUIRY_TABS = ['All', 'Follow Up Pending', 'Call Received', 'Center Visited', 'Not Connected'];

/**
 * EnquiriesTabs
 * Props:
 *  - activeTab: string
 *  - onChange: (tab: string) => void
 */
export default function EnquiriesTabs({ activeTab, total = 0, onChange }) {
  return (
    <div className="eq-tabs">
      {ENQUIRY_TABS.map((tab) => (
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
