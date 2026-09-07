import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../shared";
import { batchOptions } from "../../../data";
import { fetchMyBatches } from "../../../../../../api/trainer/assessmentService";
import "../AssessmentDialog/AssessmentDialog.css";
import "./CreateAssessment.css";

const emptyAssessment = {
  batch_code: "",
  batch_id: "",
  title: "",
  assessment_desc: "",
  assessment_type: "TECHNICAL",
  assessment_date: "",
  no_of_questions: "",
  assessment_duration: "",
  assessment_link: "",
};

export function AssessmentFields({ form, setForm, readOnly = false, batches }) {
  const update = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));
  const items = [
    ["batch_code", "Batch Code", "batch"],
    ["title", "Title", "text"],
    ["assessment_type", "Assessment type", "select"],
    ["assessment_date", "Assessment date", "date"],
    ["no_of_questions", "No. of questions", "number"],
    ["assessment_duration", "Duration (minutes)", "number"],
    ["assessment_link", "Assessment link", "url"],
  ];
  const availableBatchOptions = [
    ...new Set(
      [
        form.batch_code,
        ...batchOptions.filter((option) => option !== "All Batches"),
      ].filter(Boolean),
    ),
  ];
  return (
    <div className="assessment-dialog-fields">
      {readOnly && (
        <label>
          <span>Course</span>
          <strong>{form.course || "-"}</strong>
        </label>
      )}
      {items.map(([name, label, type]) => (
        <label key={name}>
          <span>{label}</span>
          {readOnly ? (
            <strong>
              {name === "batch_code"
                ? form.batch_code || form.batch_id || "-"
                : name === "assessment_date"
                  ? form.assessment_date_display || form[name] || "-"
                  : form[name] || "-"}
            </strong>
          ) : name === "batch_code" ? (
            <select
              value={form[name]}
              onChange={(event) => {
                const selectedBatch = batches?.find(
                  (batch) => batch.batch_code === event.target.value,
                );
                setForm((current) => ({
                  ...current,
                  batch_code: event.target.value,
                  batch_id: selectedBatch?.batch_id ?? current.batch_id,
                }));
              }}
              required
            >
              <option value="">Select batch code</option>
              {(
                batches ??
                availableBatchOptions.map((batch_code) => ({ batch_code }))
              ).map((option) => (
                <option key={option.batch_code} value={option.batch_code}>
                  {option.batch_code}
                </option>
              ))}
            </select>
          ) : type === "select" ? (
            <select
              value={form[name]}
              onChange={(event) => update(name, event.target.value)}
              required
            >
              <option value="APTITUDE">Aptitude</option>
              <option value="TECHNICAL">Technical</option>
              <option value="COMMUNICATION">Communication</option>
              <option value="MOCK_INTERVIEW">Mock interview</option>
              <option value="FINAL_ASSESSMENT">Final assessment</option>
            </select>
          ) : (
            <input
              type={type}
              value={form[name]}
              onChange={(event) => update(name, event.target.value)}
              required
            />
          )}
        </label>
      ))}
      <label className="assessment-dialog-field-wide">
        <span>Assessment description</span>
        {readOnly ? (
          <strong>{form.assessment_desc || "-"}</strong>
        ) : (
          <textarea
            rows="3"
            value={form.assessment_desc}
            onChange={(event) => update("assessment_desc", event.target.value)}
            required
          />
        )}
      </label>
    </div>
  );
}

export default function CreateAssessment({ onClose, onSubmit }) {
  const [form, setForm] = useState(emptyAssessment);
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyBatches()
      .then(setBatches)
      .catch(() => setError("Unable to load batch codes."));
  }, []);

  const handleSubmit = async () => {
    if (!form.batch_id) return setError("Please select a batch code.");
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create assessment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="assessment-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Create assessment"
    >
      <div className="assessment-dialog">
        <div className="assessment-dialog-header">
          <div>
            <p>Trainer resources</p>
            <h2>Create assessment</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close create assessment"
          >
            <X size={18} />
          </button>
        </div>
        {error && <p className="assessment-dialog-error">{error}</p>}
        <AssessmentFields form={form} setForm={setForm} batches={batches} />
        <div className="assessment-dialog-actions">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create assessment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
