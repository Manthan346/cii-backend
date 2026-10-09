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

const ASSESSMENT_FIELDS = {
  batch_code: "batch_id",
  title: "title",
  assessment_desc: "assessment_desc",
  assessment_type: "assessment_type",
  assessment_date: "assessment_date",
  no_of_questions: "questions",
  assessment_duration: "assessment_duration",
  assessment_link: "assessment_link",
};

export function validateAssessment(form) {
  const errors = {};
  if (!form.batch_id) errors.batch_code = "Please select a batch.";
  if (!form.title?.trim()) errors.title = "Title is required.";
  else if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }
  if (!form.assessment_type) {
    errors.assessment_type = "Please select an assessment type.";
  }
  if (!form.assessment_date) {
    errors.assessment_date = "Assessment date is required.";
  } else {
    const match = form.assessment_date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (
        date.getUTCFullYear() !== Number(year) ||
        date.getUTCMonth() !== Number(month) - 1 ||
        date.getUTCDate() !== Number(day)
      ) {
        errors.assessment_date = "Enter a valid assessment date.";
      }
    } else {
      errors.assessment_date = "Enter a valid assessment date.";
    }
  }
  if (
    !form.no_of_questions ||
    !Number.isInteger(Number(form.no_of_questions)) ||
    Number(form.no_of_questions) < 1
  ) {
    errors.no_of_questions = "Enter at least 1 question.";
  }
  if (
    !form.assessment_duration ||
    !Number.isInteger(Number(form.assessment_duration)) ||
    Number(form.assessment_duration) < 1
  ) {
    errors.assessment_duration = "Duration must be at least 1 minute.";
  }
  if (!form.assessment_desc?.trim()) {
    errors.assessment_desc = "Assessment description is required.";
  } else if (form.assessment_desc.trim().length < 5) {
    errors.assessment_desc = "Description must be at least 5 characters.";
  }
  if (form.assessment_link?.trim()) {
    try {
      const link = new URL(form.assessment_link.trim());
      if (!["http:", "https:"].includes(link.protocol)) {
        errors.assessment_link = "Enter a valid http or https link.";
      }
    } catch {
      errors.assessment_link = "Enter a valid http or https link.";
    }
  }
  return errors;
}

export function getAssessmentFieldErrors(requestError) {
  const details = requestError.response?.data?.details;
  if (!Array.isArray(details)) return {};

  return details.reduce((errors, detail) => {
    const fieldNames = Array.isArray(detail.fields)
      ? detail.fields
      : [detail.fields];
    fieldNames.forEach((fieldName) => {
      const field = Object.keys(ASSESSMENT_FIELDS).find(
        (key) => ASSESSMENT_FIELDS[key] === fieldName,
      );
      if (field && detail.message) errors[field] = detail.message;
    });
    return errors;
  }, {});
}

export function AssessmentFields({
  form,
  setForm,
  readOnly = false,
  batches,
  errors = {},
  setFieldErrors,
}) {
  const update = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors?.((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };
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
  const batchSelectOptions = batches
    ? batches.some((batch) => batch.batch_code === form.batch_code)
      ? batches
      : form.batch_id && form.batch_code
        ? [...batches, { batch_code: form.batch_code, batch_id: form.batch_id }]
        : batches
    : availableBatchOptions.map((batch_code) => ({ batch_code }));
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
            <>
              <select
                value={form[name] ?? ""}
                onChange={(event) => {
                  const selectedBatch = batchSelectOptions.find(
                    (batch) => batch.batch_code === event.target.value,
                  );
                  setForm((current) => ({
                    ...current,
                    batch_code: event.target.value,
                    batch_id:
                      selectedBatch?.batch_id ??
                      selectedBatch?.batchId ??
                      selectedBatch?.id ??
                      "",
                  }));
                  setFieldErrors?.((current) => {
                    if (!current.batch_code) return current;
                    const next = { ...current };
                    delete next.batch_code;
                    return next;
                  });
                }}
                aria-invalid={Boolean(errors.batch_code)}
                aria-describedby={
                  errors.batch_code ? "assessment-batch-error" : undefined
                }
              >
                <option value="">Please select a batch</option>
                {batchSelectOptions.map((option) => (
                  <option key={option.batch_code} value={option.batch_code}>
                    {option.batch_code}
                  </option>
                ))}
              </select>
              {errors.batch_code && (
                <small
                  id="assessment-batch-error"
                  className="assessment-field-error"
                >
                  {errors.batch_code}
                </small>
              )}
            </>
          ) : type === "select" ? (
            <select
              value={form[name]}
              onChange={(event) => update(name, event.target.value)}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name] ? `assessment-${name}-error` : undefined
              }
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
              value={form[name] ?? ""}
              onChange={(event) => update(name, event.target.value)}
              min={
                name === "title"
                  ? 3
                  : name === "no_of_questions" ||
                      name === "assessment_duration"
                    ? 1
                    : undefined
              }
              step={
                name === "no_of_questions" ||
                name === "assessment_duration"
                  ? 1
                  : undefined
              }
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name] ? `assessment-${name}-error` : undefined
              }
            />
          )}
          {!readOnly && name !== "batch_code" && errors[name] && (
            <small
              id={`assessment-${name}-error`}
              className="assessment-field-error"
            >
              {errors[name]}
            </small>
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
            minLength={5}
            aria-invalid={Boolean(errors.assessment_desc)}
            aria-describedby={
              errors.assessment_desc
                ? "assessment-assessment_desc-error"
                : undefined
            }
          />
        )}
        {!readOnly && errors.assessment_desc && (
          <small
            id="assessment-assessment_desc-error"
            className="assessment-field-error"
          >
            {errors.assessment_desc}
          </small>
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
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchMyBatches()
      .then(setBatches)
      .catch(() => setError("Unable to load batch codes."));
  }, []);

  const handleSubmit = async () => {
    const validationErrors = validateAssessment(form);
    setFieldErrors(validationErrors);
    setError("");
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (requestError) {
      const serverErrors = getAssessmentFieldErrors(requestError);
      setFieldErrors(serverErrors);
      setError(
        Object.keys(serverErrors).length
          ? ""
          : requestError.response?.data?.message ||
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
        <AssessmentFields
          form={form}
          setForm={setForm}
          batches={batches}
          errors={fieldErrors}
          setFieldErrors={setFieldErrors}
        />
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
