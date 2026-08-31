import React, { useEffect, useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import Modal from "../../shared/Modal/Modal";
import StatusPill from "../../shared/StatusPill/StatusPill";
import "./UploadMediaModal.css";

// This page's "Upcoming" pill is gray in the reference (matching
// EventListRow's own mapping) — kept consistent with that here.
const STATUS_TONE = {
  Upcoming: "gray",
  Ongoing: "blue",
  Completed: "green",
};

/**
 * UploadMediaModal
 * Opens from an event row's image icon. Same layout as the Placement
 * Event upload modal, but the header shows date + time instead of
 * date + venue, since Event records don't have a location field.
 *
 * Props:
 *  - event: event object, or null when closed
 *  - onClose: () => void
 *  - onUpload: (event, files) => void
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
    setUploading(true);
    setUploadError("");
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
        <div className="evu-modal">
          <button
            type="button"
            className="evu-modal__close"
            onClick={handleCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="evu-modal__header">
            <div>
              <p className="evu-modal__date">
                {event.day} {event.month}
              </p>
              <p className="evu-modal__time">{event.time}</p>
            </div>
            <StatusPill
              status={event.status}
              tone={STATUS_TONE[event.status] || "gray"}
            />
          </div>

          <div className="evu-field">
            <span className="evu-field__label">File</span>
            <label className="evu-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                hidden
              />
              <UploadCloud size={22} className="evu-dropzone__icon" />
              <span className="evu-dropzone__label">
                Select images to upload
              </span>
              {files.length > 0 && (
                <span className="evu-dropzone__count">
                  {files.length} file(s) selected
                </span>
              )}
            </label>
            {uploadError && (
              <p className="evu-upload-error" role="alert">
                {uploadError}
              </p>
            )}
          </div>

          <div className="evu-modal__actions">
            <button
              type="button"
              className="evu-btn evu-btn--ghost"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="evu-btn evu-btn--primary"
              onClick={handleUpload}
              disabled={!files.length || uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
