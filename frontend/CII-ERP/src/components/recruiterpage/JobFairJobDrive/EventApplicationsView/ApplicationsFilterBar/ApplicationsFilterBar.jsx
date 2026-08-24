import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { applicationStatusOptions, applicationSourceOptions } from '../../../data';
import './ApplicationsFilterBar.css';

/**
 * ApplicationsFilterBar
 *
 * Search box + "All Status" + "All Sources" dropdowns for the
 * candidate applications table on EventApplicationsView. Filters
 * live, same pattern as EventFilterBar (no separate Apply button).
 *
 * Props:
 *  - filters: { search, status, source }
 *  - onChange: function(nextFilters)
 */
const ApplicationsFilterBar = ({ filters, onChange }) => {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="applications-filter-bar">
      <div className="applications-filter-bar__search">
        <Search size={16} className="applications-filter-bar__search-icon" />
        <input
          type="text"
          placeholder="Search ..."
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          className="applications-filter-bar__search-input"
        />
      </div>

      <div className="applications-filter-bar__select-wrapper">
        <select
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
          className="applications-filter-bar__select"
        >
          {applicationStatusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="applications-filter-bar__chevron" />
      </div>

      <div className="applications-filter-bar__select-wrapper">
        <select
          value={filters.source}
          onChange={(event) => updateFilter('source', event.target.value)}
          className="applications-filter-bar__select"
        >
          {applicationSourceOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="applications-filter-bar__chevron" />
      </div>
    </div>
  );
};

export default ApplicationsFilterBar;
