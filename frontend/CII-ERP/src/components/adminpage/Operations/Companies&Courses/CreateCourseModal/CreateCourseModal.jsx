import { useState } from "react";
import "./CreateCourseModal.css";

const INITIAL_VALUES = {
  company_id: "",
  course_name: "",
  course_desc: "",
  course_duration: "",
  course_mode: "offline",
};

export default function CreateCourseModal({
  company,
  companies,
  onClose,
  onSubmit,
  error,
  submitting,
}) {
  const [values, setValues] = useState({
    ...INITIAL_VALUES,
    company_id: company.company_id,
  });

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      company_id: values.company_id,
      course_name: values.course_name.trim(),
      course_desc: values.course_desc.trim(),
      course_duration: values.course_duration.trim(),
      course_mode: values.course_mode,
    });
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="admin-modal"
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h2>Create course</h2>
            <p>For {company.company_name}</p>
          </div>
          <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label>
          Company
          <select name="company_id" value={values.company_id} onChange={updateValue} required>
            {companies.map((item) => (
              <option key={item.company_id} value={item.company_id}>
                {item.company_name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Course name
          <input
            name="course_name"
            value={values.course_name}
            onChange={updateValue}
            placeholder="e.g. Full Stack Web Development"
            minLength={3}
            maxLength={100}
            required
          />
        </label>

        <label>
          Course description
          <textarea
            name="course_desc"
            value={values.course_desc}
            onChange={updateValue}
            placeholder="Describe the course"
            minLength={10}
            rows={4}
            required
          />
        </label>

        <div className="admin-modal-form-grid">
          <label>
            Duration
            <input
              name="course_duration"
              value={values.course_duration}
              onChange={updateValue}
              placeholder="e.g. 6 Months"
              maxLength={100}
              required
            />
          </label>
          <label>
            Mode
            <select name="course_mode" value={values.course_mode} onChange={updateValue} required>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
        </div>

        {error && <p className="admin-modal-error">{error}</p>}

        <div className="admin-modal-actions">
          <button className="admin-modal-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-modal-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
}
