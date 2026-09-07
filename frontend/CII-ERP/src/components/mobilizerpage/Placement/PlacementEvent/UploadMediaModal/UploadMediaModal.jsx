import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import Modal from "../../../shared/Modal/Modal";
import StatusPill from "../../../shared/StatusPill/StatusPill";
import "./UploadMediaModal.css";

const STATUS_TONE = {
  Upcoming: "blue",
  Cancelled: "red",
  Completed: "green",
  Today: "amber",
};

/**
 * UploadMediaModal
 * Opens from the card/list image icon.
 *
 * The dropzone is a real clickable label wrapping a hidden file input —
 * selecting files updates the small status line beneath it. The "File"
 * text field above it is separate, for pasting an external link instead.
 *
 * Props:
 *  - event: placement event object, or null when closed
 *  - onClose: () => void
 *  - onUpload: (event, { title, description, fileLink, files }) => void
 */
export default function UploadMediaModal({ event, onClose, onUpload }) {
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const isOpen = Boolean(event);

  // Reset the form whenever a different event's modal is opened.
  useEffect(() => {
    setFiles([]);
    setUploadError("");
    setUploading(false);
  }, [event?.id]);

  const handleCancel = () => onClose();

  const handleUpload = async () => {
    setUploadError("");
    setUploading(true);
    try {
      await onUpload?.(event, files);
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          error.message ||
          "Unable to upload images",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFilesSelected = (e) => {
    const selectedFiles = Array.from(e.target.files || []).slice(0, 10);
    const oversizedFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024,
    );

    if (oversizedFile) {
      setFiles([]);
      setUploadError(`${oversizedFile.name} is larger than the 5 MB limit`);
      return;
    }

    setUploadError("");
    setFiles(selectedFiles);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} width={520}>
      {event && (
        <div className="um-modal">
          <button
            type="button"
            className="um-modal__close"
            onClick={handleCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="um-modal__header">
            <div>
              <p className="um-modal__date">{event.date}</p>
              <p className="um-modal__location">{event.venue}</p>
            </div>
            <StatusPill
              status={event.status}
              tone={STATUS_TONE[event.status] || "gray"}
            />
          </div>

          <div className="um-field">
            <span className="um-field__label">File</span>
            <label className="um-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                hidden
              />
              <UploadCloud size={22} className="um-dropzone__icon" />
              <span className="um-dropzone__label">
                Select images to upload
              </span>
              {files.length > 0 && (
                <span className="um-dropzone__count">
                  {files.length} file(s) selected
                </span>
              )}
            </label>
            {uploadError && (
              <p className="um-upload-error" role="alert">
                {uploadError}
              </p>
            )}
          </div>

          <div className="um-modal__actions">
            <button
              type="button"
              className="um-btn um-btn--ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="um-btn um-btn--primary"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
