import React, { useState } from 'react';
import ApprovalRequestsOverview from '../ApprovalRequestsOverview/ApprovalRequestsOverview';
import ApprovalRequestsTable from '../ApprovalRequestsTable/ApprovalRequestsTable';
import RequestDetailModal from '../RequestDetailModal/RequestDetailModal';
import Toast from '../../../shared/Toast/Toast';
import {
  approvalStats,
  approvalRequestsList,
  approvalRequestsPagination,
} from '../../../data';
import './ApprovalRequests.css';

/**
 * ApprovalRequests (Admin)
 *
 * "Review and act on pending request across the institution" page:
 * KPI row, the request list with quick inline Approve/Reject actions,
 * and a "Request detail" modal (opened via the eye icon) that also
 * lets you approve/reject with remarks. Either path shows a brief
 * confirmation toast.
 *
 * Request data currently comes from data/approvalRequestsPageData.js
 * mocks and is held in local state just to make approve/reject
 * interactive. Swap in a real data-fetching + mutation hook (e.g.
 * useApprovalRequests()) once the backend endpoints noted in
 * approvalRequestsPageData.js are ready - the section components
 * don't need to change, they just take the same props.
 */
const ApprovalRequests = () => {
  const [requests, setRequests] = useState(approvalRequestsList);
  const [page, setPage] = useState(approvalRequestsPagination.currentPage);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [toast, setToast] = useState(null); // { message, tone } | null

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) || null;

  const updateStatus = (id, status, remarks) => {
    // TODO: PATCH /api/admin/approval-requests/:id { status, remarks }
    console.log('update status', { id, status, remarks });
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleApprove = (id, remarks) => {
    updateStatus(id, 'approved', remarks);
    setSelectedRequestId(null);
    setToast({ message: 'Approved Successfully', tone: 'success' });
  };

  const handleReject = (id, remarks) => {
    updateStatus(id, 'rejected', remarks);
    setSelectedRequestId(null);
    setToast({ message: 'Request Rejected', tone: 'danger' });
  };

  return (
    <div className="admin-approval-requests">
      <div className="admin-approval-requests__heading">
        <h1 className="admin-approval-requests__title">Approval Requests</h1>
        <p className="admin-approval-requests__subtitle">
          Review and act on pending request across the institution
        </p>
      </div>

      <ApprovalRequestsOverview stats={approvalStats} />

      <ApprovalRequestsTable
        requests={requests}
        pagination={{ ...approvalRequestsPagination, currentPage: page }}
        onPageChange={setPage}
        onView={setSelectedRequestId}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <RequestDetailModal
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequestId(null)}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
};

export default ApprovalRequests;
