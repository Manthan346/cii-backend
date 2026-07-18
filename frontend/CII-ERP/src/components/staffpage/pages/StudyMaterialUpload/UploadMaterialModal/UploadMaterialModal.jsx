import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { Button } from "../../../shared";
import styles from "./UploadMaterialModal.module.css";

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
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const handleBrowseClick = () => {
    // No real backend to upload to here - just simulate a selected file
    // so the "Upload Material" button has something to reference.
    setFileName((prev) => prev || "selected-file.pdf");
  };

  const handleSave = () => {
    onSave?.({ title, course, description, fileName });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Upload study material">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Upload Study Material</h2>
          <button type="button" className={styles.closeBtn} onClick={onCancel} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            placeholder="eg data science module 7-notes"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Course</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Data science"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description(optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="Add a short description...."
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>File</label>
          <div className={styles.fileDropzone} onClick={handleBrowseClick}>
            <UploadCloud size={22} className={styles.fileIcon} />
            <p className={styles.fileText}>
              {fileName || (
                <>
                  Drag file here or <span className={styles.browseLink}>Browse</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
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
