import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Button } from '../../../shared';
import './UploadMaterialModal.css';

/**
 * UploadMaterialModal (Study Material Upload)
 *
 * "Upload Study Material" popup form: Title, Course, Description
 * (optional), and a File field. There's no real backend here to
 * receive an uploaded file, so instead of a drag/browse dropzone the
 * material's location is captured as a pasted link (e.g. a Google
 * Drive / OneDrive / other hosted URL) - matches the reference
 * "Upload Study Material" screen, which has a "paste link here" input
 * plus a large paste-target box beneath it. Fires onSave(formValues)
 * so the parent page can push a new row into the "All Materials"
 * table and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * uploading study material.
 */
export default function UploadMaterialModal({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const handlePasteBoxClick = async () => {
    // Best-effort: read a link straight from the clipboard when the
    // browser allows it, otherwise this just acts as a visual prompt
    // pointing at the input above.
    try {
      const clipboardText = await navigator.clipboard?.readText?.();
      if (clipboardText) setLink(clipboardText.trim());
    } catch {
      // Clipboard permission denied / unsupported - no-op, user can
      // still paste manually into the input above.
    }
  };
  const handleSave = () => {
    onSave?.({
      title,
      course,
      description,
      link,
    });
  };
  return (
    <div
      className={'study-material-upload-upload-material-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Upload study material"
    >
      <div className={'study-material-upload-upload-material-modal-modal'}>
        <div className={'study-material-upload-upload-material-modal-header'}>
          <h2 className={'study-material-upload-upload-material-modal-title'}>
            Upload Study Material
          </h2>
          <button
            type="button"
            className={'study-material-upload-upload-material-modal-close-btn'}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={'study-material-upload-upload-material-modal-field'}>
          <label
            className={'study-material-upload-upload-material-modal-label'}
          >
            Title
          </label>
          <input
            type="text"
            className={'study-material-upload-upload-material-modal-input'}
            placeholder="eg data science module 7-notes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={'study-material-upload-upload-material-modal-field'}>
          <label
            className={'study-material-upload-upload-material-modal-label'}
          >
            Course
          </label>
          <input
            type="text"
            className={'study-material-upload-upload-material-modal-input'}
            placeholder="Data science"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          />
        </div>

        <div className={'study-material-upload-upload-material-modal-field'}>
          <label
            className={'study-material-upload-upload-material-modal-label'}
          >
            Description(optional)
          </label>
          <textarea
            className={'study-material-upload-upload-material-modal-textarea'}
            placeholder="Add a short description...."
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={'study-material-upload-upload-material-modal-field'}>
          <label
            className={'study-material-upload-upload-material-modal-label'}
          >
            File
          </label>
          <input
            type="url"
            className={'study-material-upload-upload-material-modal-input'}
            placeholder="paste link here..."
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
          <div
            className={
              'study-material-upload-upload-material-modal-file-dropzone'
            }
            onClick={handlePasteBoxClick}
            role="button"
            tabIndex={0}
          >
            <UploadCloud
              size={22}
              className={
                'study-material-upload-upload-material-modal-file-icon'
              }
            />
            <p
              className={
                'study-material-upload-upload-material-modal-file-text'
              }
            >
              <span
                className={
                  'study-material-upload-upload-material-modal-browse-link'
                }
              >
                Paste link here
              </span>
            </p>
          </div>
        </div>

        <div className={'study-material-upload-upload-material-modal-actions'}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Upload Material
          </Button>
        </div>
      </div>
    </div>
  );
}
