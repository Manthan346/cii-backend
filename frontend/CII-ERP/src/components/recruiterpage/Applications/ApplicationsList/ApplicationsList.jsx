import React from "react";
import ApplicationFilterBar from "../ApplicationFilterBar/ApplicationFilterBar";
import ApplicationTable from "../ApplicationTable/ApplicationTable";
import Pagination from "../../shared/Pagination/Pagination";
import "./ApplicationsList.css";

/**
 * ApplicationsList
 *
 * The default Applications view: page header, ApplicationFilterBar,
 * the applications table, and pagination. Filter changes are
 * immediately passed back to the page.
 */
const ApplicationsList = ({
  applications,
  currentPage,
  totalItems,
  pageSize,
  isLoading,
  error,
  onViewProfile,
  onStatusChange,
  onPageChange,
  onFilterChange,
}) => {
  return (
    <div className="applications-list">
      <header className="applications-list__header">
        <h1 className="applications-list__title">Applications</h1>
        <p className="applications-list__subtitle">
          Every application received across all job postings
        </p>
      </header>

      <ApplicationFilterBar onFilterChange={onFilterChange} />

      {error && <div className="applications-list__error">{error}</div>}

      {!isLoading && !error && (
        <>
          <ApplicationTable
            applications={applications}
            onViewProfile={onViewProfile}
            onStatusChange={onStatusChange}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}

      {isLoading && !error && (
        <div className="applications-list__loading">
          Loading applications...
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
