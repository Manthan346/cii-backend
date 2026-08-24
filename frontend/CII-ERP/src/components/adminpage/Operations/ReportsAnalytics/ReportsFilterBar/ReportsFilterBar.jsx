import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import './ReportsFilterBar.css';

/**
 * ReportsFilterBar
 * Date range (From/To) + course dropdown + Apply Filters action.
 *
 * NOTE: built as a local, self-contained control (not your shared
 * Dropdown/Button) since those files weren't available in this session —
 * see the drop-in notes for how to swap them in later.
 *
 * Props:
 *  - courseOptions: [{ value, label }]
 *  - onApply: ({ from, to, course }) => void
 */
export default function ReportsFilterBar({ courseOptions = [], onApply }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [course, setCourse] = useState(courseOptions[0]?.value ?? '');

  const handleApply = () => {
    onApply?.({ from, to, course });
  };

  return (
    <div className="ra-filterbar">
      <div className="ra-filterbar__field">
        <span className="ra-filterbar__group-label">Date range</span>
        <div className="ra-filterbar__row">
          <label className="ra-filterbar__date">
            <span className="ra-filterbar__label">From</span>
            <span className="ra-filterbar__input-wrap">
              <Calendar size={16} className="ra-filterbar__icon" />
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              />
            </span>
          </label>

          <label className="ra-filterbar__date">
            <span className="ra-filterbar__label">To</span>
            <span className="ra-filterbar__input-wrap">
              <Calendar size={16} className="ra-filterbar__icon" />
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              />
            </span>
          </label>
        </div>
      </div>

      <label className="ra-filterbar__field">
        <span className="ra-filterbar__group-label">Courses</span>
        <span className="ra-filterbar__select-wrap">
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            {courseOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="ra-filterbar__chevron" />
        </span>
      </label>

      <button type="button" className="ra-btn ra-btn--primary ra-filterbar__apply" onClick={handleApply}>
        <Filter size={16} />
        Apply Filters
      </button>
    </div>
  );
}
