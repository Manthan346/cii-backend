import { X } from "lucide-react";
import { Button } from "../../../shared";
import "./ViewMaterialModal.css";

export default function ViewMaterialModal({ material, onClose }) {
  if (!material) return null;

  return (
    <div
      className="study-material-upload-view-material-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="View material"
    >
      <div className="study-material-upload-view-material-modal-modal">
        <div className="study-material-upload-view-material-modal-header">
          <div>
            <p className="study-material-upload-view-material-modal-eyebrow">
              Study material
            </p>
            <h2 className="study-material-upload-view-material-modal-title">
              Material details
            </h2>
          </div>
          <button
            type="button"
            className="study-material-upload-view-material-modal-close-btn"
            onClick={onClose}
            aria-label="Close material details"
          >
            <X size={16} />
          </button>
        </div>

        <dl className="study-material-upload-view-material-modal-details">
          <div className="study-material-upload-view-material-modal-detail-full">
            <dt>Title</dt>
            <dd>{material.name || "-"}</dd>
          </div>
          <div className="study-material-upload-view-material-modal-detail">
            <dt>Batch</dt>
            <dd>{material.batch || "-"}</dd>
          </div>
          <div className="study-material-upload-view-material-modal-detail">
            <dt>Status</dt>
            <dd>{material.status || "-"}</dd>
          </div>
          <div className="study-material-upload-view-material-modal-detail">
            <dt>Uploaded by</dt>
            <dd>{material.uploadedBy || "-"}</dd>
          </div>
          <div className="study-material-upload-view-material-modal-detail">
            <dt>Date</dt>
            <dd>{material.date || "-"}</dd>
          </div>
          <div className="study-material-upload-view-material-modal-detail-full">
            <dt>Description</dt>
            <dd>{material.description || "-"}</dd>
          </div>
        </dl>

        <div className="study-material-upload-view-material-modal-actions">
          {material.link && (
            <a
              className="study-material-upload-view-material-modal-link"
              href={material.link}
              target="_blank"
              rel="noreferrer"
            >
              Open Material
            </a>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
