import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import './AddCandidateModal.css';

const EMPTY_FORM = { firstName: '', lastName: '', mobile: '', location: '', interestedIn: [] };

/**
 * AddCandidateModal
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onSubmit: (formValues) => void
 */
export default function AddCandidateModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleInterest = (value) => {
    setForm((f) => ({
      ...f,
      interestedIn: f.interestedIn.includes(value)
        ? f.interestedIn.filter((v) => v !== value)
        : [...f.interestedIn, value],
    }));
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    setForm(EMPTY_FORM);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} width={520}>
      <div className="ac-modal">
        <div className="ac-modal__header">
          <h2 className="ac-modal__title">Add new Candidate</h2>
          <button type="button" className="ac-modal__close" onClick={handleCancel} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="ac-modal__grid">
          <label className="ac-field">
            <span className="ac-field__label">First name</span>
            <input type="text" value={form.firstName} onChange={updateField('firstName')} />
          </label>
          <label className="ac-field">
            <span className="ac-field__label">Last name</span>
            <input type="text" value={form.lastName} onChange={updateField('lastName')} />
          </label>
        </div>

        <label className="ac-field ac-field--full">
          <span className="ac-field__label">Mobile Number</span>
          <input type="tel" value={form.mobile} onChange={updateField('mobile')} />
        </label>

        <label className="ac-field ac-field--full">
          <span className="ac-field__label">Location:</span>
          <input type="text" value={form.location} onChange={updateField('location')} />
        </label>

        <div className="ac-field ac-field--full">
          <span className="ac-field__label">Interested In:</span>
          <div className="ac-interest-row">
            {['Training', 'Placement'].map((option) => (
              <button
                type="button"
                key={option}
                className={`ac-interest-btn ${form.interestedIn.includes(option) ? 'ac-interest-btn--selected' : ''}`}
                onClick={() => toggleInterest(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="ac-modal__actions">
          <button type="button" className="ac-btn ac-btn--ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className="ac-btn ac-btn--primary" onClick={handleSubmit}>
            Add Candidates
          </button>
        </div>
      </div>
    </Modal>
  );
}
