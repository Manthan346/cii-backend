import React, { useState } from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';
import { eventTypeOptions, locationOptions, eventStatusOptions } from '../../../data/placementEventData';
import './PlacementEventFilterBar.css';

/**
 * PlacementEventFilterBar
 * Props:
 *  - onSearch, onTypeChange, onLocationChange, onStatusChange, onDateChange: (value) => void
 *  - onApply: () => void
 */
export default function PlacementEventFilterBar({
  onSearch,
  onTypeChange,
  onLocationChange,
  onStatusChange,
  onDateChange,
  onApply,
}) {
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

  const Dropdown = ({ options, onChange }) => (
    <div className="pe-select-wrap">
      <select defaultValue="all" onChange={(e) => onChange?.(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pe-select__chevron" />
    </div>
  );

  return (
    <div className="pe-filterbar">
      <div className="pe-filterbar__row">
        <div className="pe-search">
          <Search size={16} className="pe-search__icon" />
          <input type="text" placeholder="Search here..." value={query} onChange={handleQuery} />
        </div>
        <button type="button" className="pe-apply-btn" onClick={onApply}>
          Apply Filter
        </button>
      </div>

      <div className="pe-filterbar__row pe-filterbar__row--filters">
        <Dropdown options={eventTypeOptions} onChange={onTypeChange} />
        <Dropdown options={locationOptions} onChange={onLocationChange} />
        <Dropdown options={eventStatusOptions} onChange={onStatusChange} />

        <div className="pe-date-wrap">
          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={date}
            onChange={handleDate}
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => !e.target.value && (e.target.type = 'text')}
          />
          <Calendar size={14} className="pe-date__icon" />
        </div>
      </div>
    </div>
  );
}
