import { useEffect, useState } from "react";
import { CheckCircle2, Copy, UserPlus } from "lucide-react";
import {
  enrollCandidate,
  fetchEnrollmentBatches,
  fetchEnrollmentCourses,
} from "../../../../../api/mobilizer/enrollmentService";
import "./Enrollment.css";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  contact_number: "",
  email: "",
  gender: "",
  date_of_birth: "",
  blood_group: "",
  course_id: "",
  batch_id: "",
  enrollment_date: "",
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.message || fallback;
}

export default function Enrollment() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchEnrollmentCourses()
      .then((items) => {
        if (mounted) setCourses(items);
      })
      .catch((requestError) => {
        if (mounted)
          setError(getErrorMessage(requestError, "Unable to load courses."));
      })
      .finally(() => {
        if (mounted) setLoadingCourses(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "course_id" ? { batch_id: "" } : {}),
    }));
    setError("");
    setSuccess(null);

    if (field !== "course_id") return;
    setBatches([]);
    if (!value) return;

    setLoadingBatches(true);
    fetchEnrollmentBatches(value)
      .then(setBatches)
      .catch((requestError) =>
        setError(getErrorMessage(requestError, "Unable to load batches.")),
      )
      .finally(() => setLoadingBatches(false));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);
    setSubmitting(true);

    const payload = Object.fromEntries(
      Object.entries(form).filter(([, value]) => value !== ""),
    );

    try {
      const response = await enrollCandidate(payload);
      setSuccess(response.data);
      setForm(EMPTY_FORM);
      setBatches([]);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to enroll candidate."));
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = async () => {
    const credentials = success?.credentials;
    if (!credentials) return;
    await navigator.clipboard.writeText(
      `Login email: ${credentials.login_email}\nPassword: ${credentials.default_password}`,
    );
  };

  return (
    <div className="enrollment-page">
      <header className="enrollment-header">
        <div>
          <p className="enrollment-eyebrow">Candidate management</p>
          <h1>Enroll Candidate</h1>
          <p>Create a candidate profile and enroll them in an active batch.</p>
        </div>
        <div className="enrollment-header__icon">
          <UserPlus size={25} />
        </div>
      </header>

      {error && <div className="enrollment-alert enrollment-alert--error">{error}</div>}

      {success ? (
        <section className="enrollment-success" role="status">
          <CheckCircle2 size={42} />
          <h2>Candidate enrolled successfully</h2>
          <p>
            {success.candidate?.first_name} {success.candidate?.last_name} can
            now use the credentials below.
          </p>
          {success.credentials ? (
            <div className="enrollment-credentials">
              <div>
                <span>Login email</span>
                <strong>{success.credentials.login_email}</strong>
              </div>
              <div>
                <span>Default password</span>
                <strong>{success.credentials.default_password}</strong>
              </div>
              <button type="button" onClick={copyCredentials}>
                <Copy size={16} /> Copy credentials
              </button>
            </div>
          ) : (
            <p className="enrollment-note">
              This candidate already had an account, so no new password was generated.
            </p>
          )}
          <button
            type="button"
            className="enrollment-secondary-btn"
            onClick={() => setSuccess(null)}
          >
            Enroll another candidate
          </button>
        </section>
      ) : (
        <form className="enrollment-card" onSubmit={handleSubmit}>
          <div className="enrollment-section-heading">
            <h2>Candidate details</h2>
            <span>* Required</span>
          </div>
          <div className="enrollment-grid">
            <Field label="First name *" name="first_name" value={form.first_name} onChange={updateField("first_name")} required />
            <Field label="Last name" name="last_name" value={form.last_name} onChange={updateField("last_name")} />
            <Field label="Contact number *" name="contact_number" value={form.contact_number} onChange={updateField("contact_number")} required type="tel" />
            <Field label="Email *" name="email" value={form.email} onChange={updateField("email")} required type="email" />
            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={updateField("gender")}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </SelectField>
            <SelectField
              label="Blood group"
              name="blood_group"
              value={form.blood_group}
              onChange={updateField("blood_group")}
            >
              <option value="">Select blood group</option>
              {[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ].map((bloodGroup) => (
                <option key={bloodGroup} value={bloodGroup}>
                  {bloodGroup}
                </option>
              ))}
            </SelectField>
            <Field label="Date of birth" name="date_of_birth" value={form.date_of_birth} onChange={updateField("date_of_birth")} type="date" />
            <Field label="Enrollment date" name="enrollment_date" value={form.enrollment_date} onChange={updateField("enrollment_date")} type="date" />
          </div>

          <div className="enrollment-section-heading enrollment-section-heading--course">
            <h2>Course and batch</h2>
          </div>
          <div className="enrollment-grid">
            <SelectField label="Course *" name="course_id" value={form.course_id} onChange={updateField("course_id")} required disabled={loadingCourses}>
              <option value="">{loadingCourses ? "Loading courses..." : "Select a course"}</option>
              {courses.map((course) => <option key={course.course_id} value={course.course_id}>{course.course_name}</option>)}
            </SelectField>
            <SelectField label="Batch *" name="batch_id" value={form.batch_id} onChange={updateField("batch_id")} required disabled={!form.course_id || loadingBatches}>
              <option value="">{loadingBatches ? "Loading batches..." : "Select a batch"}</option>
              {batches.map((batch) => <option key={batch.batch_id} value={batch.batch_id} disabled={batch.status !== "ACTIVE"}>{batch.batch_name} ({batch.batch_code}) - {batch.status}</option>)}
            </SelectField>
          </div>
          {form.course_id && !loadingBatches && batches.length === 0 && <p className="enrollment-hint">No batches are available for this course.</p>}

          <div className="enrollment-form-footer">
            <p>Required fields are checked before enrollment.</p>
            <button className="enrollment-submit-btn" type="submit" disabled={submitting || loadingBatches}>
              {submitting ? "Enrolling..." : "Enroll candidate"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ label, name, value, onChange, ...props }) {
  return (
    <label className="enrollment-field" htmlFor={name}>
      <span>{label}</span>
      <input id={name} name={name} value={value} onChange={onChange} {...props} />
    </label>
  );
}

function SelectField({ label, name, children, ...props }) {
  return (
    <label className="enrollment-field" htmlFor={name}>
      <span>{label}</span>
      <select id={name} name={name} {...props}>{children}</select>
    </label>
  );
}