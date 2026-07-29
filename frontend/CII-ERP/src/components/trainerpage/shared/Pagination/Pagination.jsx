import { ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 22,
  showing = 0,
  total = 0,
  onPageChange,
  label,
}) {
  const leadingPages = [1, 2, 3].filter((page) => page <= totalPages);

  return (
    <div className="pagination-footer">
      <span className="pagination-info">
        {label || `showing ${showing} out of ${total}`}
      </span>

      <div className="pagination-pages">
        {leadingPages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-page-btn ${
              page === currentPage ? 'pagination-page-btn--active' : ''
            }`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </button>
        ))}

        {totalPages > leadingPages.length + 1 && (
          <span className="pagination-dots">......</span>
        )}

        {totalPages > leadingPages.length && (
          <button
            type="button"
            className={`pagination-page-btn ${
              totalPages === currentPage ? 'pagination-page-btn--active' : ''
            }`}
            onClick={() => onPageChange?.(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          className="pagination-arrow-btn"
          onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}