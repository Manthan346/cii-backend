import React, { useState } from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';
import { placementStatusOptions } from '../../../data/placementDashboardData';
import './PlacementFilterBar.css';

/**
 * PlacementFilterBar
 * Props:
 *  - onSearch: (query: string) => void
 *  - onStatusChange: (value: string) => void
 *  - onDateChange: (value: string) => void
 *  - onApply: () => void
 */
export default function PlacementFilterBar({ onSearch, onStatusChange, onDateChange, onApply }) {
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
    <div className="pd-filterbar">
      <div className="pd-search">
        <Search size={16} className="pd-search__icon" />
        <input type="text" placeholder="Search here..." value={query} onChange={handleQuery} />
      </div>

      <div className="pd-select-wrap">
        <select defaultValue="all" onChange={(e) => onStatusChange?.(e.target.value)}>
          {placementStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pd-select__chevron" />
      </div>

      <div className="pd-date-wrap">
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={date}
          onChange={handleDate}
          onFocus={(e) => (e.target.type = 'date')}
          onBlur={(e) => !e.target.value && (e.target.type = 'text')}
        />
        <Calendar size={14} className="pd-date__icon" />
      </div>

      <button type="button" className="pd-apply-btn" onClick={onApply}>
        Apply Filter
      </button>
    </div>
  );
}
