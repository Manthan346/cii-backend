import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { Button, Dropdown } from "../../../shared";
import { taskAssigneeOptions } from "../../../data";
import "./AssignTaskModal.css";

// Local-only for now — no create-task endpoint exists. Batch/Course
// options are mocked; swap for real data (same fetchCoursesAndBatches
// pattern used in Study Material) once available.
const assignToOptions = taskAssigneeOptions.filter(
  (o) => !o.toLowerCase().startsWith("all "),
);
const batchOptions = ["DS-24", "PY-18", "SQL-20"];
const courseOptions = ["Data Science", "Python programming", "Business comm."];

export default function AssignTaskModal({ onCancel, onAssign }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState(assignToOptions[0] ?? "");
  const [batch, setBatch] = useState(batchOptions[0] ?? "");
  const [course, setCourse] = useState(courseOptions[0] ?? "");
  const [dueDate, setDueDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);

  const handleFileClick = () => {
    // No real upload wired — placeholder, mirrors the "paste link"
    // pattern used in Study Material's modal.
    setFileName("reference-material.pdf");
  };

  const handleSubmit = () => {
    setError(null);
    if (!title.trim()) return setError("Task title is required.");
    if (!dueDate) return setError("Due date is required.");

    onAssign?.({
      title: title.trim(),
      description: description.trim(),
      assignTo,
      batch,
      course,
      dueDate,
      referenceMaterial: fileName || null,
    });
  };

  return (
    <div
      className="task-assigned-assign-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Assign task"
    >
      <div className="task-assigned-assign-modal-modal">
        <div className="task-assigned-assign-modal-header">
          <div>
            <h2 className="task-assigned-assign-modal-title">Assign Task</h2>
            <p className="task-assigned-assign-modal-subtitle">
              Create and assign a new task to a candidate or batch
            </p>
          </div>
          <button
            type="button"
            className="task-assigned-assign-modal-close-btn"
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {error && <p className="task-assigned-assign-modal-error">{error}</p>}

        <div className="task-assigned-assign-modal-field">
          <label>Task Title</label>
          <input
            type="text"
            placeholder="e.g. C.S. Project"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="task-assigned-assign-modal-field">
          <label>Task Description</label>
          <textarea
            rows={3}
            placeholder="e.g. ................................"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="task-assigned-assign-modal-row">
          <Dropdown
            label="Assign To"
            options={assignToOptions}
            value={assignTo}
            onChange={setAssignTo}
          />
          <Dropdown
            label="Batch"
            options={batchOptions}
            value={batch}
            onChange={setBatch}
          />
        </div>

        <div className="task-assigned-assign-modal-row">
          <Dropdown
            label="Course"
            options={courseOptions}
            value={course}
            onChange={setCourse}
          />
          <div className="task-assigned-assign-modal-field">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="task-assigned-assign-modal-upload-section">
          <p className="task-assigned-assign-modal-upload-label">
            Reference Material (Optional)
          </p>
          <div
            className="task-assigned-assign-modal-dropzone"
            role="button"
            tabIndex={0}
            onClick={handleFileClick}
          >
            <UploadCloud size={22} />
            <span className="task-assigned-assign-modal-upload-link">
              {fileName || "Click to upload"}
            </span>
          </div>
        </div>

        <div className="task-assigned-assign-modal-actions">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Assign Task
          </Button>
        </div>
      </div>
    </div>
  );
}
