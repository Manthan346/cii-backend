import React, { useState } from "react";
import { Calendar } from "lucide-react";
import "./CreateJobForm.css";

const DEPARTMENT_OPTIONS = [
  "Design",
  "L'Oréal",
  "DSCI",
  "Jubilant",
  "EHL & ITC",
];
const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
];
const WORK_MODE_OPTIONS = ["On-site", "Hybrid", "Remote"];

const INITIAL_FORM = {
  companyName: "",
  jobTitle: "",
  department: DEPARTMENT_OPTIONS[0],
  role: "",
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  experience: "",
  vacancies: "",
  city: "",
  state: "",
  workMode: WORK_MODE_OPTIONS[0],
  description: "",
  qualification: "",
  minPercentage: "",
  salaryAmount: "",
  applicationLink: "",
  deadline: "",
};

const normalizeDateForInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

const normalizeWorkModeForUi = (mode) => {
  const normalized = String(mode ?? "")
    .trim()
    .toLowerCase();
  if (["online", "remote"].includes(normalized)) return "Remote";
  if (["offline", "onsite", "on-site", "on site"].includes(normalized))
    return "On-site";
  if (["hybrid"].includes(normalized)) return "Hybrid";
  return "Hybrid";
};

const buildInitialForm = (initialValues = {}) => ({
  ...INITIAL_FORM,
  companyName: initialValues.companyName ?? initialValues.company_name ?? "",
  jobTitle: initialValues.jobRole ?? initialValues.job_role ?? "",
  department:
    initialValues.department ?? initialValues.sector ?? DEPARTMENT_OPTIONS[0],
  role: initialValues.role ?? initialValues.job_role ?? "",
  employmentType:
    initialValues.employmentType ??
    initialValues.employment_type ??
    EMPLOYMENT_TYPE_OPTIONS[0],
  experience: initialValues.experience ?? "",
  vacancies: initialValues.vacancy ?? "",
  city: initialValues.location ?? "",
  state: initialValues.state ?? "",
  workMode: normalizeWorkModeForUi(
    initialValues.mode ?? initialValues.work_mode,
  ),
  description: initialValues.description ?? initialValues.job_description ?? "",
  qualification:
    initialValues.eligibility?.qualification ??
    initialValues.eligible_qualification ??
    "",
  minPercentage:
    initialValues.eligibility?.minPercentage ??
    initialValues.eligible_percentage_cgpa ??
    "",
  salaryAmount: initialValues.salary ?? "",
  applicationLink:
    initialValues.applicationLink ?? initialValues.application_link ?? "",
  deadline: normalizeDateForInput(
    initialValues.last_date_to_apply ?? initialValues.deadline,
  ),
});

const todayFormatted = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * CreateJobForm
 *
 * "Create Job" form, opened from JobManagementList's floating button
 * (or re-opened by a row's "Edit" action - see JobManagement.jsx).
 *
 * Trimmed from the original 9-section reference per request:
 *  - Sections 4 (Responsibilities), 5 (Required Skills), 6 (Preferred
 *    Skills) are removed entirely.
 *  - Eligibility keeps only Qualification + Minimum Percentage
 *    (Passing Year removed).
 *  - Salary is a single Amount input - no Not Disclosed / Range /
 *    Fixed toggle.
 *  - Deadline Date uses a yyyy/mm/dd placeholder/format instead of
 *    dd-mm-yyyy.
 *
 * Sections are renumbered 1-6 to match what's actually left:
 *   1 Basic Information, 2 Location, 3 Job Description,
 *   4 Eligibility, 5 Salary, 6 Application Deadline.
 */
const CreateJobForm = ({
  onCancel,
  onSubmit,
  initialValues = null,
  isEdit = false,
}) => {
  const [form, setForm] = useState(() => buildInitialForm(initialValues));

  React.useEffect(() => {
    setForm(buildInitialForm(initialValues));
  }, [initialValues]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleWorkModeSelect = (mode) => {
    setForm((prev) => ({ ...prev, workMode: mode }));
  };

  const mapWorkModeToApiValue = (mode) => {
    switch (mode) {
      case "Off-site":
      case "Offline":
        return "offline";
      case "Remote":
        return "online";
      case "Hybrid":
      default:
        return "hybrid";
    }
  };

  const buildPayload = () => {
    const payload = {
      company_name: form.companyName.trim(),
      sector: form.department.trim(),
      vacancy: Number(form.vacancies) || 0,
      location: (form.city || form.state || "").trim(),
      job_role: form.jobTitle.trim(),
      job_description: form.description.trim(),
      salary: form.salaryAmount.trim(),
      employment_type: form.employmentType,
      work_mode: mapWorkModeToApiValue(form.workMode),
      eligible_qualification: form.qualification.trim(),
      eligible_percentage_cgpa: form.minPercentage.trim(),
      last_date_to_apply: form.deadline,
      experience: form.experience.trim(),
    };

    if (form.applicationLink && form.applicationLink.trim()) {
      payload.application_link = form.applicationLink.trim();
    }

    return payload;
  };

  const handleSaveDraft = () => onSubmit(buildPayload(), isEdit);
  const handlePublish = () => onSubmit(buildPayload(), isEdit);

  return (
    <div className="create-job-form">
      <nav className="create-job-form__breadcrumb">
        <button
          type="button"
          className="create-job-form__breadcrumb-link"
          onClick={onCancel}
        >
          Job Management
        </button>
        <span className="create-job-form__breadcrumb-sep">/</span>
        <span>Create Job</span>
      </nav>

      <header className="create-job-form__header">
        <h1 className="create-job-form__title">Create Job</h1>
        <p className="create-job-form__subtitle">
          Fill in the details below to post a new opportunity for candidates
        </p>
      </header>

      {/* 1. Basic Information */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">1</span>
          Basic Information
        </h2>

        <div className="create-job-form__grid">
          <label className="create-job-form__field">
            <span className="create-job-form__label">Company Name</span>
            <input
              type="text"
              placeholder="e.g. TechSolutions Inc"
              value={form.companyName}
              onChange={handleChange("companyName")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Job Title</span>
            <input
              type="text"
              placeholder="e.g. Junior Graphic Designer"
              value={form.jobTitle}
              onChange={handleChange("jobTitle")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Department</span>
            <select
              value={form.department}
              onChange={handleChange("department")}
              className="create-job-form__input"
            >
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Role</span>
            <input
              type="text"
              placeholder="eg. Graphic Design"
              value={form.role}
              onChange={handleChange("role")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Employment Type</span>
            <select
              value={form.employmentType}
              onChange={handleChange("employmentType")}
              className="create-job-form__input"
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Experience Required</span>
            <input
              type="text"
              placeholder="eg. 0-1 years"
              value={form.experience}
              onChange={handleChange("experience")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Number of vacancies</span>
            <input
              type="number"
              min="0"
              placeholder="2"
              value={form.vacancies}
              onChange={handleChange("vacancies")}
              className="create-job-form__input"
            />
          </label>
        </div>
      </section>

      {/* 2. Location */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">2</span>
          Location
        </h2>

        <div className="create-job-form__grid">
          <label className="create-job-form__field">
            <span className="create-job-form__label">City</span>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={form.city}
              onChange={handleChange("city")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">State</span>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={form.state}
              onChange={handleChange("state")}
              className="create-job-form__input"
            />
          </label>
        </div>

        <div className="create-job-form__field" style={{ marginTop: 14 }}>
          <span className="create-job-form__label">Work Mode</span>
          <div className="create-job-form__segmented">
            {WORK_MODE_OPTIONS.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`create-job-form__segmented-option ${form.workMode === mode ? "create-job-form__segmented-option--active" : ""}`}
                onClick={() => handleWorkModeSelect(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Job Description */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">3</span>
          Job Description
        </h2>

        <textarea
          rows={5}
          placeholder="Describe the role, day-to-day work, and what success looks like..."
          value={form.description}
          onChange={handleChange("description")}
          className="create-job-form__textarea"
        />
      </section>

      {/* 4. Eligibility (Passing Year removed) */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">4</span>
          Eligibility
        </h2>

        <div className="create-job-form__grid">
          <label className="create-job-form__field">
            <span className="create-job-form__label">Qualification</span>
            <input
              type="text"
              placeholder="e.g. B.Sc"
              value={form.qualification}
              onChange={handleChange("qualification")}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">
              Minimum Percentage (optional)
            </span>
            <input
              type="text"
              placeholder="e.g. 60%"
              value={form.minPercentage}
              onChange={handleChange("minPercentage")}
              className="create-job-form__input"
            />
          </label>
        </div>
      </section>

      {/* 5. Salary (amount only, no Not Disclosed/Range/Fixed toggle) */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">5</span>
          Salary (optional)
        </h2>

        <label className="create-job-form__field">
          <span className="create-job-form__label">Amount</span>
          <input
            type="text"
            placeholder="e.g. ₹4,50,000 / year or 3,00,000 - ₹5,00,000"
            value={form.salaryAmount}
            onChange={handleChange("salaryAmount")}
            className="create-job-form__input"
          />
        </label>
      </section>

      {/* 6. Application Deadline */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">6</span>
          Application Deadline
        </h2>

        <label className="create-job-form__field" style={{ maxWidth: 260 }}>
          <span className="create-job-form__label">Deadline Date</span>
          <div className="create-job-form__date-input">
            <input
              type="date"
              value={form.deadline}
              onChange={handleChange("deadline")}
              className="create-job-form__input create-job-form__input--date"
            />
            <Calendar size={16} className="create-job-form__date-icon" />
          </div>
        </label>
      </section>

      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">7</span>
          Application Link (optional)
        </h2>

        <label className="create-job-form__field">
          <span className="create-job-form__label">
            External application URL
          </span>
          <input
            type="url"
            placeholder="https://example.com/careers"
            value={form.applicationLink}
            onChange={handleChange("applicationLink")}
            className="create-job-form__input"
          />
        </label>
      </section>

      <footer className="create-job-form__footer">
        <p className="create-job-form__footer-note">
          Job will be visible to candidates only after publishing.
        </p>
        <div className="create-job-form__footer-actions">
          <button
            type="button"
            className="create-job-form__btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="create-job-form__btn create-job-form__btn--ghost"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button
            type="button"
            className="create-job-form__btn create-job-form__btn--primary"
            onClick={handlePublish}
          >
            Publish Job
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CreateJobForm;
