import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { eventStatusOptions } from "../../../../../api/recruiter/jobEventService";
import "./EventFilterBar.css";

const TYPE_TABS = ["All", "Job Fair", "Job Drive"];
const STATUS_OPTIONS = ["All status", ...eventStatusOptions];

/**
 * EventFilterBar
 *
 * Search box + type tabs (All / Job Fair / Job Drive) + a status
 * dropdown. Unlike Job Management's JobFilterBar, there's no "Apply
 * Filter" button in this design - every change filters immediately,
 * so this component is fully controlled by its parent.
 *
 * Props:
 *  - filters: { search, type, status }
 *  - onChange: function(nextFilters)
 */
const EventFilterBar = ({ filters, onChange }) => {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="event-filter-bar">
      <div className="event-filter-bar__search">
        <Search size={16} className="event-filter-bar__search-icon" />
        <input
          type="text"
          placeholder="Search ..."
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          className="event-filter-bar__search-input"
        />
      </div>

      <div className="event-filter-bar__tabs">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`event-filter-bar__tab ${filters.type === tab ? "event-filter-bar__tab--active" : ""}`}
            onClick={() => updateFilter("type", tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="event-filter-bar__status">
        <select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="event-filter-bar__status-select"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="event-filter-bar__status-chevron" />
      </div>
    </div>
  );
};

export default EventFilterBar;
