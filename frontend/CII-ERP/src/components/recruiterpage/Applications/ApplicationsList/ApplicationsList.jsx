import React, { useEffect, useMemo, useState } from 'react';
import ApplicationFilterBar from '../ApplicationFilterBar/ApplicationFilterBar';
import ApplicationTable from '../ApplicationTable/ApplicationTable';
import Pagination from '../../shared/Pagination/Pagination';
import './ApplicationsList.css';

const EMPTY_FILTERS = { search: '', company: '', role: '', from: '', to: '' };
const PAGE_SIZE = 6;

/**
 * ApplicationsList
 *
 * The default Applications view: page header, ApplicationFilterBar,
 * the applications table, and pagination. Filtering is "apply on
 * click" - ApplicationFilterBar keeps its own draft state and only
 * calls back here once "Apply Filter" is clicked.
 */
const ApplicationsList = ({ applications, onViewProfile }) => {
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const search = appliedFilters.search.toLowerCase();
      const matchesSearch =
        !search ||
        item.jobRole.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search);
      const matchesCompany = !appliedFilters.company || item.company === appliedFilters.company;
      const matchesRole = !appliedFilters.role || item.jobRole === appliedFilters.role;
      const matchesFrom = !appliedFilters.from || item.appliedDateISO >= appliedFilters.from;
      const matchesTo = !appliedFilters.to || item.appliedDateISO <= appliedFilters.to;

      return matchesSearch && matchesCompany && matchesRole && matchesFrom && matchesTo;
    });
  }, [applications, appliedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters]);

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

  return (
    <div className="applications-list">
      <header className="applications-list__header">
        <h1 className="applications-list__title">Applications</h1>
        <p className="applications-list__subtitle">Every application received across all job postings</p>
      </header>

      <ApplicationFilterBar onApplyFilter={setAppliedFilters} />

      <ApplicationTable applications={paginatedApplications} onViewProfile={onViewProfile} />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredApplications.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ApplicationsList;
