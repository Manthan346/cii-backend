import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Button } from '../../../shared';
import './UploadMaterialModal.css';

/**
 * UploadMaterialModal (Study Material Upload)
 *
 * "Upload Study Material" popup form: Title, Course, Description
 * (optional), and a File drag/browse zone. Fires onSave(formValues) so
 * the parent page can push a new row into the "All Materials" table
 * and show the success toast.
 *
 * Kept page-local (not /shared) since the field set is specific to
 * uploading study material.
 */
export default function UploadMaterialModal({ onCancel, onSave }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const handleBrowseClick = () => {
    // No real backend to upload to here - just simulate a selected file
    // so the "Upload Material" button has something to reference.
    setFileName((prev) => prev || 'selected-file.pdf');
  };
  const handleSave = () => {
    onSave?.({
      title,
      course,
      description,
      fileName,
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
          <div
            className={
              'study-material-upload-upload-material-modal-file-dropzone'
            }
            onClick={handleBrowseClick}
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
              {fileName || (
                <>
                  Drag file here or{' '}
                  <span
                    className={
                      'study-material-upload-upload-material-modal-browse-link'
                    }
                  >
                    Browse
                  </span>
                </>
              )}
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
