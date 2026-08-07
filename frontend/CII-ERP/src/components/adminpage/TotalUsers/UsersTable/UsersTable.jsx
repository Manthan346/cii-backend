import React from 'react';
import { UserRound, Eye, MoreVertical } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import StatusPill from '../../shared/StatusPill/StatusPill';
import Button from '../../shared/Button/Button';
import Pagination from '../../shared/Pagination/Pagination';
import './UsersTable.css';

/**
 * UsersTable
 *
 * "All User - N results" list: selectable rows, per-user identity +
 * contact + role + status + last login, row actions, and pagination.
 *
 * Props:
 *  - users: array of { id, userId, name, email, mobile, roleLabel, status, lastLogin }
 *           see data/totalUsersData.js -> usersList for the shape.
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 *  - onAddUser: function -> "Add user" button
 *  - onViewUser: function(id) -> row eye icon
 *  - onRowMenu: function(id) -> row overflow-menu icon
 *  - selectedIds: Set/array of selected row ids
 *  - onToggleSelect: function(id)
 *  - onToggleSelectAll: function
 */
const UsersTable = ({
  users = [],
  pagination = {},
  onPageChange,
  onAddUser,
  onViewUser,
  onRowMenu,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const { currentPage = 1, totalPages = 1, pageSize = users.length, totalResults = users.length } =
    pagination;

  const isSelected = (id) => selectedIds.includes(id);
  const allSelected = users.length > 0 && users.every((u) => isSelected(u.id));

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard
      title={`All User-${totalResults.toLocaleString()} results`}
      action={<Button size="sm" onClick={onAddUser}>Add user</Button>}
    >
      <div className="admin-table-wrap">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th className="admin-users-table__checkbox-col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all users"
                />
              </th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email-ID</th>
              <th>Mobile</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th className="admin-users-table__actions-col" aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected(user.id)}
                    onChange={() => onToggleSelect?.(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </td>
                <td className="admin-users-table__user-id">{user.userId}</td>
                <td>
                  <div className="admin-users-table__name">
                    <span className="admin-users-table__avatar">
                      <UserRound size={15} strokeWidth={2} />
                    </span>
                    {user.name}
                  </div>
                </td>
                <td>
                  <a
                    className="admin-users-table__email"
                    href={`mailto:${user.email}`}
                  >
                    {user.email}
                  </a>
                </td>
                <td>{user.mobile}</td>
                <td>{user.roleLabel}</td>
                <td>
                  <StatusPill tone={user.status === 'active' ? 'success' : 'neutral'}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </StatusPill>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="admin-users-table__row-actions">
                    <button
                      type="button"
                      className="admin-users-table__icon-btn"
                      onClick={() => onViewUser?.(user.id)}
                      aria-label={`View ${user.name}`}
                    >
                      <Eye size={15} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      className="admin-users-table__icon-btn"
                      onClick={() => onRowMenu?.(user.id)}
                      aria-label={`More actions for ${user.name}`}
                    >
                      <MoreVertical size={15} strokeWidth={2} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-users-table__footer">
        <span className="admin-users-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()} Users
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </SectionCard>
  );
};

export default UsersTable;
