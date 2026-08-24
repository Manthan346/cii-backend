import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/Button/Button';
import SuspendedOverview from '../SuspendedOverview/SuspendedOverview';
import SuspendedFilterBar from '../SuspendedFilterBar/SuspendedFilterBar';
import SuspendedAccountsTable from '../SuspendedAccountsTable/SuspendedAccountsTable';
import {
  suspendedStats,
  suspendedMonthOptions,
  suspendedYearOptions,
  suspendedCourseOptions,
  suspendedBatchOptions,
  suspendedAccountsList,
  suspendedAccountsPagination,
} from '../../data';
import './SuspendedAccounts.css';

/**
 * SuspendedAccounts (Admin)
 *
 * "View and manage all suspended account" page - reached from
 * Candidates via the "Deactivated Account" button. KPI row, compact
 * Month/Years/Courses/Batch filters, and the paginated suspended
 * account list with a Reactivate action per row.
 *
 * All content currently comes from data/suspendedAccountsData.js
 * mocks, and filter/pagination/selection state is held locally here
 * just to make the UI interactive. Swap in a real data-fetching hook
 * once the backend endpoints noted in suspendedAccountsData.js are
 * ready - the section components don't need to change, they just
 * take the same props.
 */
const SuspendedAccounts = () => {
  const navigate = useNavigate();

  const [month, setMonth] = useState('all');
  const [year, setYear] = useState('all');
  const [course, setCourse] = useState('all');
  const [batch, setBatch] = useState('all');
  const [page, setPage] = useState(suspendedAccountsPagination.currentPage);
  const [selectedIds, setSelectedIds] = useState([]);

  // Client-side filtering over the mock list, standing in for a real
  // `GET /api/admin/candidates/suspended?month=&year=&course=&batch=&page=` call.
  const filteredAccounts = useMemo(() => {
    return suspendedAccountsList.filter((account) => {
      const matchesCourse =
        course === 'all' ||
        (account.course &&
          account.course.toLowerCase().replace(/\s+/g, '-').includes(course));
      const matchesBatch =
        batch === 'all' ||
        (account.batch && account.batch.toLowerCase().replace(/\s+/g, '-') === batch);
      // month/year filters are placeholders until suspension dates are
      // available on the record - they pass through everything for now.
      return matchesCourse && matchesBatch;
    });
  }, [course, batch]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sel) => sel !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredAccounts.length ? [] : filteredAccounts.map((a) => a.id)
    );
  };

  const handleReactivate = (id) => {
    // TODO: PATCH /api/admin/candidates/:id { status: 'active' }
    console.log('reactivate', id);
  };

  const handleBack = () => navigate('/admin/candidates');

  return (
    <div className="admin-suspended-accounts">
      <Button icon={ArrowLeft} shape="pill" onClick={handleBack}>
        Back
      </Button>

      <div className="admin-suspended-accounts__heading">
        <h1 className="admin-suspended-accounts__title">Suspended Accounts</h1>
        <p className="admin-suspended-accounts__subtitle">
          View and manage all suspended account
        </p>
      </div>

      <SuspendedOverview stats={suspendedStats} />

      <SuspendedFilterBar
        month={month}
        onMonthChange={setMonth}
        year={year}
        onYearChange={setYear}
        course={course}
        onCourseChange={setCourse}
        batch={batch}
        onBatchChange={setBatch}
        monthOptions={suspendedMonthOptions}
        yearOptions={suspendedYearOptions}
        courseOptions={suspendedCourseOptions}
        batchOptions={suspendedBatchOptions}
      />

      <SuspendedAccountsTable
        accounts={filteredAccounts}
        pagination={{ ...suspendedAccountsPagination, currentPage: page }}
        onPageChange={setPage}
        onReactivate={handleReactivate}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />
    </div>
  );
};

export default SuspendedAccounts;
