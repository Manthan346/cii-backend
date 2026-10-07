import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { jobFilterOptions } from '../../data';
import './JobFilterBar.css';

const JOB_STATUS_OPTIONS = ['Published', 'Expired'];

const EMPTY_DRAFT = {
  search: '',
  mode: '',
  type: '',
  status: '',
};

const FilterDropdown = ({ label, options, value, onChange }) => (
  <details className="job-filter-bar__field job-filter-bar__field--dropdown">
    <summary className="job-filter-bar__select">
      <span>{value || label}</span>
      <ChevronDown size={14} className="job-filter-bar__chevron" />
    </summary>
    <div className="job-filter-bar__options">
      {[{ label, value: '' }, ...options.map((option) => ({ label: option, value: option }))].map(
        (option) => (
          <button
            key={option.value || label}
            type="button"
            className={`job-filter-bar__option${value === option.value ? ' job-filter-bar__option--selected' : ''}`}
            onClick={(event) => {
              onChange(option.value);
              event.currentTarget.closest('details').open = false;
            }}
          >
            {option.label}
          </button>
        ),
      )}
    </div>
  </details>
);

/**
 * JobFilterBar
 *
 * Search box + Mode and Job Type dropdowns. Filter changes are passed
 * to JobManagementList immediately.
 */
const JobFilterBar = ({ onFilterChange, jobTypes = [] }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const experienceOptions = [...new Set(
    jobs.map((job) => job.experience).filter(Boolean),
  )];

  const updateFilter = (key, value) => {
    const nextDraft = { ...draft, [key]: value };
    setDraft(nextDraft);
    onFilterChange?.(nextDraft);
  };

  const handleChange = (key) => (event) => {
    updateFilter(key, event.target.value);
  };

  return (
    <div className="job-filter-bar">
      <div className="job-filter-bar__field job-filter-bar__field--search">
        <Search size={16} className="job-filter-bar__search-icon" />
        <input
          type="text"
          aria-label="Search by job role, company name, sector, or location"
          placeholder="Search job role, company, sector, location..."
          value={draft.search}
          onChange={handleChange('search')}
          className="job-filter-bar__search-input"
        />
      </div>

      <FilterDropdown
        label="Mode"
        options={jobFilterOptions.modes}
        value={draft.mode}
        onChange={(value) => updateFilter('mode', value)}
      />
      <FilterDropdown
        label="Job Type"
        options={jobTypes}
        value={draft.type}
        onChange={(value) => updateFilter('type', value)}
      />
      <FilterDropdown
        label="Status"
        options={JOB_STATUS_OPTIONS}
        value={draft.status}
        onChange={(value) => updateFilter('status', value)}
      />
    </div>
  );
};

export default JobFilterBar;
