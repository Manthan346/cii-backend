import React from 'react';
import './EventTabs.css';

const EVENT_TABS = ['All', 'Upcoming', 'Ongoing', 'Completed'];

/**
 * EventTabs
 * Props:
 *  - activeTab: string
 *  - onChange: (tab: string) => void
 */
export default function EventTabs({ activeTab, onChange }) {
  return (
    <div className="evt-tabs">
      {EVENT_TABS.map((tab) => (
        <button
          type="button"
          key={tab}
          className={`evt-tab ${tab === activeTab ? 'evt-tab--active' : ''}`}
          onClick={() => onChange?.(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
