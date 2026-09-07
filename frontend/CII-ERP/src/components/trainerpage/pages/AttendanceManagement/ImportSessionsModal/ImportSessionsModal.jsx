import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { uploadAttendanceSessions } from "../../../../../../api/trainer/attendanceSessionService";
import "./ImportSessionsModal.css";

export default function ImportSessionsModal({ isOpen, onClose, onImported }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setError("");
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => {
    if (uploading) return;
    setFile(null);
    setError("");
    setResult(null);
    onClose();
  };

  const upload = async () => {
    setError("");
    setUploading(true);
    try {
      const data = await uploadAttendanceSessions(file);
      setResult(data);
      onImported?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to import sessions.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="trainer-import-modal__overlay"
      role="presentation"
      onClick={close}
    >
      <div
        className="trainer-import-modal__card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="trainer-import-modal__close"
          onClick={close}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h2>Import Sessions</h2>
        <p>Upload sessions for the batches listed in your Excel file.</p>
        <button
          type="button"
          className="trainer-import-modal__dropzone"
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud size={28} />
          <span>{file?.name || "Click to select Excel file"}</span>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setError("");
              setResult(null);
            }}
          />
        </button>
        {error && (
          <p className="trainer-import-modal__error" role="alert">
            {error}
          </p>
        )}
        {result && (
          <p className="trainer-import-modal__success">
            {result.createdCount ?? 0} session(s) imported successfully
            {result.failedCount
              ? `; ${result.failedCount} row(s) failed.`
              : "."}
          </p>
        )}
        <button
          type="button"
          className="trainer-import-modal__submit"
          onClick={upload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Import Sessions"}
        </button>
      </div>
    </div>
  );
}
