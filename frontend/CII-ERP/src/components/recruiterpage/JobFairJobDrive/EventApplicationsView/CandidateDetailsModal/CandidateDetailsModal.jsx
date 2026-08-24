import React from 'react';
import { Phone, Mail, Briefcase, Users } from 'lucide-react';
import Modal from '../../../shared/Modal/Modal';
import StatusBadge from '../../../shared/StatusBadge/StatusBadge';
import { applicationStatusStyles } from '../../../data';
import './CandidateDetailsModal.css';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * CandidateDetailsModal
 *
 * Mini preview popup for one candidate application - opened either
 * by the "Preview" button in the Resume column or by "View Profile"
 * in a row's action menu (see ApplicationsTable.jsx). Read-only.
 */
const CandidateDetailsModal = ({ candidate, isOpen, onClose }) => {
  if (!candidate) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={460}>
      <div className="candidate-details-modal__header">
        <span
          className="candidate-details-modal__avatar"
          style={{ backgroundColor: candidate.avatarColor }}
        >
          {getInitials(candidate.name)}
        </span>
        <h2 className="candidate-details-modal__name">{candidate.name}</h2>
      </div>

      <hr className="candidate-details-modal__divider" />

      <div className="candidate-details-modal__meta-item">
        <Phone size={16} className="candidate-details-modal__icon" />
        {candidate.contactNo}
      </div>

      <div className="candidate-details-modal__meta-item">
        <Mail size={16} className="candidate-details-modal__icon" />
        {candidate.email}
      </div>

      <div className="candidate-details-modal__meta-item">
        <Briefcase size={16} className="candidate-details-modal__icon" />
        {candidate.appliedTo}
      </div>

      <div className="candidate-details-modal__meta-item">
        <Users size={16} className="candidate-details-modal__icon" />
        Source: {candidate.source}
      </div>

      <hr className="candidate-details-modal__divider" />

      <div className="candidate-details-modal__footer">
        <StatusBadge label={candidate.status} {...(applicationStatusStyles[candidate.status] ?? {})} />
        <span className="candidate-details-modal__applied">Applied {candidate.appliedDate}</span>
      </div>
    </Modal>
  );
};

export default CandidateDetailsModal;
