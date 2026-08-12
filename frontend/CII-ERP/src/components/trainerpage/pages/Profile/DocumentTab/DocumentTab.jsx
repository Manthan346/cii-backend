import { useRef, useState } from 'react';
import { FileText, AlertCircle, Eye } from 'lucide-react';
import { Button } from '../../../shared';
import './DocumentTab.css';

/**
 * DocumentTab
 *
 * "Document" tab content: the "Uploaded Document" list. Each row shows
 * a file icon, name (+ red asterisk for required docs), upload date,
 * and either a "Verified" pill with a download icon, or an "Upload Now"
 * button when nothing's been uploaded yet.
 *
 * Upload flow: clicking "Upload Now" opens a hidden file input for
 * that row; on select, size/type is checked client-side, then
 * onUploadDocument(doc, file) is called (owned by Profile.jsx, which
 * knows how to map doc.id -> backend field name and hit the API).
 */
export default function DocumentTab({ documents = [], note, onUploadDocument }) {
  const fileInputRefs = useRef({});
  const [uploadingId, setUploadingId] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const triggerFileSelect = (docId) => {
    fileInputRefs.current[docId]?.click();
  };

  const handleFileChange = async (doc, e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorId(doc.id);
      return;
    }

    setUploadingId(doc.id);
    setErrorId(null);
    try {
      await onUploadDocument(doc, file);
    } catch (err) {
      setErrorId(doc.id);
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="document-tab">
      <div className="document-tab__top">
        <span className="document-tab__badge">Uploaded Document</span>
        <button type="button" className="document-tab__upload-new">
          Upload new
        </button>
      </div>

      <ul className="document-tab__list">
        {documents.map((doc) => (
          <li key={doc.id} className="document-tab__row">
            <div className="document-tab__info">
              {doc.uploaded ? (
                <FileText size={18} className="document-tab__file-icon" />
              ) : (
                <AlertCircle
                  size={18}
                  className="document-tab__file-icon document-tab__file-icon--missing"
                />
              )}
              <div className="document-tab__text">
                <p className="document-tab__name">
                  {doc.name}
                  {doc.required && (
                    <span className="document-tab__required">*</span>
                  )}
                </p>
                <p
                  className={`document-tab__meta${
                    doc.uploaded ? '' : ' document-tab__meta--missing'
                  }`}
                >
                  {errorId === doc.id
                    ? 'Upload failed — file too large (max 5 MB)'
                    : doc.uploadedOn}
                </p>
              </div>
            </div>

            <div className="document-tab__action">
              <input
                type="file"
                accept="*/*"
                style={{ display: 'none' }}
                ref={(el) => (fileInputRefs.current[doc.id] = el)}
                onChange={(e) => handleFileChange(doc, e)}
              />
              {doc.uploaded ? (
                <>
                  <Button
                    variant="primary"
                    disabled={uploadingId === doc.id}
                    onClick={() => triggerFileSelect(doc.id)}
                  >
                    {uploadingId === doc.id ? 'Uploading…' : 'Re-upload'}
                  </Button>
                  <a
                    href={doc.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="document-tab__download"
                    aria-label={`View ${doc.name}`}
                    onClick={(e) => {
                      if (!doc.url) e.preventDefault();
                    }}
                  >
                    <Eye size={15} />
                  </a>
                </>
              ) : (
                <Button
                  variant="primary"
                  disabled={uploadingId === doc.id}
                  onClick={() => triggerFileSelect(doc.id)}
                >
                  {uploadingId === doc.id ? 'Uploading…' : 'Upload Now'}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {note && (
        <div className="document-tab__note">
          <span className="document-tab__note-label">Note</span>
          <p className="document-tab__note-text">
            File Size Should be <strong>less than 5 MB</strong>{' '}
            <strong>(All file types supported)</strong>
          </p>
        </div>
      )}
    </div>
  );
}