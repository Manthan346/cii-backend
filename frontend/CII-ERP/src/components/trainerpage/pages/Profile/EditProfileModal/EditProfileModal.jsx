import { useEffect, useRef, useState } from "react";
import { Button } from "../../../shared";
import "./EditProfileModal.css";

/**
 * EditProfileModal
 *
 * "Edit Profile" popup form used to add/edit every field shown across
 * the Profile page's tabs in one place: Personal Information, Contact,
 * Address, Guardian Information, and Academic Detail (Education +
 * Experience). Document uploads keep their own dedicated flow on the
 * Document tab, so they're not duplicated here.
 *
 * Profile picture (Upload New Picture / Delete Picture, top of the
 * Personal section) is SESSION-ONLY for now - there's no backend field
 * or upload endpoint for it yet (instructor-profile.ts's select has no
 * photo/avatar column, and there's no equivalent of
 * instructor-documents.ts's Cloudinary upload for a single profile
 * picture). Selecting a file just creates a local blob: URL preview via
 * URL.createObjectURL and passes it through onSave like any other
 * field; it lives only in Profile.jsx's React state and is gone on
 * refresh. Swap handlePictureChange/handleDeletePicture for a real
 * upload/delete API call once that backend work exists, the same way
 * fetchInstructorProfile replaced the profileBasicInfo mock earlier.
 *
 * Mirrors the styling/markup pattern used by AddCandidateModal /
 * MarkAttendanceModal so every popup in the app looks the same, but
 * groups fields under an internal section switcher since this form
 * covers far more fields than a typical add/edit popup.
 *
 * Fires onSave(updatedProfile) with the same shape as the props it was
 * given, so the parent (Profile.jsx) can merge it straight back into
 * state.
 *
 * Personal no longer edits any address fields - Current Address and
 * Permanent Address (each with Address Line/State/City/District/Pin
 * Code) live only in the Address section below.
 *
 * Guardian is now an array editor: up to 3 guardians can be added
 * (e.g. Father, Mother, and one more), each with its own
 * name/relationship/mobile/occupation/blood group and a single
 * address textfield. At least one guardian (with a name) is required
 * to save - see handleSave's validation.
 */
const SECTIONS = [
  {
    id: "personal",
    label: "Personal",
  },
  {
    id: "address",
    label: "Address",
  },
  {
    id: "guardian",
    label: "Guardian",
  },
  {
    id: "academic",
    label: "Academic",
  },
];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

function formatDateForInput(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function isValidMobileNumber(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return /^(?:91)?[6-9]\d{9}$/.test(digits);
}

function hasValue(value) {
  return String(value ?? "").trim().length > 0;
}

function getLatestEligibleBirthDate() {
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = today.getMonth();
  const cutoff = new Date(year, month, today.getDate());
  if (cutoff.getMonth() !== month) cutoff.setDate(0);

  const localYear = cutoff.getFullYear();
  const localMonth = String(cutoff.getMonth() + 1).padStart(2, "0");
  const localDay = String(cutoff.getDate()).padStart(2, "0");
  return `${localYear}-${localMonth}-${localDay}`;
}

export default function EditProfileModal({
  personal,
  contact,
  currentAddress,
  permanentAddress,
  father,
  mother,
  guardian,
  activeGuardianIndex,
  education,
  experience,
  avatarUrl,
  onCancel,
  onSave,
}) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const nameParts = String(personal?.name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const [personalForm, setPersonalForm] = useState({
    ...personal,
    firstName: personal?.firstName ?? nameParts[0] ?? "",
    lastName: personal?.lastName ?? nameParts.slice(1).join(" "),
    dob: formatDateForInput(personal?.dob),
    mobileNumber: personal?.mobileNumber ?? contact?.mobileNumber ?? "",
    emergencyContactNumber:
      personal?.emergencyContactNumber ?? contact?.emergencyContactNumber ?? "",
  });
  const [addressForm, setAddressForm] = useState({
    ...currentAddress,
  });
  const [permanentAddressForm, setPermanentAddressForm] = useState({
    ...permanentAddress,
  });

  // Profile picture - session-only, see file header comment.
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl ?? null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Only revoke blob: URLs we created ourselves - the initial
    // avatarUrl passed in could be a real imported asset path, which
    // isn't ours to revoke.
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return nextPreview;
    });
    // Allow re-selecting the same file later.
    event.target.value = "";
  };

  const handleDeletePicture = () => {
    setAvatarFile(null);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // Up to 3 guardians can be added (Father / Mother / one extra); at
  // least one is mandatory, so this always starts with at least one
  // (blank) entry rather than an empty array.
  const EMPTY_GUARDIAN = {
    name: "",
    relationship: "",
    phone_no: "",
    occupation: "",
    blood_group: "",
    address: "",
    dob: "",
  };
  const [fatherForm, setFatherForm] = useState({
    ...EMPTY_GUARDIAN,
    ...father,
    dob: formatDateForInput(father?.dob),
  });
  const [motherForm, setMotherForm] = useState({
    ...EMPTY_GUARDIAN,
    ...mother,
    dob: formatDateForInput(mother?.dob),
  });
  const [guardianForm, setGuardianForm] = useState({
    ...EMPTY_GUARDIAN,
    ...guardian,
    dob: formatDateForInput(guardian?.dob),
  });
  const [educationForm, setEducationForm] = useState({
    ...education,
    highestEducation:
      education?.highestEducation ?? education?.highestQualification ?? "",
    additionalQualification:
      education?.additionalQualification ??
      education?.additionalQualifications?.join(", ") ??
      "",
  });
  const [experienceForm, setExperienceForm] = useState({
    ...experience,
    previousOrganization:
      experience?.previousOrganization ??
      experience?.previousOrganisation ??
      "",
  });
  const updateField = (setter) => (field, errorKey = field) => (event) => {
    const { value } = event.target;
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationErrors((prev) => {
      if (!prev[errorKey]) return prev;
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };
  const renderFieldError = (field) =>
    validationErrors[field] ? (
      <p
        id={`${field}-error`}
        className="profile-edit-profile-modal-field-error"
        role="alert"
      >
        {validationErrors[field]}
      </p>
    ) : null;
  const fieldErrorProps = (field) => ({
    "aria-invalid": Boolean(validationErrors[field]),
    "aria-describedby": validationErrors[field] ? `${field}-error` : undefined,
  });
  // const updateGuardianField = (index, field) => (event) => {
  //   const { value } = event.target;
  //   setGuardianForms((prev) =>
  //     prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
  //   );
  //   if (guardianError) setGuardianError('');
  // };
  // const handleAddGuardian = () => {
  //   if (guardianForms.length >= 3) return;
  //   setGuardianForms((prev) => [...prev, { ...EMPTY_GUARDIAN }]);
  // };
  // const handleRemoveGuardian = (index) => {
  //   // At least one guardian is mandatory, so the last remaining entry
  //   // can't be removed.
  //   setGuardianForms((prev) =>
  //     prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
  //   );
  // };
  const handleSave = async () => {
    const errors = {};
    if (!hasValue(personalForm.firstName)) {
      errors.firstName = "First name is required.";
    }
    if (!hasValue(personalForm.lastName)) {
      errors.lastName = "Last name is required.";
    }
    if (!hasValue(personalForm.mobileNumber)) {
      errors.mobileNumber = "Mobile number is required.";
    } else if (!isValidMobileNumber(personalForm.mobileNumber)) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number.";
    }
    if (
      hasValue(personalForm.emergencyContactNumber) &&
      !isValidMobileNumber(personalForm.emergencyContactNumber)
    ) {
      errors.emergencyContactNumber =
        "Enter a valid 10-digit mobile number.";
    }
    if (!personalForm.dob) {
      errors.dob = "Date of birth is required.";
    } else {
      const birthDate = new Date(`${personalForm.dob}T00:00:00`);
      if (Number.isNaN(birthDate.getTime())) {
        errors.dob = "Enter a valid date of birth.";
      } else if (personalForm.dob > getLatestEligibleBirthDate()) {
        errors.dob = "Trainer must be at least 18 years old.";
      }
    }
    if (!hasValue(personalForm.gender)) {
      errors.gender = "Gender is required.";
    }
    if (
      hasValue(fatherForm.phone_no) &&
      !isValidMobileNumber(fatherForm.phone_no)
    ) {
      errors.fatherPhone = "Enter a valid 10-digit mobile number.";
    }
    if (
      hasValue(motherForm.phone_no) &&
      !isValidMobileNumber(motherForm.phone_no)
    ) {
      errors.motherPhone = "Enter a valid 10-digit mobile number.";
    }
    if (
      hasValue(guardianForm.phone_no) &&
      !isValidMobileNumber(guardianForm.phone_no)
    ) {
      errors.guardianPhone = "Enter a valid 10-digit mobile number.";
    }
    if (
      !hasValue(fatherForm.name) &&
      !hasValue(motherForm.name) &&
      !hasValue(guardianForm.name)
    ) {
      errors.guardian = "Enter at least one guardian's name.";
    }

    setValidationErrors(errors);
    setSaveError("");
    if (Object.keys(errors).length) {
      setActiveSection(
        errors.firstName ||
          errors.lastName ||
          errors.mobileNumber ||
          errors.emergencyContactNumber ||
          errors.dob ||
          errors.gender
          ? "personal"
          : "guardian",
      );
      return;
    }

    setIsSaving(true);

    try {
      await onSave?.({
        personal: {
          ...personalForm,
          name: `${personalForm.firstName} ${personalForm.lastName}`.trim(),
        },
        contact: {
          ...contact,
          mobileNumber: personalForm.mobileNumber,
          emergencyContactNumber: personalForm.emergencyContactNumber,
        },
        currentAddress: addressForm,
        permanentAddress: permanentAddressForm,
        fatherDetails: fatherForm,
        motherDetails: motherForm,
        guardianDetails: guardianForm,
        education: educationForm,
        experience: experienceForm,
        avatarUrl: avatarPreview,
        avatarFile,
      });
    } catch (error) {
      setSaveError(
        error.response?.data?.message ||
          error.message ||
          "Unable to save profile changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div
      className={"profile-edit-profile-modal-overlay"}
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      <div className={"profile-edit-profile-modal-modal"}>
        <h2 className={"profile-edit-profile-modal-title"}>Edit Profile</h2>

        <div className={"profile-edit-profile-modal-section-tabs"}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`${"profile-edit-profile-modal-section-tab"} ${activeSection === section.id ? "profile-edit-profile-modal-section-tab-active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className={"profile-edit-profile-modal-body"}>
          {activeSection === "personal" && (
            <>
              <div className={"profile-edit-profile-modal-avatar-row"}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className={"profile-edit-profile-modal-avatar-preview"}
                  />
                ) : (
                  <div
                    className={"profile-edit-profile-modal-avatar-placeholder"}
                  />
                )}

                <div className={"profile-edit-profile-modal-avatar-actions"}>
                  <button
                    type="button"
                    className={"profile-edit-profile-modal-avatar-upload-btn"}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload New Picture
                  </button>
                  <button
                    type="button"
                    className={"profile-edit-profile-modal-avatar-delete-btn"}
                    onClick={handleDeletePicture}
                    disabled={!avatarPreview}
                  >
                    Delete Picture
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={"profile-edit-profile-modal-avatar-input"}
                    onChange={handlePictureChange}
                  />
                </div>
              </div>

              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.firstName}
                    onChange={updateField(setPersonalForm)("firstName")}
                    required
                    aria-required="true"
                    {...fieldErrorProps("firstName")}
                  />
                  {renderFieldError("firstName")}
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.lastName}
                    onChange={updateField(setPersonalForm)("lastName")}
                    required
                    aria-required="true"
                    {...fieldErrorProps("lastName")}
                  />
                  {renderFieldError("lastName")}
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Mobile Number *
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.mobileNumber}
                    onChange={updateField(setPersonalForm)("mobileNumber")}
                    required
                    aria-required="true"
                    inputMode="tel"
                    {...fieldErrorProps("mobileNumber")}
                  />
                  {renderFieldError("mobileNumber")}
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.emergencyContactNumber}
                    onChange={updateField(setPersonalForm)(
                      "emergencyContactNumber",
                    )}
                    inputMode="tel"
                    {...fieldErrorProps("emergencyContactNumber")}
                  />
                  {renderFieldError("emergencyContactNumber")}
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.dob}
                    onChange={updateField(setPersonalForm)("dob")}
                    max={getLatestEligibleBirthDate()}
                    required
                    aria-required="true"
                    {...fieldErrorProps("dob")}
                  />
                  {renderFieldError("dob")}
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Blood Group
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.bloodGroup}
                    onChange={updateField(setPersonalForm)("bloodGroup")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Designation
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    placeholder="e.g. Software Engineer, Trainer, etc."
                    value={personalForm.designation}
                    onChange={updateField(setPersonalForm)("designation")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.companyName}
                    placeholder="e.g. ABC Pvt Ltd, XYZ Institute, etc."
                    onChange={updateField(setPersonalForm)("companyName")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.highestQualification}
                    onChange={updateField(setPersonalForm)(
                      "highestQualification",
                    )}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Gender *
                  </label>
                  <select
                    className={"profile-edit-profile-modal-input"}
                    value={personalForm.gender}
                    onChange={updateField(setPersonalForm)("gender")}
                    required
                    aria-required="true"
                    {...fieldErrorProps("gender")}
                  >
                    <option value="">Select gender</option>
                    {personalForm.gender &&
                      !GENDER_OPTIONS.includes(personalForm.gender) && (
                        <option value={personalForm.gender}>
                          {personalForm.gender}
                        </option>
                      )}
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {renderFieldError("gender")}
                </div>
              </div>
            </>
          )}

          {activeSection === "address" && (
            <>
              <h3 className={"profile-edit-profile-modal-subheading"}>
                Current Address
              </h3>
              <div className={"profile-edit-profile-modal-field"}>
                <label className={"profile-edit-profile-modal-label"}>
                  Address Line
                </label>
                <textarea
                  className={"profile-edit-profile-modal-textarea"}
                  rows={2}
                  value={addressForm.line}
                  onChange={updateField(setAddressForm)("line")}
                />
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    State
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={addressForm.state}
                    onChange={updateField(setAddressForm)("state")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    City
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={addressForm.city}
                    onChange={updateField(setAddressForm)("city")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    District
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={addressForm.district}
                    onChange={updateField(setAddressForm)("district")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Pin Code
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={addressForm.pinCode}
                    onChange={updateField(setAddressForm)("pinCode")}
                  />
                </div>
              </div>

              <h3 className={"profile-edit-profile-modal-subheading"}>
                Permanent Address
              </h3>
              <div className={"profile-edit-profile-modal-field"}>
                <label className={"profile-edit-profile-modal-label"}>
                  Address Line
                </label>
                <textarea
                  className={"profile-edit-profile-modal-textarea"}
                  rows={2}
                  value={permanentAddressForm.line}
                  onChange={updateField(setPermanentAddressForm)("line")}
                />
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    State
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={permanentAddressForm.state}
                    onChange={updateField(setPermanentAddressForm)("state")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    City
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={permanentAddressForm.city}
                    onChange={updateField(setPermanentAddressForm)("city")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    District
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={permanentAddressForm.district}
                    onChange={updateField(setPermanentAddressForm)("district")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Pin Code
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={permanentAddressForm.pinCode}
                    onChange={updateField(setPermanentAddressForm)("pinCode")}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === "guardian" && (
            <>
              {renderFieldError("guardian")}
              <div className={"profile-edit-profile-modal-guardian-card"}>
                <h3 className={"profile-edit-profile-modal-subheading"}>
                  Father
                </h3>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Name
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={fatherForm.name}
                      onChange={updateField(setFatherForm)("name", "guardian")}
                      aria-describedby={
                        validationErrors.guardian ? "guardian-error" : undefined
                      }
                    />
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={fatherForm.phone_no}
                      onChange={updateField(setFatherForm)(
                        "phone_no",
                        "fatherPhone",
                      )}
                      inputMode="tel"
                      {...fieldErrorProps("fatherPhone")}
                    />
                    {renderFieldError("fatherPhone")}
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Occupation
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={fatherForm.occupation}
                      onChange={updateField(setFatherForm)("occupation")}
                    />
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Blood Group
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={fatherForm.blood_group}
                      onChange={updateField(setFatherForm)("blood_group")}
                    />
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={"profile-edit-profile-modal-input"}
                    value={fatherForm.dob}
                    onChange={updateField(setFatherForm)("dob")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Address
                  </label>
                  <textarea
                    className={"profile-edit-profile-modal-textarea"}
                    rows={2}
                    value={fatherForm.address}
                    onChange={updateField(setFatherForm)("address")}
                  />
                </div>
              </div>

              <div className={"profile-edit-profile-modal-guardian-card"}>
                <h3 className={"profile-edit-profile-modal-subheading"}>
                  Mother
                </h3>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Name
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={motherForm.name}
                      onChange={updateField(setMotherForm)("name", "guardian")}
                      aria-describedby={
                        validationErrors.guardian ? "guardian-error" : undefined
                      }
                    />
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={motherForm.phone_no}
                      onChange={updateField(setMotherForm)(
                        "phone_no",
                        "motherPhone",
                      )}
                      inputMode="tel"
                      {...fieldErrorProps("motherPhone")}
                    />
                    {renderFieldError("motherPhone")}
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Occupation
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={motherForm.occupation}
                      onChange={updateField(setMotherForm)("occupation")}
                    />
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Blood Group
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={motherForm.blood_group}
                      onChange={updateField(setMotherForm)("blood_group")}
                    />
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={"profile-edit-profile-modal-input"}
                    value={motherForm.dob}
                    onChange={updateField(setMotherForm)("dob")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Address
                  </label>
                  <textarea
                    className={"profile-edit-profile-modal-textarea"}
                    rows={2}
                    value={motherForm.address}
                    onChange={updateField(setMotherForm)("address")}
                  />
                </div>
              </div>

              <div className={"profile-edit-profile-modal-guardian-card"}>
                <h3 className={"profile-edit-profile-modal-subheading"}>
                  Guardian
                </h3>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Name
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={guardianForm.name}
                      onChange={updateField(setGuardianForm)(
                        "name",
                        "guardian",
                      )}
                      aria-describedby={
                        validationErrors.guardian ? "guardian-error" : undefined
                      }
                    />
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Relationship
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      placeholder="e.g. Uncle, Sibling"
                      value={guardianForm.relationship}
                      onChange={updateField(setGuardianForm)("relationship")}
                    />
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={guardianForm.phone_no}
                      onChange={updateField(setGuardianForm)(
                        "phone_no",
                        "guardianPhone",
                      )}
                      inputMode="tel"
                      {...fieldErrorProps("guardianPhone")}
                    />
                    {renderFieldError("guardianPhone")}
                  </div>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Occupation
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={guardianForm.occupation}
                      onChange={updateField(setGuardianForm)("occupation")}
                    />
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-row"}>
                  <div className={"profile-edit-profile-modal-field"}>
                    <label className={"profile-edit-profile-modal-label"}>
                      Blood Group
                    </label>
                    <input
                      type="text"
                      className={"profile-edit-profile-modal-input"}
                      value={guardianForm.blood_group}
                      onChange={updateField(setGuardianForm)("blood_group")}
                    />
                  </div>
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={"profile-edit-profile-modal-input"}
                    value={guardianForm.dob}
                    onChange={updateField(setGuardianForm)("dob")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Address
                  </label>
                  <textarea
                    className={"profile-edit-profile-modal-textarea"}
                    rows={2}
                    value={guardianForm.address}
                    onChange={updateField(setGuardianForm)("address")}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === "academic" && (
            <>
              <h3 className={"profile-edit-profile-modal-subheading"}>
                Education
              </h3>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Highest Education
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.highestEducation}
                    onChange={updateField(setEducationForm)("highestEducation")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.specialization}
                    onChange={updateField(setEducationForm)("specialization")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    University
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.university}
                    onChange={updateField(setEducationForm)("university")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Passing Year
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.passingYear}
                    onChange={updateField(setEducationForm)("passingYear")}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Additional Qualification
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.additionalQualification}
                    onChange={updateField(setEducationForm)(
                      "additionalQualification",
                    )}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Certifications
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={educationForm.certifications}
                    onChange={updateField(setEducationForm)("certifications")}
                  />
                </div>
              </div>

              <h3 className={"profile-edit-profile-modal-subheading"}>
                Experience
              </h3>
              <div className={"profile-edit-profile-modal-row"}>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Total Experience
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={experienceForm.totalExperience}
                    onChange={updateField(setExperienceForm)("totalExperience")}
                  />
                </div>
                <div className={"profile-edit-profile-modal-field"}>
                  <label className={"profile-edit-profile-modal-label"}>
                    Previous Organization
                  </label>
                  <input
                    type="text"
                    className={"profile-edit-profile-modal-input"}
                    value={experienceForm.previousOrganization}
                    onChange={updateField(setExperienceForm)(
                      "previousOrganization",
                    )}
                  />
                </div>
              </div>
              <div className={"profile-edit-profile-modal-field"}>
                <label className={"profile-edit-profile-modal-label"}>
                  Role
                </label>
                <input
                  type="text"
                  className={"profile-edit-profile-modal-input"}
                  value={experienceForm.role}
                  onChange={updateField(setExperienceForm)("role")}
                />
              </div>
            </>
          )}
        </div>

        <div className={"profile-edit-profile-modal-actions"}>
          {saveError && (
            <p className={"profile-edit-profile-modal-error"}>{saveError}</p>
          )}
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
