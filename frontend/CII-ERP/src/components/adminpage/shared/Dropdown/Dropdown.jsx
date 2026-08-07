import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

/**
 * Dropdown
 *
 * Labeled filter select used across admin list pages - "Roles",
 * "Status", and similar filters on Candidates, Course Management,
 * etc. Wraps a native <select> (accessible, no extra listbox
 * plumbing) styled to match the app's filter bars.
 *
 * Props:
 *  - label: string                      -> small caption above the select, e.g. "ROLES"
 *  - options: array of { value, label } -> select options
 *  - value: string                      -> currently selected value
 *  - onChange: function(value)          -> called with the new value on change
 */
const Dropdown = ({ label, options = [], value, onChange }) => {
  return (
    <label className="admin-dropdown">
      {label && <span className="admin-dropdown__label">{label}</span>}
      <span className="admin-dropdown__control">
        <select
          className="admin-dropdown__select"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="admin-dropdown__chevron" />
      </span>
    </label>
  );
};

export default Dropdown;
