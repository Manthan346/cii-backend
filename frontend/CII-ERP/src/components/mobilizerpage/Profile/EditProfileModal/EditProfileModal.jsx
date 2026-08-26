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
export default function EditProfileModal({ isOpen, profile, onClose, onSave, saving }) {
  const [firstName, setFirstName] = useState(profile.firstName || profile.name.split(' ')[0]);
  const [lastName, setLastName] = useState(profile.lastName || profile.name.split(' ').slice(1).join(' '));
  const [mobile, setMobile] = useState(profile.mobile);

  // Re-sync the form whenever the modal is (re)opened, so edits from a
  // previous open don't linger if the user cancelled out last time.
  useEffect(() => {
    if (isOpen) {
      setFirstName(profile.firstName || profile.name.split(' ')[0]);
      setLastName(profile.lastName || profile.name.split(' ').slice(1).join(' '));
      setMobile(profile.mobile);
    }
  }, [isOpen, profile.firstName, profile.lastName, profile.name, profile.mobile]);

  const handleSave = () => {
    onSave?.({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      mobile_number: mobile.trim(),
    });
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
          <span className="epm-field__label">First name</span>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>

        <label className="epm-field">
          <span className="epm-field__label">Last name</span>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>

        <label className="epm-field">
          <span className="epm-field__label">Contact</span>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </label>

        <div className="epm-modal__actions">
          <button type="button" className="epm-btn epm-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="epm-btn epm-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
