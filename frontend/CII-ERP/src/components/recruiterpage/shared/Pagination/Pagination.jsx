import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

/**
 * Pagination (shared)
 *
 * Generic page-controls bar for any list/table across the recruiter
 * portal: "Showing x-y of z" on the left, prev/next + numbered page
 * buttons on the right. Backs Job Management's table today and can
 * back Applications/Placement Management tables later without
 * changes - it only knows about page numbers and counts, never about
 * what's actually being paginated.
 *
 * Props:
 *  - currentPage: number        -> 1-indexed current page
 *  - totalItems: number         -> total row count across all pages
 *  - pageSize: number           -> rows per page
 *  - onPageChange: function(page) -> called with the new 1-indexed page number
 *
 * Renders nothing if there's nothing to paginate (totalItems === 0).
 */
const getPageNumbers = (currentPage, totalPages) => {
  // Always show first, last, current, and one neighbour on each side;
  // collapse the rest into '...' markers.
  const pages = [];
  const addPage = (page) => pages.push(page);

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  addPage(1);
  if (windowStart > 2) pages.push('start-ellipsis');
  for (let page = windowStart; page <= windowEnd; page += 1) addPage(page);
  if (windowEnd < totalPages - 1) pages.push('end-ellipsis');
  if (totalPages > 1) addPage(totalPages);

  return pages;
};

const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="pagination">
      <span className="pagination__summary">
        Showing {rangeStart}-{rangeEnd} of {totalItems}
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__nav-btn"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page) =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              className={`pagination__page-btn ${page === currentPage ? 'pagination__page-btn--active' : ''}`}
              onClick={() => goTo(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={page} className="pagination__ellipsis">…</span>
          )
        )}

        <button
          type="button"
          className="pagination__nav-btn"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
