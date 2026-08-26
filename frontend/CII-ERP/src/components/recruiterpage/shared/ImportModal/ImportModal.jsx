import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Modal from '../Modal/Modal';
import './ImportModal.css';

/**
 * ImportModal (shared)
 *
 * Generic "click to upload a file" popup - a click-to-upload dropzone
 * wrapped in the shared Modal, with no domain coupling at all. Backs
 * the "Import" button on JobFairJobDriveList today; reusable for any
 * other bulk-upload need later (e.g. importing candidates elsewhere)
 * without changes.
 *
 * Stores the picked file's name locally so the person gets feedback,
 * but there's no real upload wiring yet (no backend to send it to).
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - title: string (default 'Import') -> lets a caller show what's being
 *    imported into, e.g. "Import - North Mumbai Job Fair"
 */
const ImportModal = ({ isOpen, onClose, title = 'Import' }) => {
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleClose = () => {
    setFileName(null);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth={520}>
      <h2 className="import-modal__title">{title}</h2>

      <button
        type="button"
        className="import-modal__dropzone"
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud size={28} className="import-modal__dropzone-icon" />
        <span className="import-modal__dropzone-text">
          {fileName ?? 'Click to upload a file'}
        </span>
        <input
          ref={inputRef}
          type="file"
          className="import-modal__file-input"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
        />
      </button>
    </Modal>
  );
};

export default ImportModal;
