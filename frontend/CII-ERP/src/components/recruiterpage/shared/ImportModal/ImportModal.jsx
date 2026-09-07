import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import Modal from "../Modal/Modal";
import { uploadJobEventCandidates } from "../../../../../api/recruiter/jobEventService";
import "./ImportModal.css";

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
const ImportModal = ({
  isOpen,
  onClose,
  title = "Import",
  eventId,
  onImported,
}) => {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleClose = () => {
    setFileName(null);
    setFile(null);
    setError("");
    setResult(null);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
      setError("");
      setResult(null);
    }
  };

  const handleUpload = async () => {
    setError("");
    setUploading(true);
    try {
      const data = await uploadJobEventCandidates(eventId, file);
      setResult(data);
      onImported?.(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to import candidates.",
      );
    } finally {
      setUploading(false);
    }
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
          {fileName ?? "Click to upload a file"}
        </span>
        <input
          ref={inputRef}
          type="file"
          className="import-modal__file-input"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.xls"
        />
      </button>
      {error && (
        <p className="import-modal__error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <p className="import-modal__success">
          Imported {result.successful_inserts ?? 0} candidate(s)
          {result.failed_rows ? `; ${result.failed_rows} row(s) failed.` : "."}
        </p>
      )}
      <button
        type="button"
        className="import-modal__upload-btn"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? "Uploading..." : "Upload Candidates"}
      </button>
    </Modal>
  );
};

export default ImportModal;
