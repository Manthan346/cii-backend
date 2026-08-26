import React, { useState } from 'react';
import { Search, ChevronDown, Download, Calendar } from 'lucide-react';
import './EnquiriesFilterBar.css';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Status' },
  { value: 'FOLLOW_UP_PENDING', label: 'Follow Up Pending' },
  { value: 'CALL_RECIEVED', label: 'Call Received' },
  { value: 'CENTER_VISITED', label: 'Center Visited' },
  { value: 'NOT_CONNECTED', label: 'Not Connected' },
];

const ENQUIRY_SOURCE_OPTIONS = [
  { value: 'all', label: 'Enquiry Source' },
  { value: 'training', label: 'Training' },
  { value: 'placement', label: 'Placement' },
];

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
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="eq-select__chevron" />
        </div>

        <div className="eq-select-wrap">
          <select defaultValue="all" onChange={(e) => onSourceChange?.(e.target.value)}>
            {ENQUIRY_SOURCE_OPTIONS.map((opt) => (
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
