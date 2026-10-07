import React from 'react';
import { Search } from 'lucide-react';
import './ApplicationsFilterBar.css';

/**
 * ApplicationsFilterBar
 *
 * Search box for candidates on EventApplicationsView.
 *
 * Props:
 *  - filters: { search }
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
          placeholder="Search by name, location, Vidhan Sabha, contact, or college..."
          value={filters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
          className="applications-filter-bar__search-input"
        />
      </div>

    </div>
  );
};

export default ApplicationsFilterBar;
