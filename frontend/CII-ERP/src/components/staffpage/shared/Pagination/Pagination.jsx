import { ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage = 1, totalPages = 22, showing = 0, total = 0, onPageChange }) {
  const leadingPages = [1, 2, 3].filter((page) => page <= totalPages);

  return (
    <div className={styles.footer}>
      <span className={styles.info}>
        showing {showing} out of {total}
      </span>

      <div className={styles.pages}>
        {leadingPages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </button>
        ))}

        {totalPages > leadingPages.length + 1 && <span className={styles.dots}>......</span>}

        {totalPages > leadingPages.length && (
          <button
            type="button"
            className={`${styles.pageBtn} ${totalPages === currentPage ? styles.pageBtnActive : ''}`}
            onClick={() => onPageChange?.(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          type="button"
          className={styles.arrowBtn}
          onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
