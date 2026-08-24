import React, { useState } from 'react';
import { Search, ChevronDown, Download, Calendar } from 'lucide-react';
import { statusFilterOptions, enquirySourceOptions } from '../../data/enquiriesData';
import './EnquiriesFilterBar.css';

/**
 * EnquiriesFilterBar
 * Search + Status/Enquiry Source dropdowns + date field + Export as.
 * Built as local, self-contained controls (not a shared Dropdown/Button
 * component) since none exist yet in mobilizerpage/shared for this
 * project — same reasoning as the admin-side pages.
 *
 * Props:
 *  - onSearch: (query: string) => void
 *  - onStatusChange: (value: string) => void
 *  - onSourceChange: (value: string) => void
 *  - onDateChange: (value: string) => void
 *  - onExport: () => void
 */
export default function EnquiriesFilterBar({ onSearch, onStatusChange, onSourceChange, onDateChange, onExport }) {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onDateChange?.(e.target.value);
  };

  return (
    <div className="eq-filterbar">
      <div className="eq-filterbar__export-row">
        <button type="button" className="eq-export-btn" onClick={onExport}>
          <Download size={14} />
          Export as
        </button>
      </div>

      <div className="eq-filterbar__row">
        <div className="eq-search">
          <Search size={16} className="eq-search__icon" />
          <input
            type="text"
            placeholder="Search Candidates by Name & ID...."
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="eq-select-wrap">
          <select defaultValue="all" onChange={(e) => onStatusChange?.(e.target.value)}>
            {statusFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="eq-select__chevron" />
        </div>

        <div className="eq-select-wrap">
          <select defaultValue="all" onChange={(e) => onSourceChange?.(e.target.value)}>
            {enquirySourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="eq-select__chevron" />
        </div>

        <div className="eq-date-wrap">
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={date}
            onChange={handleDateChange}
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => !e.target.value && (e.target.type = 'text')}
          />
          <Calendar size={14} className="eq-date__icon" />
        </div>
      </div>
    </div>
  );
}
