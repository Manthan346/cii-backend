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
      className={'overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Upload study material"
    >
      <div className={'modal'}>
        <div className={'header'}>
          <h2 className={'title'}>Upload Study Material</h2>
          <button
            type="button"
            className={'closeBtn'}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className={'field'}>
          <label className={'label'}>Title</label>
          <input
            type="text"
            className={'input'}
            placeholder="eg data science module 7-notes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={'field'}>
          <label className={'label'}>Course</label>
          <input
            type="text"
            className={'input'}
            placeholder="Data science"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          />
        </div>

        <div className={'field'}>
          <label className={'label'}>Description(optional)</label>
          <textarea
            className={'textarea'}
            placeholder="Add a short description...."
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={'field'}>
          <label className={'label'}>File</label>
          <div className={'fileDropzone'} onClick={handleBrowseClick}>
            <UploadCloud size={22} className={'fileIcon'} />
            <p className={'fileText'}>
              {fileName || (
                <>
                  Drag file here or <span className={'browseLink'}>Browse</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className={'actions'}>
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
