import React, { useEffect, useState } from 'react';
import Modal from '../../../shared/Modal/Modal';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import Button from '../../../shared/Button/Button';
import './RequestDetailModal.css';

const PRIORITY_TONE = {
  high: 'danger',
  medium: 'pending',
  low: 'neutral',
};

/**
 * RequestDetailModal
 *
 * "Request detail - REQ-XXXX" popup: type/submitter/date/priority,
 * description, a remarks textarea, and Rejected/Approved actions.
 * Wraps the shared Modal - all the request-specific layout lives here
 * so Modal itself stays a generic, content-agnostic dialog shell.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - request: { requestId, type, submittedBy, date, priority,
 *              description } | null
 *  - onApprove: function(id, remarks)
 *  - onReject: function(id, remarks)
 */
const RequestDetailModal = ({ isOpen, onClose, request, onApprove, onReject }) => {
  const [remarks, setRemarks] = useState('');

  // Reset remarks whenever a different request is opened
  useEffect(() => {
    setRemarks('');
  }, [request?.id]);

  if (!request) return null;

  const priorityLabel =
    request.priority.charAt(0).toUpperCase() + request.priority.slice(1);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="admin-request-modal">
        <h2 className="admin-request-modal__title">
          Request detail-{request.requestId}
        </h2>

        <div className="admin-request-modal__grid">
          <div>
            <span className="admin-request-modal__field-label">Type</span>
            <p className="admin-request-modal__field-value">{request.type}</p>
          </div>
          <div>
            <span className="admin-request-modal__field-label">Submitted By</span>
            <p className="admin-request-modal__field-value">{request.submittedBy}</p>
          </div>
          <div>
            <span className="admin-request-modal__field-label">Date</span>
            <p className="admin-request-modal__field-value">{request.date}</p>
          </div>
          <div>
            <span className="admin-request-modal__field-label">Priority</span>
            <div className="admin-request-modal__field-value">
              <StatusPill tone={PRIORITY_TONE[request.priority] || 'neutral'}>
                {priorityLabel}
              </StatusPill>
            </div>
          </div>
        </div>

        <div className="admin-request-modal__description">
          <span className="admin-request-modal__field-label">Description</span>
          <p className="admin-request-modal__field-value">{request.description}</p>
        </div>

        <label className="admin-request-modal__remarks">
          <span className="admin-request-modal__field-label">Add remarks</span>
          <textarea
            className="admin-request-modal__textarea"
            placeholder="Type here....."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </label>

        <div className="admin-request-modal__actions">
          <Button
            variant="danger"
            size="sm"
            shape="pill"
            onClick={() => onReject?.(request.id, remarks)}
          >
            Rejected
          </Button>
          <Button
            variant="success"
            size="sm"
            shape="pill"
            onClick={() => onApprove?.(request.id, remarks)}
          >
            Approved
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal;
