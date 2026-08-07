import React from 'react';
import { Filter } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Dropdown from '../../shared/Dropdown/Dropdown';
import Button from '../../shared/Button/Button';
import './UsersFilterBar.css';

/**
 * UsersFilterBar
 *
 * Search + Roles + Status filters for the Total Users table, plus the
 * "Apply Filters" action. Kept as a controlled component - all filter
 * state lives in the parent (TotalUsers) so it can drive the table
 * fetch/filter logic.
 *
 * Props:
 *  - search: string
 *  - onSearchChange: function(value)
 *  - role: string
 *  - onRoleChange: function(value)
 *  - status: string
 *  - onStatusChange: function(value)
 *  - roleOptions / statusOptions: array of { value, label }
 *  - onApply: function -> called when "Apply Filters" is clicked
 */
const UsersFilterBar = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  roleOptions = [],
  statusOptions = [],
  onApply,
}) => {
  return (
    <SectionCard>
      <div className="admin-users-filter">
        <label className="admin-users-filter__search">
          <span className="admin-users-filter__label">Search</span>
          <input
            type="text"
            className="admin-users-filter__search-input"
            placeholder="Name,Email ID ...."
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </label>

        <Dropdown
          label="Roles"
          options={roleOptions}
          value={role}
          onChange={onRoleChange}
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          value={status}
          onChange={onStatusChange}
        />

        <Button icon={Filter} onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </SectionCard>
  );
};

export default UsersFilterBar;
