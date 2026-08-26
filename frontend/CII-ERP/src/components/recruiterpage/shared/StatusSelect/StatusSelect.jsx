import React from 'react';
import { ChevronDown } from 'lucide-react';
import './StatusSelect.css';

/**
 * StatusSelect (shared)
 *
 * Editable counterpart to StatusBadge: looks like the same colored
 * pill (dot + label), but is a real <select> underneath, so a person
 * can change the value right from the table row instead of just
 * viewing it. Colors come from the same kind of style map
 * StatusBadge uses (bg/color per possible value).
 *
 * Backs the Job Fair / Job Drive table's editable Status column
 * today (Upcoming / Ongoing / Completed); reusable anywhere else a
 * status needs to be settable inline rather than read-only.
 *
 * Props:
 *  - value: string                          -> current selected option
 *  - options: string[]                      -> selectable values
 *  - stylesMap: { [option]: { bg, color } } -> per-option pill colors
 *  - onChange: function(nextValue)
 */
const StatusSelect = ({ value, options, stylesMap, onChange }) => {
  const style = stylesMap[value] ?? {};

  return (
    <div className="status-select" style={{ backgroundColor: style.bg }}>
      <span className="status-select__dot" style={{ backgroundColor: style.color }} />
      <select
        className="status-select__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ color: style.color }}
        aria-label="Status"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown size={13} className="status-select__chevron" style={{ color: style.color }} />
    </div>
  );
};

export default StatusSelect;
