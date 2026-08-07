import React, { useMemo, useState } from 'react';
import { FileDown } from 'lucide-react';
import Button from '../../shared/Button/Button';
import UsersOverview from '../UsersOverview/UsersOverview';
import UsersFilterBar from '../UsersFilterBar/UsersFilterBar';
import UsersTable from '../UsersTable/UsersTable';
import {
  userStats,
  userRoleOptions,
  userStatusOptions,
  usersList,
  usersPagination,
} from '../../data/totalUsersData';
import './TotalUsers.css';

/**
 * TotalUsers (Admin)
 *
 * "Manage every user across the platform" page: KPI row, search/role/
 * status filters, and the paginated user list with row actions.
 *
 * All content currently comes from data/totalUsersData.js mocks, and
 * filter/pagination/selection state is held locally here just to make
 * the UI interactive. Swap in a real data-fetching hook (e.g.
 * useTotalUsers({ search, role, status, page })) once the backend
 * endpoints noted in totalUsersData.js are ready - the section
 * components don't need to change, they just take the same props.
 */
const TotalUsers = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(usersPagination.currentPage);
  const [selectedIds, setSelectedIds] = useState([]);

  // Client-side filtering over the mock list, standing in for a real
  // `GET /api/admin/users?search=&role=&status=&page=` call.
  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch =
        !search.trim() ||
        user.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        user.email.toLowerCase().includes(search.trim().toLowerCase());
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, role, status]);

  const handleApplyFilters = () => {
    setPage(1);
    // TODO: trigger the real fetch here once wired to the backend.
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredUsers.length ? [] : filteredUsers.map((u) => u.id)
    );
  };

  const handleAddUser = () => {
    // TODO: open an "Add user" modal / navigate to a create-user form
    console.log('add user');
  };

  const handleExport = () => {
    // TODO: GET /api/admin/users/export?format=csv (or similar)
    console.log('export users');
  };

  return (
    <div className="admin-total-users">
      <div className="admin-total-users__heading">
        <div>
          <h1 className="admin-total-users__title">Total users</h1>
          <p className="admin-total-users__subtitle">
            Manage every user across the platform . {usersPagination.totalResults.toLocaleString()} total
          </p>
        </div>
        <Button icon={FileDown} onClick={handleExport}>
          Export As
        </Button>
      </div>

      <UsersOverview stats={userStats} />

      <UsersFilterBar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        roleOptions={userRoleOptions}
        statusOptions={userStatusOptions}
        onApply={handleApplyFilters}
      />

      <UsersTable
        users={filteredUsers}
        pagination={{ ...usersPagination, currentPage: page }}
        onPageChange={setPage}
        onAddUser={handleAddUser}
        onViewUser={(id) => console.log('view', id)}
        onRowMenu={(id) => console.log('menu', id)}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />
    </div>
  );
};

export default TotalUsers;
