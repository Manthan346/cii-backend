import React from 'react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import StatusPill from '../../shared/StatusPill/StatusPill';
import './ApprovalRequests.css';

/**
 * ApprovalRequests
 *
 * Preview of the most recent pending approval requests (course
 * batches, finance waivers, HR onboarding, etc.) with inline
 * Approve/Reject actions. Links out to the full /admin/approvals list.
 *
 * Props:
 *  - requests: array of { id, request, type, submittedBy, status }
 *              see Dashboard/data.js -> approvalRequests for the shape.
 *  - onApprove: function(id) -> called when an item's Approve pill is clicked
 *  - onReject: function(id)  -> called when an item's Reject pill is clicked
 *  - viewAllHref: string     -> route for the "View all" link
 */
const ApprovalRequests = ({
  requests = [],
  onApprove,
  onReject,
  viewAllHref = '/admin/approvals',
}) => {
  return (
    <SectionCard
      title="Approval requests"
      action={<a href={viewAllHref}>View all</a>}
    >
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Type</th>
              <th>Submitted By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => (
              <tr key={row.id}>
                <td>{row.request}</td>
                <td>{row.type}</td>
                <td>{row.submittedBy}</td>
                <td>
                  <div className="admin-table__status-group">
                    <StatusPill tone="pending">Pending</StatusPill>
                    <StatusPill
                      tone="success"
                      onClick={() => onApprove?.(row.id)}
                    >
                      Approve
                    </StatusPill>
                    <StatusPill
                      tone="danger"
                      onClick={() => onReject?.(row.id)}
                    >
                      Reject
                    </StatusPill>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};

export default ApprovalRequests;
