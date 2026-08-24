import React from 'react';
import { UserRound, Unlock } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Button from '../../shared/Button/Button';
import Pagination from '../../shared/Pagination/Pagination';
import ProgressBar from '../../shared/ProgressBar/ProgressBar';
import './SuspendedAccountsTable.css';

/**
 * SuspendedAccountsTable
 *
 * "Suspended - N results" list: candidate identity, course/batch,
 * attendance progress bar, center, and a Reactivate action per row.
 * Rows with no course assigned render "—" across the board, same
 * convention as the Candidates table.
 *
 * Props:
 *  - accounts: array of { id, candidateId, name, course, batch,
 *              attendance, center } - see data/suspendedAccountsData.js
 *              -> suspendedAccountsList for the shape.
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 *  - onReactivate: function(id)
 *  - selectedIds: array of selected row ids
 *  - onToggleSelect: function(id)
 *  - onToggleSelectAll: function
 */
const SuspendedAccountsTable = ({
  accounts = [],
  pagination = {},
  onPageChange,
  onReactivate,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const {
    currentPage = 1,
    totalPages = 1,
    pageSize = accounts.length,
    totalResults = accounts.length,
  } = pagination;

  const isSelected = (id) => selectedIds.includes(id);
  const allSelected = accounts.length > 0 && accounts.every((a) => isSelected(a.id));

  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard title={`Suspended-${totalResults.toLocaleString()} results`}>
      <div className="admin-table-wrap">
        <table className="admin-suspended-table">
          <thead>
            <tr>
              <th className="admin-suspended-table__checkbox-col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all suspended accounts"
                />
              </th>
              <th>candidate ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Attendance</th>
              <th>Center</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected(account.id)}
                    onChange={() => onToggleSelect?.(account.id)}
                    aria-label={`Select ${account.name}`}
                  />
                </td>
                <td className="admin-suspended-table__candidate-id">
                  {account.candidateId}
                </td>
                <td>
                  <div className="admin-suspended-table__name">
                    <span className="admin-suspended-table__avatar">
                      <UserRound size={15} strokeWidth={2} />
                    </span>
                    {account.name}
                  </div>
                </td>
                <td>{account.course || '—'}</td>
                <td>{account.batch || '—'}</td>
                <td>
                  {account.attendance != null ? (
                    <ProgressBar value={account.attendance} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>{account.center || '—'}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Unlock}
                    onClick={() => onReactivate?.(account.id)}
                  >
                    Reactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-suspended-table__footer">
        <span className="admin-suspended-table__showing">
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

export default SuspendedAccountsTable;
