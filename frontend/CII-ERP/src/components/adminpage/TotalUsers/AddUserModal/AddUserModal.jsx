import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  X,
  GraduationCap,
  Presentation,
  Briefcase,
  MapPin,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  ROLE_CONFIG,
  ROLE_ORDER,
  validateRole,
  validateField,
} from "../../data/roleFormConfig";
import {
  CREATE_USER_HANDLERS,
  fetchAdminCourses,
  fetchAdminBatchesByCourse,
  fetchAdminCompanies,
} from "../../../../../api/admin/adminCreateUserService";
import "./AddUserModal.css";

const ROLE_ICONS = {
  candidate: GraduationCap,
  instructor: Presentation,
  hr: Briefcase,
  mobilizer: MapPin,
};

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const buildInitialState = () =>
  ROLE_ORDER.reduce((acc, key) => {
    acc[key] = { ...ROLE_CONFIG[key].initialValues };
    return acc;
  }, {});

/**
 * AddUserModal
 *
 * Opens from the "Add user" button on the Total Users table. Lets the admin
 * toggle between the 4 creatable roles — Candidate, Trainer/Instructor,
 * HR/Recruiter, Mobilizer — each rendering its own field set (matching the
 * corresponding backend controller's req.body) but sharing one modal shell,
 * one validation engine, and one submit flow.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onUserCreated: (role, responsePayload) => void   // parent refetches table
 *  - defaultRole: "candidate" | "instructor" | "hr" | "mobilizer"
 */
const AddUserModal = ({
  isOpen,
  onClose,
  onUserCreated,
  defaultRole = "candidate",
}) => {
  const [activeRole, setActiveRole] = useState(defaultRole);
  const [values, setValues] = useState(buildInitialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successInfo, setSuccessInfo] = useState(null); // { role, response }
  const [copiedField, setCopiedField] = useState("");

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const config = ROLE_CONFIG[activeRole];

  const resetAll = useCallback(() => {
    setActiveRole(defaultRole);
    setValues(buildInitialState());
    setErrors({});
    setApiError("");
    setSuccessInfo(null);
    setShowPassword(false);
  }, [defaultRole]);

  useEffect(() => {
    if (isOpen) resetAll();
  }, [isOpen, resetAll]);

  // Load courses/companies once the modal is open (cheap + reused across tabs)
  useEffect(() => {
    if (!isOpen) return;

    setLoadingCourses(true);
    fetchAdminCourses()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));

    setLoadingCompanies(true);
    fetchAdminCompanies()
      .then(setCompanies)
      .catch(() => setCompanies([]))
      .finally(() => setLoadingCompanies(false));
  }, [isOpen]);

  // Batches depend on the selected course — refetch whenever course_id changes
  const selectedCourseId = values.candidate.course_id;
  useEffect(() => {
    if (!isOpen || !selectedCourseId) {
      setBatches([]);
      return;
    }
    setLoadingBatches(true);
    fetchAdminBatchesByCourse(selectedCourseId)
      .then(setBatches)
      .catch(() => setBatches([]))
      .finally(() => setLoadingBatches(false));
  }, [isOpen, selectedCourseId]);

  const dynamicOptionsFor = (field) => {
    if (field.dynamic === "courses") {
      return courses.map((c) => ({
        value: c.course_id ?? c.id,
        label: c.course_name ?? c.name,
      }));
    }
    if (field.dynamic === "batches") {
      return batches.map((b) => ({
        value: b.batch_id ?? b.id,
        label: b.batch_name ?? b.name,
      }));
    }
    if (field.dynamic === "companies") {
      return companies.map((c) => ({
        value: c.company_id ?? c.id,
        label: c.company_name ?? c.name,
      }));
    }
    return field.options ?? [];
  };

  const isDynamicLoading = (field) => {
    if (field.dynamic === "courses") return loadingCourses;
    if (field.dynamic === "batches") return loadingBatches;
    if (field.dynamic === "companies") return loadingCompanies;
    return false;
  };

  const handleChange = (field, rawValue) => {
    setValues((prev) => {
      const next = {
        ...prev,
        [activeRole]: { ...prev[activeRole], [field.name]: rawValue },
      };
      // Reset batch when course changes
      if (field.name === "course_id") {
        next.candidate = { ...next.candidate, batch_id: "" };
      }
      return next;
    });

    if (errors[field.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field.name];
        return next;
      });
    }
  };

  const handleBlurValidate = (field) => {
    const message = validateField(field, values[activeRole][field.name]);
    setErrors((prev) => ({ ...prev, [field.name]: message || undefined }));
  };

  const handleSwitchRole = (roleKey) => {
    if (roleKey === activeRole || submitting) return;
    setActiveRole(roleKey);
    setErrors({});
    setApiError("");
  };

  const handleGeneratePassword = () => {
    handleChange({ name: "password" }, generatePassword());
    setShowPassword(true);
  };

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(key);
      setTimeout(() => setCopiedField(""), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const roleErrors = validateRole(activeRole, values[activeRole]);
    if (Object.keys(roleErrors).length) {
      setErrors(roleErrors);
      return;
    }

    setSubmitting(true);
    try {
      const handler = CREATE_USER_HANDLERS[activeRole]; // -> createAdminMobilizer when activeRole === "mobilizer"
      const response = await handler(values[activeRole]);
      setSuccessInfo({ role: activeRole, response });
      onUserCreated?.(activeRole, response);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong. Please try again.";
      setApiError(apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setValues((prev) => ({
      ...prev,
      [activeRole]: { ...ROLE_CONFIG[activeRole].initialValues },
    }));
    setSuccessInfo(null);
    setErrors({});
  };

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const credentials = useMemo(() => {
    if (!successInfo) return null;
    const data = successInfo.response?.data ?? successInfo.response;
    if (successInfo.role === "candidate") {
      return data?.credentials
        ? {
            email: data.credentials.login_email,
            password: data.credentials.default_password,
            note: "Auto-generated for this new candidate.",
          }
        : null; // existing candidate — no new credentials
    }
    return {
      email: values[successInfo.role].email,
      password: values[successInfo.role].password,
      note: "Set by you just now.",
    };
  }, [successInfo, values]);

  if (!isOpen) return null;

  return (
    <div className="add-user-modal__overlay" onMouseDown={handleClose}>
      <div
        className="add-user-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Add new user"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="add-user-modal__header">
          <div>
            <h2 className="add-user-modal__title">Add New User</h2>
            <p className="add-user-modal__subtitle">{config.subtitle}</p>
          </div>
          <button
            type="button"
            className="add-user-modal__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="add-user-modal__role-toggle" role="tablist">
          {ROLE_ORDER.map((roleKey) => {
            const Icon = ROLE_ICONS[roleKey];
            const isActive = roleKey === activeRole;
            return (
              <button
                key={roleKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`add-user-modal__role-tab${
                  isActive ? " add-user-modal__role-tab--active" : ""
                }`}
                onClick={() => handleSwitchRole(roleKey)}
                disabled={submitting}
              >
                <Icon size={16} strokeWidth={2.2} />
                {ROLE_CONFIG[roleKey].label}
              </button>
            );
          })}
        </div>

        {successInfo ? (
          <div className="add-user-modal__success add-user-modal__scroll">
            <div className="add-user-modal__success-icon">
              <CheckCircle2 size={28} strokeWidth={2} />
            </div>
            <h3 className="add-user-modal__success-title">
              {config.label} created
              {successInfo.role === "candidate" &&
              successInfo.response?.data?.candidate
                ? ` — ${successInfo.response.data.candidate.first_name}`
                : ""}
            </h3>
            <p className="add-user-modal__success-text">
              {successInfo.response?.message ||
                `${config.label} was added successfully.`}
            </p>

            {credentials && (
              <div className="add-user-modal__credentials">
                <div className="add-user-modal__cred-row">
                  <span className="add-user-modal__cred-label">
                    Login Email
                  </span>
                  <span className="add-user-modal__cred-value">
                    {credentials.email}
                  </span>
                  <button
                    type="button"
                    className="add-user-modal__cred-copy"
                    onClick={() => handleCopy(credentials.email, "email")}
                  >
                    {copiedField === "email" ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <div className="add-user-modal__cred-row">
                  <span className="add-user-modal__cred-label">Password</span>
                  <span className="add-user-modal__cred-value">
                    {credentials.password}
                  </span>
                  <button
                    type="button"
                    className="add-user-modal__cred-copy"
                    onClick={() => handleCopy(credentials.password, "password")}
                  >
                    {copiedField === "password" ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <p className="add-user-modal__cred-note">{credentials.note}</p>
              </div>
            )}

            <div className="add-user-modal__success-actions">
              <button
                type="button"
                className="add-user-modal__btn add-user-modal__btn--ghost"
                onClick={handleAddAnother}
              >
                Add another {config.label}
              </button>
              <button
                type="button"
                className="add-user-modal__btn add-user-modal__btn--primary"
                onClick={handleClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form className="add-user-modal__body" onSubmit={handleSubmit}>
            <div className="add-user-modal__scroll">
              {apiError && (
                <div className="add-user-modal__api-error">{apiError}</div>
              )}

              <div className="add-user-modal__grid">
                {config.fields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={values[activeRole][field.name]}
                    error={errors[field.name]}
                    onChange={(val) => handleChange(field, val)}
                    onBlur={() => handleBlurValidate(field)}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword((v) => !v)}
                    onGeneratePassword={handleGeneratePassword}
                    dynamicOptions={
                      field.dynamic ? dynamicOptionsFor(field) : undefined
                    }
                    dynamicLoading={
                      field.dynamic ? isDynamicLoading(field) : false
                    }
                    disabled={
                      field.dependsOn === "course_id" &&
                      !values.candidate.course_id
                    }
                  />
                ))}
              </div>

              {config.note && (
                <p className="add-user-modal__note">{config.note}</p>
              )}
            </div>

            <div className="add-user-modal__footer">
              <button
                type="button"
                className="add-user-modal__btn add-user-modal__btn--ghost"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="add-user-modal__btn add-user-modal__btn--primary"
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 size={15} className="add-user-modal__spin" />
                )}
                {submitting ? "Creating..." : config.submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const FormField = ({
  field,
  value,
  error,
  onChange,
  onBlur,
  showPassword,
  onTogglePassword,
  onGeneratePassword,
  dynamicOptions,
  dynamicLoading,
  disabled,
}) => {
  const inputId = `add-user-${field.name}`;

  return (
    <div
      className={`add-user-modal__field${
        field.fullWidth ? " add-user-modal__field--full" : ""
      }`}
    >
      <label htmlFor={inputId} className="add-user-modal__label">
        {field.label}
        {field.required && <span className="add-user-modal__required">*</span>}
      </label>

      {field.type === "select" ? (
        <select
          id={inputId}
          className="add-user-modal__input add-user-modal__select"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled || dynamicLoading}
        >
          <option value="">
            {dynamicLoading
              ? "Loading..."
              : field.placeholder || "Select an option"}
          </option>
          {(dynamicOptions ?? field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "password" ? (
        <div className="add-user-modal__password-row">
          <input
            id={inputId}
            type={showPassword ? "text" : "password"}
            className="add-user-modal__input"
            value={value ?? ""}
            placeholder={field.placeholder || "Set a login password"}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="add-user-modal__icon-btn"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button
            type="button"
            className="add-user-modal__icon-btn"
            onClick={onGeneratePassword}
            aria-label="Generate password"
            title="Generate password"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      ) : (
        <input
          id={inputId}
          type={field.type}
          className="add-user-modal__input"
          value={value ?? ""}
          placeholder={field.placeholder}
          min={field.min}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}

      {error && <span className="add-user-modal__error">{error}</span>}
    </div>
  );
};

export default AddUserModal;
