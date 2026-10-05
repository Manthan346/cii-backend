import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Dropdown from '../../shared/Dropdown/Dropdown';
import './UsersFilterBar.css';

/**
 * UsersFilterBar
 *
 * Controlled search, role, and status filters for the Total Users table.
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

      </div>
    </SectionCard>
  );
};

export default UsersFilterBar;
