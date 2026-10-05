import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { applicationCompanyOptions, applicationRoleOptions } from '../../data';
import './ApplicationFilterBar.css';

const EMPTY_DRAFT = { search: '', company: '', role: '', from: '', to: '' };

/**
 * ApplicationFilterBar
 *
 * Search box + Company Name + Role dropdowns + From/To date range.
 * Filter changes are passed to the parent immediately.
 */
const ApplicationFilterBar = ({ onFilterChange }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const handleChange = (key) => (event) => {
    const nextDraft = { ...draft, [key]: event.target.value };
    setDraft(nextDraft);
    onFilterChange?.(nextDraft);
  };

  return (
    <div className="application-filter-bar">
      <div className="application-filter-bar__fields">
        <div className="application-filter-bar__field application-filter-bar__field--search">
          <Search size={16} className="application-filter-bar__search-icon" />
          <input
            type="text"
            placeholder="Search job..."
            value={draft.search}
            onChange={handleChange('search')}
            className="application-filter-bar__search-input"
          />
        </div>

        <div className="application-filter-bar__field">
          <select value={draft.company} onChange={handleChange('company')} className="application-filter-bar__select">
            <option value="">Company Name</option>
            {applicationCompanyOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <ChevronDown size={14} className="application-filter-bar__chevron" />
        </div>

        <div className="application-filter-bar__field">
          <select value={draft.role} onChange={handleChange('role')} className="application-filter-bar__select">
            <option value="">Role</option>
            {applicationRoleOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <ChevronDown size={14} className="application-filter-bar__chevron" />
        </div>

        <div className="application-filter-bar__field application-filter-bar__field--date">
          <span className="application-filter-bar__date-label">From</span>
          <input
            type="date"
            value={draft.from}
            onChange={handleChange('from')}
            className="application-filter-bar__date-input"
          />
        </div>

        <div className="application-filter-bar__field application-filter-bar__field--date">
          <span className="application-filter-bar__date-label">To</span>
          <input
            type="date"
            value={draft.to}
            onChange={handleChange('to')}
            className="application-filter-bar__date-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilterBar;
