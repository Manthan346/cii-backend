import React from 'react';
import { eventTabs } from '../../data/eventData';
import './EventTabs.css';

/**
 * EventTabs
 * Props:
 *  - activeTab: string
 *  - onChange: (tab: string) => void
 */
export default function EventTabs({ activeTab, onChange }) {
  return (
    <div className="evt-tabs">
      {eventTabs.map((tab) => (
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
