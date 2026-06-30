// Document.jsx
// "Document" tab: shows uploaded documents with status, lets the user upload
// new documents, and handles the special Government ID Proof flow which
// requires both a PAN Card and an Aadhaar Card.
//
// Props:
//   documents     {array}     – list of document records (see profileData.js)
//   onDocumentsChange {function(nextDocuments)} – called whenever the list changes

import { useState } from 'react';
import Icon from '../Icon/Icon';
import UploadModal from './UploadModal';
import GovtIdModal from './GovtIdModal';
import './Document.css';

function StatusBadge({ status }) {
  if (status === 'verified') {
    return <span className="document__badge document__badge--verified">Verified</span>;
  }
  return <span className="document__badge document__badge--pending">Pending</span>;
}

export default function Document({ documents, onDocumentsChange }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [govtModalOpen, setGovtModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

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

  const handleGovtUpload = ({ pan, aadhar }) => {
    onDocumentsChange(documents.map(doc => {
      if (doc.kind !== 'govtId') return doc;
      return {
        ...doc,
        status: 'verified',
        uploadedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        subDocs: doc.subDocs.map(sd => {
          if (sd.key === 'pan') return { ...sd, file: pan };
          if (sd.key === 'aadhar') return { ...sd, file: aadhar };
          return sd;
        }),
      };
    }));
    setGovtModalOpen(false);
  };

  const handleUploadClick = (doc) => {
    if (doc.kind === 'govtId') {
      setGovtModalOpen(true);
    } else {
      setUploadOpen(true);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
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
                    <div className="document__item-date">Uploaded {doc.uploadedOn}</div>
                  </div>
                </div>

                <div className="document__item-right">
                  <StatusBadge status={doc.status} />
                  {doc.status === 'verified' ? (
                    <button
                      className="document__chevron-btn"
                      onClick={() => toggleExpand(doc.id)}
                      aria-label="Toggle details"
                    >
                      <Icon name="download" size={14} color="var(--ink-soft)" />
                    </button>
                  ) : (
                    <button className="document__upload-btn" onClick={() => handleUploadClick(doc)}>
                      Upload
                    </button>
                  )}
                </div>
              </div>

              {expandedId === doc.id && doc.kind === 'govtId' && (
                <div className="document__subdocs">
                  {doc.subDocs.map(sd => (
                    <div key={sd.key} className="document__subdoc-row">
                      <Icon name="document" size={14} color="var(--ink-soft)" />
                      {sd.label}: <span>{sd.file ? sd.file.name : 'Not uploaded'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={addNewDocument}
      />

      <GovtIdModal
        open={govtModalOpen}
        onClose={() => setGovtModalOpen(false)}
        onUpload={handleGovtUpload}
      />

    </div>
  );
}
