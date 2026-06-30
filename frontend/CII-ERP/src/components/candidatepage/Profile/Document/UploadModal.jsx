// UploadModal.jsx
// Generic modal for uploading a single new document.
//
// Props:
//   open      {boolean}
//   onClose   {function}
//   onUpload  {function(file)}  – called with the selected File object

import { useState } from 'react';
import Icon from '../Icon/Icon';
import './UploadModal.css';

export default function UploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  if (!open) return null;

  const handleSubmit = () => {
    if (!file) return;
    onUpload(file);
    setFile(null);
  };

  return (
    <div className="upload-modal__overlay" onClick={onClose}>
      <div className="upload-modal" onClick={e => e.stopPropagation()}>
        <div className="upload-modal__header">
          <h3>Upload New Document</h3>
          <button className="upload-modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--ink-soft)" />
          </button>
        </div>

        <label className="upload-modal__dropzone">
          <Icon name="document" size={26} color="var(--blue)" />
          <span>{file ? file.name : 'Click to choose a file (PDF, JPG, PNG)'}</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setFile(e.target.files?.[0] || null)}
            hidden
          />
        </label>

        <div className="upload-modal__actions">
          <button className="upload-modal__btn upload-modal__btn--ghost" onClick={onClose}>Cancel</button>
          <button
            className="upload-modal__btn upload-modal__btn--primary"
            disabled={!file}
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
