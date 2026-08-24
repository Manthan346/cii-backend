import React from 'react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import Dropdown from '../../../shared/Dropdown/Dropdown';
import './ShortTermFilterBar.css';

/**
 * ShortTermFilterBar
 *
 * Search + Type + Trainer + Status + Date filters for the Short term
 * Training table. The Date field is a plain text input styled like a
 * date picker (placeholder DD/MM/YYYY) - swap for a real date-picker
 * component/library if the project adopts one later, the surrounding
 * markup/classes won't need to change.
 *
 * Props:
 *  - search / onSearchChange
 *  - type / onTypeChange
 *  - trainer / onTrainerChange
 *  - status / onStatusChange
 *  - date / onDateChange
 *  - typeOptions / trainerOptions / statusOptions: array of { value, label }
 */
const ShortTermFilterBar = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  trainer,
  onTrainerChange,
  status,
  onStatusChange,
  date,
  onDateChange,
  typeOptions = [],
  trainerOptions = [],
  statusOptions = [],
}) => {
  return (
    <SectionCard>
      <div className="admin-short-term-filter">
        <label className="admin-short-term-filter__search">
          <span className="admin-short-term-filter__label">Search</span>
          <input
            type="text"
            className="admin-short-term-filter__search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </label>

        <Dropdown
          label="Type"
          options={typeOptions}
          value={type}
          onChange={onTypeChange}
        />

        <Dropdown
          label="Trainer"
          options={trainerOptions}
          value={trainer}
          onChange={onTrainerChange}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
        />

        <label className="admin-short-term-filter__date">
          <span className="admin-short-term-filter__label">Date</span>
          <input
            type="text"
            className="admin-short-term-filter__date-input"
            placeholder="DD/MM/YYYY"
            value={date}
            onChange={(e) => onDateChange?.(e.target.value)}
          />
        </label>
      </div>
    </SectionCard>
  );
};

export default ShortTermFilterBar;
