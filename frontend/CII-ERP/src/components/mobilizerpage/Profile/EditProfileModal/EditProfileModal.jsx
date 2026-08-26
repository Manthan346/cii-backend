import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import './EditProfileModal.css';

/**
 * EditProfileModal
 * Deliberately only exposes `name` and `mobile` — Employee ID, Email,
 * Assigned centre, and Designation are account-managed fields, not
 * user-editable, per instructions.
 *
 * Props:
 *  - isOpen: boolean
 *  - profile: profile data object (for prefilling)
 *  - onClose: () => void
 *  - onSave: ({ name, mobile }) => void
 */
export default function EditProfileModal({ isOpen, profile, onClose, onSave }) {
  const [name, setName] = useState(profile.name);
  const [mobile, setMobile] = useState(profile.mobile);

  // Re-sync the form whenever the modal is (re)opened, so edits from a
  // previous open don't linger if the user cancelled out last time.
  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setMobile(profile.mobile);
    }
  }, [isOpen, profile.name, profile.mobile]);

  const handleSave = () => {
    onSave?.({ name, mobile });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={440}>
      <div className="epm-modal">
        <div className="epm-modal__header">
          <h2 className="epm-modal__title">Edit Profile</h2>
          <button type="button" className="epm-modal__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <label className="epm-field">
          <span className="epm-field__label">Name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="epm-field">
          <span className="epm-field__label">Contact</span>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>

        <div className="epm-modal__actions">
          <button type="button" className="epm-btn epm-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="epm-btn epm-btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
