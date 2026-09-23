import { useState } from "react";
import "./CreateCompanyModal.css";

const INITIAL_VALUES = {
  company_name: "",
  company_description: "",
};

export default function CreateCompanyModal({
  onClose,
  onSubmit,
  error,
  submitting,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      company_name: values.company_name.trim(),
      company_description: values.company_description.trim(),
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
            <h2>Create company</h2>
            <p>Add a company to your center.</p>
          </div>
          <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label>
          Company name
          <input
            name="company_name"
            value={values.company_name}
            onChange={updateValue}
            placeholder="e.g. TechNova Solutions"
            minLength={3}
            maxLength={100}
            required
          />
        </label>

        <label>
          Company description
          <textarea
            name="company_description"
            value={values.company_description}
            onChange={updateValue}
            placeholder="Describe the company"
            minLength={10}
            rows={4}
            required
          />
        </label>

        {error && <p className="admin-modal-error">{error}</p>}

        <div className="admin-modal-actions">
          <button className="admin-modal-secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="admin-modal-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create company"}
          </button>
        </div>
      </form>
    </div>
  );
}
