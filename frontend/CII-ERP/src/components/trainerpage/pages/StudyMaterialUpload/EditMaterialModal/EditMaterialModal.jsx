import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../shared";
import { updateStudyMaterial } from "../../../../../../api/trainer/studyMaterialService";
import "./EditMaterialModal.css";

/**
 * EditMaterialModal (Study Material Upload)
 *
 * Batch is shown read-only: the backend's updateStudyMaterial
 * controller only accepts study_material_id, title, description,
 * document_link, is_show — there is no batch_id param, so a batch
 * cannot actually be changed through this endpoint.
 */
export default function EditMaterialModal({ material, onClose, onSave }) {
  const [title, setTitle] = useState(material?.name || "");
  const [description, setDescription] = useState(material?.description || "");
  const [link, setLink] = useState(material?.link || "");
  const [status, setStatus] = useState(material?.status || "Draft");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!material) return null;

  const handleSave = async () => {
    setError(null);
    if (!title.trim()) return setError("Title is required.");

    setSubmitting(true);
    try {
      await updateStudyMaterial({
        studyMaterialId: material.id,
        title: title.trim(),
        description: description.trim(),
        documentLink: link.trim(),
        isShow: status === "Published",
      });
      onSave?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update material.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="study-material-upload-edit-material-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Edit material"
    >
      <div className="study-material-upload-edit-material-modal-modal">
        <div className="study-material-upload-edit-material-modal-header">
          <div>
            <p className="study-material-upload-edit-material-modal-eyebrow">
              Study material
            </p>
            <h2 className="study-material-upload-edit-material-modal-title">
              Edit material
            </h2>
          </div>
          <button
            type="button"
            className="study-material-upload-edit-material-modal-close-btn"
            onClick={onClose}
            aria-label="Close edit material"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <p className="study-material-upload-edit-material-modal-error">
            {error}
          </p>
        )}

        <div className="study-material-upload-edit-material-modal-field">
          <label htmlFor="edit-material-title">Title</label>
          <input
            id="edit-material-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="study-material-upload-edit-material-modal-field">
          <label htmlFor="edit-material-batch">Batch</label>
          <input
            id="edit-material-batch"
            type="text"
            value={material.batch || ""}
            disabled
            readOnly
          />
        </div>

        <div className="study-material-upload-edit-material-modal-field">
          <label htmlFor="edit-material-description">Description</label>
          <textarea
            id="edit-material-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="study-material-upload-edit-material-modal-field">
          <label htmlFor="edit-material-link">Material link</label>
          <input
            id="edit-material-link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
        </div>

        <div className="study-material-upload-edit-material-modal-field">
          <label htmlFor="edit-material-status">Status</label>
          <select
            id="edit-material-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="study-material-upload-edit-material-modal-actions">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
