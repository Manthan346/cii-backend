import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Modal from '../../../shared/Modal/Modal';
import './ImportModal.css';

/**
 * ImportModal
 *
 * Mini popup opened by the "Import" button on EventApplicationsView.
 * Just a click-to-upload dropzone - stores the picked file's name
 * locally so the person gets feedback, but there's no real upload
 * wiring yet (no backend to send it to).
 */
const ImportModal = ({ isOpen, onClose }) => {
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
      <h2 className="import-modal__title">Import</h2>

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
