import React from 'react';
import './Tabs.css';

/**
 * Tabs
 *
 * Underline tab switcher used to flip between views on the same page
 * - "Courses" / "Short term Training" on Course Management today,
 * likely reused anywhere else a page needs two or three sub-views
 * without separate routes.
 *
 * Props:
 *  - tabs: array of { id, label }
 *  - activeId: string
 *  - onChange: function(id)
 *  - variant: 'underline' | 'pills' -> 'underline' (default) matches Course
 *             Management (bordered bar, blue underline on the active tab).
 *             'pills' is a set of fully-rounded standalone pills, each filled
 *             solid when active - used on Profile's section tabs and the
 *             Edit Profile modal's tabs.
 */
const Tabs = ({ tabs = [], activeId, onChange, variant = 'underline' }) => {
  return (
    <div className={`admin-tabs admin-tabs--${variant}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={`admin-tabs__tab ${
            tab.id === activeId ? 'admin-tabs__tab--active' : ''
          }`}
          onClick={() => onChange?.(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
