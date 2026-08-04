// GovtIdModal.jsx
// Modal specifically for the "Government ID Proof" document, which requires
// two separate uploads: PAN Card and Aadhaar Card.
//
// Props:
//   open      {boolean}
//   onClose   {function}
//   onUpload  {function({ pan: File, aadhar: File })}

import { useState, useEffect } from 'react';
import Icon from '../../shared/Icon/Icon';
import './GovtIdModal.css';

function FilePicker({ label, file, onChange }) {
  return (
    <label className="govt-id-modal__picker">
      <div className="govt-id-modal__picker-icon">
        <Icon name="document" size={20} color="var(--blue)" />
      </div>
      <div className="govt-id-modal__picker-text">
        <div className="govt-id-modal__picker-label">{label}</div>
        <div className="govt-id-modal__picker-file">
          {file ? file.name : 'Click to choose file (PDF, JPG, PNG)'}
        </div>
      </div>
      {file && <Icon name="check" size={16} color="var(--green)" />}
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        hidden
      />
    </label>
  );
}

export default function GovtIdModal({ open, onClose, onUpload, uploading, error }) {
  const [pan, setPan] = useState(null);
  const [aadhar, setAadhar] = useState(null);

  useEffect(() => {
    if (!open) {
      setPan(null);
      setAadhar(null);
    }
  }, [open]);

  if (!open) return null;

  const canSubmit = pan && aadhar && !uploading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onUpload({ pan, aadhar });
  };

  return (
    <div className="govt-id-modal__overlay" onClick={onClose}>
      <div className="govt-id-modal" onClick={(e) => e.stopPropagation()}>
        <div className="govt-id-modal__header">
          <h3>Upload Government ID Proof</h3>
          <button className="govt-id-modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--ink-soft)" />
          </button>
        </div>

        <p className="govt-id-modal__subtext">
          Please upload both documents below to complete your government ID verification.
        </p>

        <FilePicker label="PAN Card" file={pan} onChange={setPan} />
        <FilePicker label="Aadhaar Card" file={aadhar} onChange={setAadhar} />

        {error && <div className="govt-id-modal__error">{error}</div>}

        <div className="govt-id-modal__actions">
          <button className="govt-id-modal__btn govt-id-modal__btn--ghost" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button
            className="govt-id-modal__btn govt-id-modal__btn--primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {uploading ? 'Uploading…' : 'Upload Both'}
          </button>
        </div>
      </div>
    </div>
  );
}