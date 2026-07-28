// UploadModal.jsx
import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import './UploadModal.css';

export default function UploadModal({ open, onClose, onUpload, uploading, error }) {
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!file || uploading) return;
    onUpload(file);
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <div className="upload-modal__overlay" onClick={handleClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upload-modal__header">
          <h3>Upload Document</h3>
          <button className="upload-modal__close" onClick={handleClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--ink-soft)" />
          </button>
        </div>

        <label className="upload-modal__dropzone">
          <Icon name="document" size={26} color="var(--blue)" />
          <span>{file ? file.name : 'Click to choose a file (PDF, JPG, PNG)'}</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            hidden
          />
        </label>

        {error && <div className="upload-modal__error">{error}</div>}

        <div className="upload-modal__actions">
          <button className="upload-modal__btn upload-modal__btn--ghost" onClick={handleClose} disabled={uploading}>
            Cancel
          </button>
          <button
            className="upload-modal__btn upload-modal__btn--primary"
            disabled={!file || uploading}
            onClick={handleSubmit}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}