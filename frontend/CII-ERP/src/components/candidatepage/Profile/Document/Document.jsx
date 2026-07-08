// Document.jsx
// "Document" tab: shows uploaded documents with status and lets the user upload new documents.
//
// Props:
//   documents     {array}     – list of document records (see profileData.js)
//   onDocumentsChange {function(nextDocuments)} – called whenever the list changes

import { useState } from 'react';
import Icon from '../../shared/Icon/Icon';
import UploadModal from './UploadModal';
import './Document.css';

function StatusBadge({ status }) {
  if (status === 'verified') {
    return <span className="document__badge document__badge--verified">Verified</span>;
  }
  return <span className="document__badge document__badge--pending">Pending</span>;
}

export default function Document({ documents, onDocumentsChange }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  const addNewDocument = (file) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      uploadedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'verified',
      kind: 'single',
    };
    onDocumentsChange([...documents, newDoc]);
    setUploadOpen(false);
  };

  const handleUploadClick = (doc) => {
    setUploadOpen(true);
  };

  return (
    <div className="document">

      <div className="document__card">
        <div className="document__card-header">
          <span className="document__card-title">Uploaded Document</span>
          <button className="document__upload-new" onClick={() => setUploadOpen(true)}>
            Upload new
          </button>
        </div>

        <div className="document__list">
          {documents.map(doc => (
            <div key={doc.id} className="document__item-wrap">
              <div className="document__item">
                <div className="document__item-left">
                  <Icon
                    name={doc.status === 'verified' ? 'document' : 'alert'}
                    size={18}
                    color={doc.status === 'verified' ? 'var(--ink-soft)' : 'var(--orange)'}
                  />
                  <div>
                    <div className="document__item-name">{doc.name}</div>
                    {doc.uploadedOn ? (
                      <div className="document__item-date">Uploaded {doc.uploadedOn}</div>
                    ) : (
                      <div className="document__item-date document__item-date--pending">Not uploaded</div>
                    )}
                  </div>
                </div>

                <div className="document__item-right">
                  <StatusBadge status={doc.status} />
                  {doc.status === 'verified' ? (
                    <button className="document__download-btn" aria-label="Download">
                      <Icon name="download" size={14} color="var(--ink-soft)" />
                    </button>
                  ) : (
                    <button className="document__upload-btn" onClick={() => handleUploadClick(doc)}>
                      Upload Now
                    </button>
                  )}
                </div>
              </div>


            </div>
          ))}
        </div>

        <div className="document__note">
          <span className="document__note-label">Note</span>
          <span className="document__note-text">File Size Should be less than 200KB (PDF Format only)</span>
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={addNewDocument}
      />

    </div>
  );
}
