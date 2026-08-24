import React from 'react';
import { Eye, Check, X } from 'lucide-react';
import SectionCard from '../../../shared/SectionCard/SectionCard';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import Pagination from '../../../shared/Pagination/Pagination';
import './ApprovalRequestsTable.css';

const PRIORITY_TONE = {
  high: 'danger',
  medium: 'pending',
  low: 'neutral',
};

const STATUS_TONE = {
  pending: 'pending',
  approved: 'success',
  rejected: 'danger',
};

const STATUS_LABEL = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

/**
 * ApprovalRequestsTable
 *
 * "All Request - N pending" list: request identity, type, submitter,
 * date, priority/status pills, and row actions. Pending rows get
 * quick inline Approve/Reject icon buttons alongside the eye (view
 * detail); already-decided rows only get the eye.
 *
 * Props:
 *  - requests: array of { id, requestId, type, submittedBy, date,
 *              priority, status } - see data/approvalRequestsPageData.js
 *              -> approvalRequestsList for the shape. `priority` is
 *              'high' | 'medium' | 'low', `status` is 'pending' | 'approved'.
 *  - pagination: { currentPage, totalPages, pageSize, totalResults }
 *  - onPageChange: function(page)
 *  - onView: function(id)      -> eye icon, opens the request detail modal
 *  - onApprove: function(id)   -> quick inline approve
 *  - onReject: function(id)    -> quick inline reject
 */
const ApprovalRequestsTable = ({
  requests = [],
  pagination = {},
  onPageChange,
  onView,
  onApprove,
  onReject,
}) => {
  const {
    currentPage = 1,
    totalPages = 1,
    pageSize = requests.length,
    totalResults = requests.length,
  } = pagination;

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const rangeStart = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <SectionCard title={`All Request- ${pendingCount} pending`}>
      <div className="admin-table-wrap">
        <table className="admin-approval-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Type</th>
              <th>Submitted By</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="admin-approval-table__request-id">{request.requestId}</td>
                <td>{request.type}</td>
                <td>{request.submittedBy}</td>
                <td>{request.date}</td>
                <td>
                  <StatusPill tone={PRIORITY_TONE[request.priority] || 'neutral'}>
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </StatusPill>
                </td>
                <td>
                  <StatusPill tone={STATUS_TONE[request.status] || 'neutral'}>
                    {STATUS_LABEL[request.status] || request.status}
                  </StatusPill>
                </td>
                <td>
                  <div className="admin-approval-table__row-actions">
                    <button
                      type="button"
                      className="admin-approval-table__icon-btn admin-approval-table__icon-btn--view"
                      onClick={() => onView?.(request.id)}
                      aria-label={`View ${request.requestId}`}
                    >
                      <Eye size={15} strokeWidth={2} />
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          className="admin-approval-table__icon-btn admin-approval-table__icon-btn--approve"
                          onClick={() => onApprove?.(request.id)}
                          aria-label={`Approve ${request.requestId}`}
                        >
                          <Check size={15} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          className="admin-approval-table__icon-btn admin-approval-table__icon-btn--reject"
                          onClick={() => onReject?.(request.id)}
                          aria-label={`Reject ${request.requestId}`}
                        >
                          <X size={15} strokeWidth={2.5} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-approval-table__footer">
        <span className="admin-approval-table__showing">
          Showing {rangeStart}-{rangeEnd} of {totalResults.toLocaleString()}
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </SectionCard>
  );
};

export default ApprovalRequestsTable;
