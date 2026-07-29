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
    <div className={'footer'}>
      <span className={'info'}>
        {label || `showing ${showing} out of ${total}`}
      </span>

      <div className={'pages'}>
        {leadingPages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${'pageBtn'} ${page === currentPage ? 'pageBtnActive' : ''}`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </button>
        ))}

        {totalPages > leadingPages.length + 1 && (
          <span className={'dots'}>......</span>
        )}

        {totalPages > leadingPages.length && (
          <button
            type="button"
            className={`${'pageBtn'} ${totalPages === currentPage ? 'pageBtnActive' : ''}`}
            onClick={() => onPageChange?.(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          className={'arrowBtn'}
          onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
