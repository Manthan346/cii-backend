import React from 'react';
import { FileText, Eye } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import Button from '../../shared/Button/Button';
import './DocumentPanel.css';

/**
 * DocumentPanel
 *
 * Content shown under Profile's "Document" tab: the uploaded-documents
 * list (with Re-upload + view actions) and an "Upload new" link, plus
 * a file-size note at the bottom.
 *
 * Props:
 *  - documents: array of { id, title, required, date } - see
 *              data/profileData.js -> profileData.documents for the shape.
 *              `required` adds a red asterisk after the title.
 *  - onReupload: function(id)
 *  - onView: function(id)
 *  - onUploadNew: function
 */
const DocumentPanel = ({ documents = [], onReupload, onView, onUploadNew }) => {
  return (
    <SectionCard
      title="Uploaded Document"
      action={<a href="#upload-new" onClick={(e) => { e.preventDefault(); onUploadNew?.(); }}>Upload new</a>}
    >
      <div className="admin-document-panel">
        {documents.map((doc) => (
          <div className="admin-document-panel__row" key={doc.id}>
            <div className="admin-document-panel__identity">
              <FileText size={18} className="admin-document-panel__file-icon" />
              <div>
                <p className="admin-document-panel__title">
                  {doc.title}
                  {doc.required && <span className="admin-document-panel__required">*</span>}
                </p>
                <span className="admin-document-panel__date">{doc.date}</span>
              </div>
            </div>

            <div className="admin-document-panel__actions">
              <Button variant="primary" size="sm" onClick={() => onReupload?.(doc.id)}>
                Re-upload
              </Button>
              <button
                type="button"
                className="admin-document-panel__view-btn"
                onClick={() => onView?.(doc.id)}
                aria-label={`View ${doc.title}`}
              >
                <Eye size={15} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}

        <div className="admin-document-panel__note">
          <span className="admin-document-panel__note-label">Note</span>
          <p>
            File Size Should be <strong>less than 5 MB</strong> (All file types supported)
          </p>
        </div>
      </div>
    </SectionCard>
  );
};

export default DocumentPanel;
