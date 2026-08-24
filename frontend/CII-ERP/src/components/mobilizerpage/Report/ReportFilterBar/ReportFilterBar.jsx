import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './ReportFilterBar.css';

/**
 * ReportFilterBar
 * Props:
 *  - onApply: ({ from, to }) => void
 *  - onExport: () => void
 */
export default function ReportFilterBar({ onApply, onExport }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  return (
    <div className="rp-filterbar">
      <div className="rp-filterbar__main">
        <span className="rp-filterbar__group-label">Date</span>

        <div className="rp-filterbar__fields">
          <label className="rp-date">
            <span className="rp-date__label">From</span>
            <span className="rp-date__input-wrap">
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              />
              <Calendar size={15} className="rp-date__icon" />
            </span>
          </label>

          <label className="rp-date">
            <span className="rp-date__label">To</span>
            <span className="rp-date__input-wrap">
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
              />
              <Calendar size={15} className="rp-date__icon" />
            </span>
          </label>

          <button type="button" className="rp-btn" onClick={() => onApply?.({ from, to })}>
            Apply Filter
          </button>
        </div>
      </div>

      <button type="button" className="rp-btn rp-btn--export" onClick={onExport}>
        Export
      </button>
    </div>
  );
}
