import { useState } from "react";
import styles from "./ApplyModal.module.css";
import { CloseIcon, CheckIcon } from "../icons.jsx";
import { submitJobApplication } from "../../../../../api/homepage/placementPageService.js";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  resume: "",
  graduationYear: "",
  cgpa: "",
  percentage: "",
  source: "Website",
};

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "Required";
  if (!form.lastName.trim()) errors.lastName = "Required";
  if (!form.email.trim()) {
    errors.email = "Required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email";
  }
  if (!form.phone.trim()) {
    errors.phone = "Required";
  } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
    errors.phone = "Enter a 10-digit number";
  }
  if (!form.resume.trim()) {
    errors.resume = "Required";
  } else {
    try {
      const resumeUrl = new URL(form.resume.trim());
      if (!/^https?:$/.test(resumeUrl.protocol)) throw new Error();
    } catch {
      errors.resume = "Enter a valid resume URL";
    }
  }
  if (!/^\d{4}$/.test(form.graduationYear)) {
    errors.graduationYear = "Enter a valid year";
  }
  if (!form.cgpa || Number(form.cgpa) < 0 || Number(form.cgpa) > 10) {
    errors.cgpa = "Enter CGPA between 0 and 10";
  }
  if (
    !form.percentage ||
    Number(form.percentage) < 0 ||
    Number(form.percentage) > 100
  ) {
    errors.percentage = "Enter percentage between 0 and 100";
  }
  if (!form.source.trim()) errors.source = "Required";
  return errors;
}

export default function ApplyModal({ job, onClose, onSubmitted }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await submitJobApplication(job.id, {
        applicant_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        contact_no: form.phone.replace(/\D/g, ""),
        resume: form.resume.trim(),
        graduation_year: Number(form.graduationYear),
        cgpa: Number(form.cgpa),
        percentage: Number(form.percentage),
        source: form.source.trim(),
      });
      setApplicationId(response.data?.application_id || "");
      setSubmitted(true);
      onSubmitted?.({
        job,
        form,
        applicationId: response.data?.application_id,
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Unable to submit your application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Apply for ${job.title}`}
    >
      <div className={styles.modal}>
        {!submitted ? (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Apply for {job.title} Role</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className={styles.input}
                    value={form.firstName}
                    onChange={updateField("firstName")}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <span className={styles.error}>{errors.firstName}</span>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className={styles.input}
                    value={form.lastName}
                    onChange={updateField("lastName")}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <span className={styles.error}>{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email}</span>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">
                    Mobile Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && (
                    <span className={styles.error}>{errors.phone}</span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Job Role</label>
                <input
                  className={styles.inputReadOnly}
                  value={job.title}
                  readOnly
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Company</label>
                  <input
                    className={styles.inputReadOnly}
                    value={job.company}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Sector</label>
                  <input
                    className={styles.inputReadOnly}
                    value={job.sector}
                    readOnly
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="resume">
                  Resume URL
                </label>
                <input
                  id="resume"
                  type="url"
                  className={styles.input}
                  value={form.resume}
                  onChange={updateField("resume")}
                  placeholder="https://example.com/resume.pdf"
                />
                {errors.resume && (
                  <span className={styles.error}>{errors.resume}</span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="graduationYear">
                    Graduation Year
                  </label>
                  <input
                    id="graduationYear"
                    type="number"
                    className={styles.input}
                    value={form.graduationYear}
                    onChange={updateField("graduationYear")}
                    placeholder="2024"
                  />
                  {errors.graduationYear && (
                    <span className={styles.error}>
                      {errors.graduationYear}
                    </span>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="source">
                    Source
                  </label>
                  <input
                    id="source"
                    className={styles.input}
                    value={form.source}
                    onChange={updateField("source")}
                    placeholder="LinkedIn"
                  />
                  {errors.source && (
                    <span className={styles.error}>{errors.source}</span>
                  )}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cgpa">
                    CGPA
                  </label>
                  <input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    className={styles.input}
                    value={form.cgpa}
                    onChange={updateField("cgpa")}
                    placeholder="8.50"
                  />
                  {errors.cgpa && (
                    <span className={styles.error}>{errors.cgpa}</span>
                  )}
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="percentage">
                    Percentage
                  </label>
                  <input
                    id="percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    className={styles.input}
                    value={form.percentage}
                    onChange={updateField("percentage")}
                    placeholder="85.50"
                  />
                  {errors.percentage && (
                    <span className={styles.error}>{errors.percentage}</span>
                  )}
                </div>
              </div>

              {submitError && (
                <span className={styles.error}>{submitError}</span>
              )}

              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.successState}>
            <div className={styles.checkCircle}>
              <CheckIcon />
            </div>
            <h2 className={styles.successTitle}>Application Submitted!</h2>
            <p className={styles.successSubtitle}>
              Your application has been successfully submitted.
            </p>
            {applicationId && (
              <p className={styles.successSubtitle}>
                Application ID: {applicationId}
              </p>
            )}
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
