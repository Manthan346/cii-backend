// EditProfileModal.jsx
// "Edit Profile" modal for the CANDIDATE profile — mirrors the trainer's
// edit-profile modal (tabs, layout, Cancel/Save Changes footer) but scoped
// to the fields that actually exist on the candidate record, per
// Profile.jsx's mappers (mapPersonalInfo / mapGuardianInfo).
//
// Tabs: Personal | Address | Guardian
// (No Academic/Document tab — those are edited from their own tabs on the
// profile page, not from this modal.)
//
// USAGE (from Profile.jsx):
//
//   import EditProfileModal from "../EditProfileModal/EditProfileModal";
//   import { updateCandidateProfile, updateCandidateGuardianDetails } from "../../../../services/profileService";
//
//   const [editOpen, setEditOpen] = useState(false);
//   ...
//   {candidateHeader && (
//     <ProfileHeader candidate={candidateHeader} onEditClick={() => setEditOpen(true)} />
//   )}
//
//   <EditProfileModal
//     isOpen={editOpen}
//     onClose={() => setEditOpen(false)}
//     personalInfo={personalInfo}
//     guardianDetails={guardianDetails}
//     onSave={async ({ personalInfo: updatedPersonal, guardianDetails: updatedGuardian }, avatarFile) => {
//       await updateCandidateProfile(updatedPersonal, avatarFile); // wire up to your API
//       await updateCandidateGuardianDetails(updatedGuardian);
//       // re-fetch or optimistically update local state here
//       setPersonalInfo((prev) => ({ ...prev, ...updatedPersonal }));
//       setGuardianDetails(updatedGuardian);
//     }}
//   />
//
// `personalInfo` and `guardianDetails` are the RAW API objects already held
// in Profile.jsx's state (same shape mapPersonalInfo/mapGuardianInfo read
// from) — this modal reads and writes those same raw field names, so no
// extra mapping layer is needed at the call site.

import { useEffect, useRef, useState } from "react";
import "./EditProfileModal.css";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "address", label: "Address" },
  { id: "guardian", label: "Guardian" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other"];

const EMPTY_GUARDIAN_SECTION = {
  name: "",
  blood_group: "",
  occupation: "",
  phone_no: "",
  address: "",
  dob: "",
};

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return typeof value === "string" ? value.slice(0, 10) : "";
  return d.toISOString().slice(0, 10);
}

function buildInitialForm(personalInfo) {
  return {
    candidate_first_name: personalInfo?.candidate_first_name ?? "",
    candidate_last_name: personalInfo?.candidate_last_name ?? "",
    contact_number: personalInfo?.contact_number ?? "",
    email: personalInfo?.email ?? personalInfo?.user_login?.user_email ?? "",
    profile_photo:
      personalInfo?.profile_photo ??
      personalInfo?.profilePhoto ??
      personalInfo?.candidate_photo ??
      personalInfo?.avatar_url ??
      null,
    gender: personalInfo?.gender ?? "",
    date_of_birth: toDateInputValue(personalInfo?.date_of_birth),
    category: personalInfo?.category ?? "",
    blood_group: personalInfo?.blood_group ?? "",
    highest_qualification: personalInfo?.highest_qualification ?? "",
    candidate_current_address: personalInfo?.candidate_current_address ?? "",
    candidate_permanent_address:
      personalInfo?.candidate_permanent_address ?? "",
    current_city: personalInfo?.current_city ?? personalInfo?.district ?? "",
    current_district: personalInfo?.current_district ?? "",
    current_pin_code:
      personalInfo?.current_pin_code ?? personalInfo?.pin_code ?? "",
    current_state_name:
      personalInfo?.current_state_name ?? personalInfo?.state_name ?? "",
    current_country:
      personalInfo?.current_country ?? personalInfo?.country ?? "India",
    permanent_city:
      personalInfo?.permanent_city ?? personalInfo?.district ?? "",
    permanent_district: personalInfo?.permanent_district ?? "",
    permanent_pin_code:
      personalInfo?.permanent_pin_code ?? personalInfo?.pin_code ?? "",
    permanent_state_name:
      personalInfo?.permanent_state_name ?? personalInfo?.state_name ?? "",
    permanent_country:
      personalInfo?.permanent_country ?? personalInfo?.country ?? "India",
  };
}

function buildInitialGuardian(guardianDetails) {
  return {
    fatherDetails: {
      ...EMPTY_GUARDIAN_SECTION,
      ...(guardianDetails?.fatherDetails ?? {}),
      dob: toDateInputValue(guardianDetails?.fatherDetails?.dob),
    },
    motherDetails: {
      ...EMPTY_GUARDIAN_SECTION,
      ...(guardianDetails?.motherDetails ?? {}),
      dob: toDateInputValue(guardianDetails?.motherDetails?.dob),
    },
    guardianDetails: {
      ...EMPTY_GUARDIAN_SECTION,
      relationship: "",
      ...(guardianDetails?.guardianDetails ?? {}),
      dob: toDateInputValue(guardianDetails?.guardianDetails?.dob),
    },
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  personalInfo,
  guardianDetails,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState(() => buildInitialForm(personalInfo));
  const [guardianForm, setGuardianForm] = useState(() =>
    buildInitialGuardian(guardianDetails),
  );
  const [avatarPreview, setAvatarPreview] = useState(
    personalInfo?.avatar_url ??
      personalInfo?.profile_photo ??
      personalInfo?.profilePhoto ??
      personalInfo?.candidate_photo ??
      null,
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Reset form state whenever the modal is (re)opened with fresh data.
  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("personal");
    setForm(buildInitialForm(personalInfo));
    setGuardianForm(buildInitialGuardian(guardianDetails));
    setAvatarPreview(
      personalInfo?.avatar_url ??
        personalInfo?.profile_photo ??
        personalInfo?.profilePhoto ??
        personalInfo?.candidate_photo ??
        null,
    );
    setAvatarFile(null);
    setErrors({});
  }, [isOpen, personalInfo, guardianDetails]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function updateGuardianField(section, field, value) {
    setGuardianForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleAvatarDelete() {
    setAvatarFile(null);
    setAvatarPreview(null);
    setForm((prev) => ({ ...prev, profile_photo: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate() {
    const next = {};
    if (!form.candidate_first_name.trim())
      next.candidate_first_name = "First name is required";
    if (!form.candidate_last_name.trim())
      next.candidate_last_name = "Last name is required";
    if (!form.contact_number.trim())
      next.contact_number = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.contact_number.trim()))
      next.contact_number = "Enter a valid 10-digit number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function isSectionBlank(section) {
    return !section.name?.trim() && !section.phone_no?.trim();
  }

  async function handleSave() {
    if (!validate()) {
      // Jump the user to the tab that has the problem.
      setActiveTab("personal");
      return;
    }

    const payload = {
      personalInfo: { ...form },
      guardianDetails: {
        // Omit a section entirely if the user left it blank, rather than
        // saving a row of empty strings.
        fatherDetails: isSectionBlank(guardianForm.fatherDetails)
          ? null
          : guardianForm.fatherDetails,
        motherDetails: isSectionBlank(guardianForm.motherDetails)
          ? null
          : guardianForm.motherDetails,
        guardianDetails: isSectionBlank(guardianForm.guardianDetails)
          ? null
          : guardianForm.guardianDetails,
      },
    };

    try {
      setSaving(true);
      await onSave?.(payload, avatarFile);
      onClose?.();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: "Couldn't save changes. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  }

  const initials =
    `${form.candidate_first_name?.[0] ?? ""}${form.candidate_last_name?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      className="epm-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="epm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="epm-title"
      >
        <div className="epm-header">
          <h2 id="epm-title" className="epm-title">
            Edit Profile
          </h2>

          <div className="epm-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`epm-tab${activeTab === tab.id ? " epm-tab--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="epm-body">
          {activeTab === "personal" && (
            <section className="epm-section">
              <div className="epm-avatar-row">
                <div className="epm-avatar">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" />
                  ) : (
                    <span>{initials || "?"}</span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="epm-file-input"
                  onChange={handleAvatarPick}
                />
                <button
                  type="button"
                  className="epm-btn epm-btn--ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Picture
                </button>
                <button
                  type="button"
                  className="epm-btn epm-btn--danger-ghost"
                  onClick={handleAvatarDelete}
                >
                  Delete Picture
                </button>
              </div>

              <div className="epm-grid">
                <Field label="First Name" error={errors.candidate_first_name}>
                  <input
                    value={form.candidate_first_name}
                    onChange={(e) =>
                      updateField("candidate_first_name", e.target.value)
                    }
                  />
                </Field>
                <Field label="Last Name" error={errors.candidate_last_name}>
                  <input
                    value={form.candidate_last_name}
                    onChange={(e) =>
                      updateField("candidate_last_name", e.target.value)
                    }
                  />
                </Field>

                <Field label="Mobile Number" error={errors.contact_number}>
                  <input
                    type="tel"
                    value={form.contact_number}
                    onChange={(e) =>
                      updateField("contact_number", e.target.value)
                    }
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input type="email" value={form.email} readOnly disabled />
                </Field>

                <Field label="Date of Birth">
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) =>
                      updateField("date_of_birth", e.target.value)
                    }
                  />
                </Field>
                <Field label="Blood Group">
                  <select
                    value={form.blood_group}
                    onChange={(e) => updateField("blood_group", e.target.value)}
                  >
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="e.g. General, OBC, SC/ST"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Highest Qualification" full>
                  <input
                    value={form.highest_qualification}
                    onChange={(e) =>
                      updateField("highest_qualification", e.target.value)
                    }
                  />
                </Field>
              </div>
            </section>
          )}

          {activeTab === "address" && (
            <section className="epm-section">
              <h3 className="epm-subheading">Current Address</h3>
              <Field label="Address Line" full>
                <textarea
                  rows={2}
                  value={form.candidate_current_address}
                  onChange={(e) =>
                    updateField("candidate_current_address", e.target.value)
                  }
                />
              </Field>

              <div className="epm-grid">
                <Field label="Current City">
                  <input
                    value={form.current_city}
                    onChange={(e) =>
                      updateField("current_city", e.target.value)
                    }
                  />
                </Field>
                <Field label="Current State">
                  <input
                    value={form.current_state_name}
                    onChange={(e) =>
                      updateField("current_state_name", e.target.value)
                    }
                  />
                </Field>
                <Field label="Current District">
                  <input
                    value={form.current_district}
                    onChange={(e) =>
                      updateField("current_district", e.target.value)
                    }
                  />
                </Field>
                <Field label="Current Pin Code">
                  <input
                    value={form.current_pin_code}
                    onChange={(e) =>
                      updateField("current_pin_code", e.target.value)
                    }
                  />
                </Field>
                <Field label="Current Country">
                  <input
                    value={form.current_country}
                    onChange={(e) =>
                      updateField("current_country", e.target.value)
                    }
                  />
                </Field>
              </div>

              <h3 className="epm-subheading epm-subheading--spaced">
                Permanent Address
              </h3>
              <Field label="Address Line" full>
                <textarea
                  rows={2}
                  value={form.candidate_permanent_address}
                  onChange={(e) =>
                    updateField("candidate_permanent_address", e.target.value)
                  }
                />
              </Field>

              <div className="epm-grid">
                <Field label="Permanent City">
                  <input
                    value={form.permanent_city}
                    onChange={(e) =>
                      updateField("permanent_city", e.target.value)
                    }
                  />
                </Field>
                <Field label="Permanent State">
                  <input
                    value={form.permanent_state_name}
                    onChange={(e) =>
                      updateField("permanent_state_name", e.target.value)
                    }
                  />
                </Field>
                <Field label="Permanent District">
                  <input
                    value={form.permanent_district}
                    onChange={(e) =>
                      updateField("permanent_district", e.target.value)
                    }
                  />
                </Field>
                <Field label="Permanent Pin Code">
                  <input
                    value={form.permanent_pin_code}
                    onChange={(e) =>
                      updateField("permanent_pin_code", e.target.value)
                    }
                  />
                </Field>
                <Field label="Permanent Country">
                  <input
                    value={form.permanent_country}
                    onChange={(e) =>
                      updateField("permanent_country", e.target.value)
                    }
                  />
                </Field>
              </div>
            </section>
          )}

          {activeTab === "guardian" && (
            <section className="epm-section">
              <GuardianFieldset
                title="Father"
                data={guardianForm.fatherDetails}
                onChange={(field, value) =>
                  updateGuardianField("fatherDetails", field, value)
                }
              />
              <GuardianFieldset
                title="Mother"
                data={guardianForm.motherDetails}
                onChange={(field, value) =>
                  updateGuardianField("motherDetails", field, value)
                }
              />
              <GuardianFieldset
                title="Guardian"
                data={guardianForm.guardianDetails}
                onChange={(field, value) =>
                  updateGuardianField("guardianDetails", field, value)
                }
                showRelationship
              />
            </section>
          )}
        </div>

        <div className="epm-footer">
          {errors.form && <span className="epm-form-error">{errors.form}</span>}
          <button
            type="button"
            className="epm-btn epm-btn--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="epm-btn epm-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, full, children }) {
  return (
    <label className={`epm-field${full ? " epm-field--full" : ""}`}>
      <span className="epm-label">{label}</span>
      {children}
      {error && <span className="epm-error">{error}</span>}
    </label>
  );
}

function GuardianFieldset({ title, data, onChange, showRelationship }) {
  return (
    <fieldset className="epm-guardian-card">
      <legend className="epm-subheading">{title}</legend>
      <div className="epm-grid">
        <Field label="Name">
          <input
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </Field>
        {showRelationship && (
          <Field label="Relationship">
            <input
              value={data.relationship ?? ""}
              onChange={(e) => onChange("relationship", e.target.value)}
              placeholder="e.g. Uncle, Grandfather"
            />
          </Field>
        )}
        <Field label="Mobile Number">
          <input
            type="tel"
            value={data.phone_no}
            onChange={(e) => onChange("phone_no", e.target.value)}
          />
        </Field>
        <Field label="Occupation">
          <input
            value={data.occupation}
            onChange={(e) => onChange("occupation", e.target.value)}
          />
        </Field>

        <Field label="Blood Group">
          <select
            value={data.blood_group}
            onChange={(e) => onChange("blood_group", e.target.value)}
          >
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date of Birth">
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)}
          />
        </Field>

        <Field label="Address" full>
          <textarea
            rows={2}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </Field>
      </div>
    </fieldset>
  );
}
