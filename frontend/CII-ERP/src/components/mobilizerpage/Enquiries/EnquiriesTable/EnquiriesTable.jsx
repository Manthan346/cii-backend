import React from 'react';
import { Eye } from 'lucide-react';
import InitialsAvatar from '../../shared/InitialsAvatar/InitialsAvatar';
import StatusPill from '../../shared/StatusPill/StatusPill';
import './EnquiriesTable.css';

const STATUS_TONE = {
  'Visited Centre': 'amber',
  Verified: 'blue',
  'Dropped Out': 'red',
  'Not Visited': 'amber',
};

/**
 * EnquiriesTable
 * Props:
 *  - candidates: array (already the current page's slice)
 *  - onViewCandidate: (candidate) => void — fired by both the eye icon
 *      and the "Generate Profile" button, per your instructions
 *  - pagination: { page, totalPages, totalCount, rangeStart, rangeEnd, onPrev, onNext, onPage }
 */
export default function EnquiriesTable({ candidates, onViewCandidate, pagination }) {
  return (
    <div className="eq-table-card">
      <div className="eq-table-scroll">
        <table className="eq-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Area</th>
              <th>Enquiry Source</th>
              <th>Enquiry Date</th>
              <th>Contact</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const fullName = `${c.firstName} ${c.lastName}`;
              return (
                <tr key={c.id}>
                  <td>
                    <div className="eq-table__name">
                      <InitialsAvatar name={fullName} tone={c.avatarTone} />
                      <span className="eq-table__name-text">{fullName}</span>
                    </div>
                  </td>
                  <td>{c.area}</td>
                  <td>{c.enquirySource}</td>
                  <td>{c.enquiryDate}</td>
                  <td>{c.contact}</td>
                  <td>
                    <StatusPill status={c.status} tone={STATUS_TONE[c.status] || 'gray'} />
                  </td>
                  <td>
                    <div className="eq-table__actions">
                      <button
                        type="button"
                        className="eq-generate-btn"
                        onClick={() => onViewCandidate?.(c)}
                      >
                        Generate Profile
                      </button>
                      <button
                        type="button"
                        className="eq-icon-btn"
                        onClick={() => onViewCandidate?.(c)}
                        aria-label={`View ${fullName}`}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="eq-table-footer">
          <span className="eq-table-footer__summary">
            Showing {pagination.rangeStart}-{pagination.rangeEnd} candidates out of{' '}
            {pagination.totalCount.toLocaleString()}
          </span>

          <div className="eq-pagination">
            <button
              type="button"
              className="eq-pagination__btn"
              onClick={pagination.onPrev}
              disabled={pagination.page === 1}
              aria-label="Previous page"
            >
              &lt;
            </button>
            <button type="button" className="eq-pagination__btn eq-pagination__btn--active">
              {pagination.page}
            </button>
            <span className="eq-pagination__ellipsis">&hellip;</span>
            <button
              type="button"
              className="eq-pagination__btn"
              onClick={() => pagination.onPage(pagination.totalPages)}
            >
              {pagination.totalPages}
            </button>
            <button
              type="button"
              className="eq-pagination__btn"
              onClick={pagination.onNext}
              disabled={pagination.page === pagination.totalPages}
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
