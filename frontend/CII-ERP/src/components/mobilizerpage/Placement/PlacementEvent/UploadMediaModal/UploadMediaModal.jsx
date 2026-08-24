import React, { useEffect, useRef, useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import Modal from '../../../shared/Modal/Modal';
import StatusPill from '../../../shared/StatusPill/StatusPill';
import './UploadMediaModal.css';

const STATUS_TONE = {
  Upcoming: 'blue',
  Cancelled: 'red',
  Completed: 'green',
  Today: 'amber',
};

/**
 * UploadMediaModal
 * Opens from the card/list image icon, or from EventDetailModal's
 * "Add Images & video" button.
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const isOpen = Boolean(event);

  // Reset the form whenever a different event's modal is opened.
  useEffect(() => {
    setTitle(event?.title || '');
    setDescription(event?.description || '');
    setFileLink('');
    setFiles([]);
  }, [event?.id]);

  const handleCancel = () => onClose();

  const handleUpload = () => {
    onUpload?.(event, { title, description, fileLink, files });
  };

  const handleFilesSelected = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} width={520}>
      {event && (
        <div className="um-modal">
          <button type="button" className="um-modal__close" onClick={handleCancel} aria-label="Close">
            <X size={16} />
          </button>

          <div className="um-modal__header">
            <div>
              <p className="um-modal__date">{event.date}</p>
              <p className="um-modal__location">{event.venue}</p>
            </div>
            <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
          </div>

          <label className="um-field">
            <span className="um-field__label">Title</span>
            <input
              type="text"
              className="um-field__input um-field__input--title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="um-field">
            <span className="um-field__label">Description</span>
            <textarea
              className="um-field__textarea"
              placeholder="Add a short description...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <div className="um-field">
            <span className="um-field__label">File</span>
            <input
              type="text"
              className="um-field__input"
              placeholder="paste link here..."
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
            />

            <label className="um-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFilesSelected}
                hidden
              />
              <UploadCloud size={22} className="um-dropzone__icon" />
              <span className="um-dropzone__label">Paste link here</span>
              {files.length > 0 && (
                <span className="um-dropzone__count">{files.length} file(s) selected</span>
              )}
            </label>
          </div>

          <div className="um-modal__actions">
            <button type="button" className="um-btn um-btn--ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="um-btn um-btn--primary" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
