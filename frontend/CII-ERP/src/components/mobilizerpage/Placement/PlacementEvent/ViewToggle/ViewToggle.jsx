import React from 'react';
import './ViewToggle.css';

/**
 * ViewToggle
 * Props:
 *  - view: 'card' | 'list'
 *  - onChange: (view: 'card' | 'list') => void
 */
export default function ViewToggle({ view, onChange }) {
  return (
    <div className="pe-view-toggle">
      <button
        type="button"
        className={`pe-view-toggle__btn ${view === 'card' ? 'pe-view-toggle__btn--active' : ''}`}
        onClick={() => onChange('card')}
      >
        Card View
      </button>
      <button
        type="button"
        className={`pe-view-toggle__btn ${view === 'list' ? 'pe-view-toggle__btn--active' : ''}`}
        onClick={() => onChange('list')}
      >
        List View
      </button>
    </div>
  );
}
