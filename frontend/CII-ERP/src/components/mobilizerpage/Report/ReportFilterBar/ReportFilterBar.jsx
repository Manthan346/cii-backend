import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './ReportFilterBar.css';

/**
 * ReportFilterBar
 * Props:
 *  - onRangeChange: ({ from, to }) => void
 *  - onExport: () => void
 */
export default function ReportFilterBar({ onRangeChange, onExport, exporting = false }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleDateChange = (key, value) => {
    const nextRange = { from, to, [key]: value };
    if (key === 'from') setFrom(value);
    else setTo(value);
    onRangeChange?.(nextRange);
  };

  return (
    <div className="rp-filterbar">
      <div className="rp-filterbar__main">
        <span className="rp-filterbar__group-label">Date</span>

        <div className="rp-filterbar__fields">
          <label className="rp-date">
            <span className="rp-date__label">From</span>
            <span className="rp-date__input-wrap">
              <input
                type="date"
                value={from}
                onChange={(e) => handleDateChange('from', e.target.value)}
              />
              <Calendar size={15} className="rp-date__icon" />
            </span>
          </label>

          <label className="rp-date">
            <span className="rp-date__label">To</span>
            <span className="rp-date__input-wrap">
              <input
                type="date"
                value={to}
                onChange={(e) => handleDateChange('to', e.target.value)}
              />
              <Calendar size={15} className="rp-date__icon" />
            </span>
          </label>

        </div>
      </div>

      <button type="button" className="rp-btn rp-btn--export" onClick={onExport} disabled={exporting}>
        {exporting ? 'Exporting...' : 'Export'}
      </button>
    </div>
  );
}
