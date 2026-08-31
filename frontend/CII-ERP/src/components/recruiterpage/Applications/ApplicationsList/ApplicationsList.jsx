import React from "react";
import ApplicationFilterBar from '../ApplicationFilterBar/ApplicationFilterBar';
import ApplicationTable from '../ApplicationTable/ApplicationTable';
import Pagination from '../../shared/Pagination/Pagination';
import './ApplicationsList.css';

/**
 * ApplicationsList
 *
 * The default Applications view: page header, ApplicationFilterBar,
 * the applications table, and pagination. Filtering is "apply on
 * click" - ApplicationFilterBar keeps its own draft state and only
 * calls back here once "Apply Filter" is clicked.
 */
const ApplicationsList = ({
  applications,
  currentPage,
  totalItems,
  pageSize,
  isLoading,
  error,
  onViewProfile,
  onPageChange,
  onApplyFilters,
}) => {

  return (
    <div className="applications-list">
      <header className="applications-list__header">
        <h1 className="applications-list__title">Applications</h1>
        <p className="applications-list__subtitle">Every application received across all job postings</p>
      </header>

      <ApplicationFilterBar onApplyFilter={onApplyFilters} />

      {error && <div className="applications-list__error">{error}</div>}

      {!isLoading && !error && (
        <>
          <ApplicationTable applications={applications} onViewProfile={onViewProfile} />

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}

      {isLoading && !error && (
        <div className="applications-list__loading">Loading applications...</div>
      )}
    </div>
  );
};

export default ApplicationsList;
