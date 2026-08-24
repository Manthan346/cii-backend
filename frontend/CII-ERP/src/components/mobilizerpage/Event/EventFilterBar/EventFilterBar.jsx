import React, { useState } from 'react';
import { Search, ChevronDown, Download } from 'lucide-react';
import { eventTypeOptions } from '../../data/eventData';
import './EventFilterBar.css';

/**
 * EventFilterBar
 * Props:
 *  - onSearch: (query: string) => void
 *  - onTypeChange: (value: string) => void
 *  - onDateChange: (value: string) => void
 *  - onExport: () => void
 */
export default function EventFilterBar({ onSearch, onTypeChange, onDateChange, onExport }) {
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('');

  const handleQuery = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleDate = (e) => {
    setDate(e.target.value);
    onDateChange?.(e.target.value);
  };

  return (
    <div className="evf-bar">
      <div className="evf-search">
        <Search size={16} className="evf-search__icon" />
        <input type="text" placeholder="Search events by name..." value={query} onChange={handleQuery} />
      </div>

      <div className="evf-select-wrap">
        <select defaultValue="all" onChange={(e) => onTypeChange?.(e.target.value)}>
          {eventTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="evf-select__chevron" />
      </div>

      <div className="evf-date-wrap">
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={date}
          onChange={handleDate}
          onFocus={(e) => (e.target.type = 'date')}
          onBlur={(e) => !e.target.value && (e.target.type = 'text')}
        />
      </div>

      <button type="button" className="evf-export-btn" onClick={onExport}>
        <Download size={14} />
        Export as
      </button>
    </div>
  );
}
