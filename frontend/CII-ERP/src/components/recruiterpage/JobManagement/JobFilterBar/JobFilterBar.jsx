import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { jobFilterOptions } from '../../data';
import './JobFilterBar.css';

const EMPTY_DRAFT = {
  search: '',
  mode: '',
  employmentType: '',
  experience: '',
};

/**
 * JobFilterBar
 *
 * Search across job role, company, sector, and location, with dropdowns
 * for mode, employment type, and experience.
 */
const JobFilterBar = ({ jobs = [], onFilterChange }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const experienceOptions = [...new Set(
    jobs.map((job) => job.experience).filter(Boolean),
  )];

  const handleChange = (key) => (event) => {
    const nextDraft = { ...draft, [key]: event.target.value };
    setDraft(nextDraft);
    onFilterChange?.(nextDraft);
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
        <select value={draft.employmentType} onChange={handleChange('employmentType')} className="job-filter-bar__select">
          <option value="">Employment Type</option>
          {jobFilterOptions.employmentTypes.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>

      <div className="job-filter-bar__field">
        <select value={draft.experience} onChange={handleChange('experience')} className="job-filter-bar__select">
          <option value="">Experience</option>
          {experienceOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={14} className="job-filter-bar__chevron" />
      </div>
    </div>
  );
};

export default JobFilterBar;
