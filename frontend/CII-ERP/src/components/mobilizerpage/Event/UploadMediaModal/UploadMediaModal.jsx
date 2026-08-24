import React, { useEffect, useRef, useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import StatusPill from '../../shared/StatusPill/StatusPill';
import './UploadMediaModal.css';

// This page's "Upcoming" pill is gray in the reference (matching
// EventListRow's own mapping) — kept consistent with that here.
const STATUS_TONE = {
  Upcoming: 'gray',
  Ongoing: 'blue',
  Completed: 'green',
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
    setDescription('');
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
        <div className="evu-modal">
          <button type="button" className="evu-modal__close" onClick={handleCancel} aria-label="Close">
            <X size={16} />
          </button>

          <div className="evu-modal__header">
            <div>
              <p className="evu-modal__date">
                {event.day} {event.month}
              </p>
              <p className="evu-modal__time">{event.time}</p>
            </div>
            <StatusPill status={event.status} tone={STATUS_TONE[event.status] || 'gray'} />
          </div>

          <label className="evu-field">
            <span className="evu-field__label">Title</span>
            <input
              type="text"
              className="evu-field__input evu-field__input--title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="evu-field">
            <span className="evu-field__label">Description</span>
            <textarea
              className="evu-field__textarea"
              placeholder="Add a short description...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <div className="evu-field">
            <span className="evu-field__label">File</span>
            <input
              type="text"
              className="evu-field__input"
              placeholder="paste link here..."
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
            />

            <label className="evu-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFilesSelected}
                hidden
              />
              <UploadCloud size={22} className="evu-dropzone__icon" />
              <span className="evu-dropzone__label">Paste link here</span>
              {files.length > 0 && (
                <span className="evu-dropzone__count">{files.length} file(s) selected</span>
              )}
            </label>
          </div>

          <div className="evu-modal__actions">
            <button type="button" className="evu-btn evu-btn--ghost" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="evu-btn evu-btn--primary" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
