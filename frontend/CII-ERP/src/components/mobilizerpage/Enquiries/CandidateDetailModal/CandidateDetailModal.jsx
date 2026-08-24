import React, { useState } from 'react';
import { X, Phone, Mail, PhoneOff, UserCheck, UserX, FileCheck2, XCircle, PhoneMissed, ChevronDown } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import { statusUpdateOptions } from '../../data/enquiriesData';
import './CandidateDetailModal.css';

const MENU_ICON_MAP = { Phone, PhoneOff, UserCheck, UserX, FileCheck2, XCircle, PhoneMissed };

/**
 * CandidateDetailModal
 * Opens from either the "Generate Profile" button or the eye icon (both
 * wired the same way in EnquiriesTable). Selecting an option from
 * "Update Status" appends a new entry to the top of the timeline —
 * the candidate's own `status` field is left as-is here since deciding
 * which timeline events actually change the headline status is a
 * business-logic call for whoever wires this up to a real API.
 *
 * Props:
 *  - candidate: candidate object, or null when closed
 *  - onClose: () => void
 *  - onAddTimelineEntry: (candidateId, entry) => void
 */
export default function CandidateDetailModal({ candidate, onClose, onAddTimelineEntry }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isOpen = Boolean(candidate);

  const handleClose = () => {
    setMenuOpen(false);
    onClose();
  };

  const handleSelectStatus = (option) => {
    const now = new Date();
    const entry = {
      event: option.label,
      dotTone: option.dotTone,
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }),
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      by: 'You',
      location: candidate?.area || '',
    };
    onAddTimelineEntry?.(candidate.id, entry);
    setMenuOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width={480}>
      {candidate && (
        <div className="cd-modal">
          <div className="cd-modal__header">
            <button type="button" className="cd-modal__close" onClick={handleClose} aria-label="Close">
              <X size={16} />
            </button>

            <div className="cd-modal__identity">
              <span className="cd-modal__avatar">
                {candidate.firstName[0]}
                {candidate.lastName[0]}
              </span>
              <span className="cd-modal__name">
                {candidate.firstName} {candidate.lastName}
              </span>
            </div>

            <div className="cd-modal__chips">
              <div className="cd-chip">
                <span className="cd-chip__value">{candidate.status}</span>
                <span className="cd-chip__label">Status</span>
              </div>
              <div className="cd-chip">
                <span className="cd-chip__value">{candidate.education}</span>
                <span className="cd-chip__label">Education</span>
              </div>
              <div className="cd-chip">
                <span className="cd-chip__value">{candidate.enquiryDate}</span>
                <span className="cd-chip__label">Enquiry Date</span>
              </div>
            </div>
          </div>

          <div className="cd-modal__body">
            <div className="cd-contact-row">
              <span className="cd-contact-item">
                <Phone size={16} />
                {candidate.contact}
              </span>
              <span className="cd-contact-item">
                <Mail size={16} />
                {candidate.email}
              </span>
            </div>

            <div className="cd-status-section">
              <div className="cd-status-section__header">
                <h3>Status</h3>
                <div className="cd-update-status">
                  <button
                    type="button"
                    className="cd-update-status__btn"
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    Update Status
                    <ChevronDown size={14} />
                  </button>

                  {menuOpen && (
                    <div className="cd-update-menu">
                      {statusUpdateOptions.map((option) => {
                        const Icon = MENU_ICON_MAP[option.icon];
                        return (
                          <button
                            type="button"
                            key={option.label}
                            className="cd-update-menu__item"
                            onClick={() => handleSelectStatus(option)}
                          >
                            <Icon size={15} />
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <ul className="cd-timeline">
                {candidate.timeline.map((entry, i) => (
                  <li className="cd-timeline__item" key={i}>
                    <span className={`cd-timeline__dot cd-timeline__dot--${entry.dotTone}`} />
                    <div className="cd-timeline__content">
                      <p className="cd-timeline__event">{entry.event}</p>
                      <p className="cd-timeline__meta">
                        {entry.date}, {entry.time} . {entry.by} . {entry.location}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
