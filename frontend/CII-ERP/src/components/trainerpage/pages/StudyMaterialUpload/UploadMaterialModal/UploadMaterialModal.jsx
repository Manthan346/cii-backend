import { useState, useEffect } from "react";
import { X, UploadCloud } from "lucide-react";
import { Button, Dropdown } from "../../../shared";
import { fetchCoursesAndBatches } from "../../../../../../api/trainer/candidateService";
import { createStudyMaterial } from "../../../../../../api/trainer/studyMaterialService";
import "./UploadMaterialModal.css";

export default function UploadMaterialModal({ onCancel, onSave }) {
  const [title, setTitle] = useState("");
  const [batchId, setBatchId] = useState("");
  const [batchOptions, setBatchOptions] = useState([]); // [{ label, value }]
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoursesAndBatches()
      .then((data) => {
        const options = (data.batches || []).map((b) => ({
          label: b.batch_code,
          value: b.batchId,
        }));
        setBatchOptions(options);
        if (options.length > 0) setBatchId(options[0].value);
      })
      .catch(() => setError("Failed to load batches"));
  }, []);

  const handlePasteBoxClick = async () => {
    try {
      const clipboardText = await navigator.clipboard?.readText?.();
      if (clipboardText) setLink(clipboardText.trim());
    } catch {
      // Clipboard permission denied / unsupported — no-op
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!title.trim()) return setError("Title is required.");
    if (!batchId) return setError("Batch is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!link.trim()) return setError("A material link is required.");

    setSubmitting(true);
    try {
      const result = await createStudyMaterial({
        batchId,
        title: title.trim(),
        description: description.trim(),
        documentLink: link.trim(),
      });
      onSave?.(result);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to upload study material.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={"study-material-upload-upload-material-modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label="Upload study material"
    >
      <div className={"study-material-upload-upload-material-modal-modal"}>
        <div className={"study-material-upload-upload-material-modal-header"}>
          <h2 className={"study-material-upload-upload-material-modal-title"}>
            Upload Study Material
          </h2>
          <button
            type="button"
            className={"study-material-upload-upload-material-modal-close-btn"}
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <p className={"study-material-upload-upload-material-modal-error"}>
            {error}
          </p>
        )}

        <div className={"study-material-upload-upload-material-modal-field"}>
          <label
            className={"study-material-upload-upload-material-modal-label"}
          >
            Title
          </label>
          <input
            type="text"
            className={"study-material-upload-upload-material-modal-input"}
            placeholder="eg data science module 7-notes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <Dropdown
          label="Batch"
          options={batchOptions.map((o) => o.label)}
          value={batchOptions.find((o) => o.value === batchId)?.label ?? ""}
          onChange={(label) => {
            const match = batchOptions.find((o) => o.label === label);
            if (match) setBatchId(match.value);
          }}
        />

        <div className={"study-material-upload-upload-material-modal-field"}>
          <label
            className={"study-material-upload-upload-material-modal-label"}
          >
            Description
          </label>
          <textarea
            className={"study-material-upload-upload-material-modal-textarea"}
            placeholder="Add a short description...."
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={"study-material-upload-upload-material-modal-field"}>
          <label
            className={"study-material-upload-upload-material-modal-label"}
          >
            File
          </label>
          <input
            type="url"
            className={"study-material-upload-upload-material-modal-input"}
            placeholder="paste link here..."
            value={link}
            onChange={(event) => setLink(event.target.value)}
          />
          <div
            className={
              "study-material-upload-upload-material-modal-file-dropzone"
            }
            onClick={handlePasteBoxClick}
            role="button"
            tabIndex={0}
          >
            <UploadCloud
              size={22}
              className={
                "study-material-upload-upload-material-modal-file-icon"
              }
            />
            <p
              className={
                "study-material-upload-upload-material-modal-file-text"
              }
            >
              <span
                className={
                  "study-material-upload-upload-material-modal-browse-link"
                }
              >
                Paste link here
              </span>
            </p>
          </div>
        </div>

        <div className={"study-material-upload-upload-material-modal-actions"}>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={submitting}>
            {submitting ? "Uploading..." : "Upload Material"}
          </Button>
        </div>
      </div>
    </div>
  );
}
