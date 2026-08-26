import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './CreateJobForm.css';

const DEPARTMENT_OPTIONS = ['Design', "L'Oréal", 'DSCI', 'Jubilant', 'EHL & ITC'];
const EMPLOYMENT_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const WORK_MODE_OPTIONS = ['On-site', 'Hybrid', 'Remote'];

const INITIAL_FORM = {
  jobTitle: '',
  department: DEPARTMENT_OPTIONS[0],
  role: '',
  employmentType: EMPLOYMENT_TYPE_OPTIONS[0],
  experience: '',
  vacancies: '',
  city: '',
  state: '',
  workMode: WORK_MODE_OPTIONS[0],
  description: '',
  qualification: '',
  minPercentage: '',
  salaryAmount: '',
  deadline: '',
};

const todayFormatted = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

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
const CreateJobForm = ({ onCancel, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleWorkModeSelect = (mode) => {
    setForm((prev) => ({ ...prev, workMode: mode }));
  };

  const buildPayload = (status) => ({
    jobRole: form.jobTitle,
    sector: form.department,
    location: form.city,
    state: form.state,
    type: form.employmentType,
    companyName: '—',
    mode: form.workMode,
    vacancy: Number(form.vacancies) || 0,
    applications: 0,
    status,
    postedDate: todayFormatted(),
    department: form.department,
    role: form.role,
    employmentType: form.employmentType,
    experience: form.experience,
    salary: form.salaryAmount,
    description: form.description,
    requiredSkills: [],
    preferredSkills: [],
    responsibilities: [],
    eligibility: { qualification: form.qualification, minPercentage: form.minPercentage },
    deadline: form.deadline,
    stats: { totalApplications: 0, shortlisted: 0, interviewed: 0, hired: 0 },
  });

  const handleSaveDraft = () => onSubmit(buildPayload('Draft'));
  const handlePublish = () => onSubmit(buildPayload('Published'));

  return (
    <div className="create-job-form">
      <nav className="create-job-form__breadcrumb">
        <button type="button" className="create-job-form__breadcrumb-link" onClick={onCancel}>
          Job Management
        </button>
        <span className="create-job-form__breadcrumb-sep">/</span>
        <span>Create Job</span>
      </nav>

      <header className="create-job-form__header">
        <h1 className="create-job-form__title">Create Job</h1>
        <p className="create-job-form__subtitle">Fill in the details below to post a new opportunity for candidates</p>
      </header>

      {/* 1. Basic Information */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">1</span>
          Basic Information
        </h2>

        <div className="create-job-form__grid">
          <label className="create-job-form__field">
            <span className="create-job-form__label">Job Title</span>
            <input
              type="text"
              placeholder="e.g. Junior Graphic Designer"
              value={form.jobTitle}
              onChange={handleChange('jobTitle')}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Department</span>
            <select value={form.department} onChange={handleChange('department')} className="create-job-form__input">
              {DEPARTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Role</span>
            <input
              type="text"
              placeholder="eg. Graphic Design"
              value={form.role}
              onChange={handleChange('role')}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Employment Type</span>
            <select value={form.employmentType} onChange={handleChange('employmentType')} className="create-job-form__input">
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Experience Required</span>
            <input
              type="text"
              placeholder="eg. 0-1 years"
              value={form.experience}
              onChange={handleChange('experience')}
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
              onChange={handleChange('vacancies')}
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
              onChange={handleChange('city')}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">State</span>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={form.state}
              onChange={handleChange('state')}
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
                className={`create-job-form__segmented-option ${form.workMode === mode ? 'create-job-form__segmented-option--active' : ''}`}
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
          onChange={handleChange('description')}
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
              onChange={handleChange('qualification')}
              className="create-job-form__input"
            />
          </label>

          <label className="create-job-form__field">
            <span className="create-job-form__label">Minimum Percentage (optional)</span>
            <input
              type="text"
              placeholder="e.g. 60%"
              value={form.minPercentage}
              onChange={handleChange('minPercentage')}
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
            onChange={handleChange('salaryAmount')}
            className="create-job-form__input"
          />
        </label>
      </section>

      {/* 6. Application Deadline (yyyy/mm/dd) */}
      <section className="create-job-form__section">
        <h2 className="create-job-form__section-title">
          <span className="create-job-form__badge">6</span>
          Application Deadline
        </h2>

        <label className="create-job-form__field" style={{ maxWidth: 260 }}>
          <span className="create-job-form__label">Deadline Date</span>
          <div className="create-job-form__date-input">
            <input
              type="text"
              placeholder="yyyy/mm/dd"
              value={form.deadline}
              onChange={handleChange('deadline')}
              className="create-job-form__input create-job-form__input--date"
            />
            <Calendar size={16} className="create-job-form__date-icon" />
          </div>
        </label>
      </section>

      <footer className="create-job-form__footer">
        <p className="create-job-form__footer-note">Job will be visible to candidates only after publishing.</p>
        <div className="create-job-form__footer-actions">
          <button type="button" className="create-job-form__btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="create-job-form__btn create-job-form__btn--ghost" onClick={handleSaveDraft}>Save Draft</button>
          <button type="button" className="create-job-form__btn create-job-form__btn--primary" onClick={handlePublish}>Publish Job</button>
        </div>
      </footer>
    </div>
  );
};

export default CreateJobForm;
