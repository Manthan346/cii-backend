import React, { useState } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { jobFilterOptions } from '../../data';
import './JobFilterBar.css';

const EMPTY_DRAFT = {
  search: '',
  jobRole: '',
  sector: '',
  companyName: '',
  mode: '',
  location: '',
};

/**
 * JobFilterBar
 *
 * Search box + 5 dropdown filters (Job Role, Sector, Company Name,
 * Mode, Location) + an "Apply Filter" button. Keeps its own draft
 * state as the user types/selects, and only calls `onApplyFilter`
 * with the current values when the button is clicked - JobManagementList
 * owns what happens with those values.
 */
const JobFilterBar = ({ onApplyFilter }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const handleChange = (key) => (event) => {
    setDraft((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleApply = () => {
    onApplyFilter?.(draft);
  };

  return (
    <div className="job-filter-bar">
      <div className="job-filter-bar__field job-filter-bar__field--search">
        <Search size={16} className="job-filter-bar__search-icon" />
        <input
          type="text"
          placeholder="Search ..."
          value={draft.search}
          onChange={handleChange('search')}
          className="job-filter-bar__search-input"
        />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.jobRole} onChange={handleChange('jobRole')} className="job-filter-bar__select">
          <option value="">Job Role</option>
          {jobFilterOptions.jobRoles.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.sector} onChange={handleChange('sector')} className="job-filter-bar__select">
          <option value="">Sector</option>
          {jobFilterOptions.sectors.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.companyName} onChange={handleChange('companyName')} className="job-filter-bar__select">
          <option value="">Company Name</option>
          {jobFilterOptions.companies.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.mode} onChange={handleChange('mode')} className="job-filter-bar__select">
          <option value="">Mode</option>
          {jobFilterOptions.modes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.location} onChange={handleChange('location')} className="job-filter-bar__select">
          <option value="">All location</option>
          {jobFilterOptions.locations.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <button type="button" className="job-filter-bar__apply" onClick={handleApply}>
        Apply Filter
        <Filter size={15} />
      </button>
    </div>
  );
};

export default JobFilterBar;
