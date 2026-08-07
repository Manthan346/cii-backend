import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

/**
 * Pagination
 *
 * Numbered pager with prev/next arrows, used under any admin table
 * (Total Users, Candidates, Course Management, ...). Collapses the
 * middle of long page ranges to "..." like the reference design
 * (1 2 3 ...... 934).
 *
 * Props:
 *  - currentPage: number
 *  - totalPages: number
 *  - onPageChange: function(page)
 */
const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Always show first 3 pages, then an ellipsis, then the last page -
  // matches the "1 2 3 ...... 934" pattern in the reference design.
  const visiblePages = [1, 2, 3].filter((p) => p <= totalPages);
  const showEllipsis = totalPages > 4;

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  return (
    <nav className="admin-pagination" aria-label="Pagination">
      <button
        type="button"
        className="admin-pagination__arrow"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          className={`admin-pagination__page ${
            page === currentPage ? 'admin-pagination__page--active' : ''
          }`}
          onClick={() => goTo(page)}
        >
          {page}
        </button>
      ))}

      {showEllipsis && <span className="admin-pagination__ellipsis">......</span>}

      {showEllipsis && (
        <button
          type="button"
          className={`admin-pagination__page ${
            totalPages === currentPage ? 'admin-pagination__page--active' : ''
          }`}
          onClick={() => goTo(totalPages)}
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        className="admin-pagination__arrow"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
