import { FileText, AlertCircle, Download } from "lucide-react";
import { StatusBadge, Button } from "../../../shared";
import "./DocumentTab.css";

/**
 * DocumentTab
 *
 * "Document" tab content: the "Uploaded Document" list. Each row shows
 * a file icon, name (+ red asterisk for required docs), upload date,
 * and either a "Verified" pill with a download icon, or an "Upload Now"
 * button when nothing's been uploaded yet - matching the reference
 * design exactly.
 */
export default function DocumentTab({ documents = [], note }) {
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
                <AlertCircle size={18} className="document-tab__file-icon document-tab__file-icon--missing" />
              )}
              <div className="document-tab__text">
                <p className="document-tab__name">
                  {doc.name}
                  {doc.required && <span className="document-tab__required">*</span>}
                </p>
                <p
                  className={`document-tab__meta${
                    doc.uploaded ? "" : " document-tab__meta--missing"
                  }`}
                >
                  {doc.uploadedOn}
                </p>
              </div>
            </div>

            <div className="document-tab__action">
              {doc.uploaded ? (
                <>
                  <StatusBadge status={doc.status} />
                  <button type="button" className="document-tab__download" aria-label={`Download ${doc.name}`}>
                    <Download size={15} />
                  </button>
                </>
              ) : (
                <Button variant="primary">Upload Now</Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {note && (
        <div className="document-tab__note">
          <span className="document-tab__note-label">Note</span>
          <p className="document-tab__note-text">
            File Size Should be <strong>less than 200KB</strong> <strong>(PDF Format only)</strong>
          </p>
        </div>
      )}
    </div>
  );
}
