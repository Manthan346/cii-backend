import { useState } from "react";
import { Button } from "../../../shared";
import styles from "./EditProfileModal.module.css";

/**
 * EditProfileModal
 *
 * "Edit Profile" popup form used to add/edit every field shown across
 * the Profile page's tabs in one place: Personal Information, Contact,
 * Address, Guardian Information, and Academic Detail (Education +
 * Experience). Document uploads keep their own dedicated flow on the
 * Document tab, so they're not duplicated here.
 *
 * Mirrors the styling/markup pattern used by AddCandidateModal /
 * MarkAttendanceModal so every popup in the app looks the same, but
 * groups fields under an internal section switcher since this form
 * covers far more fields than a typical add/edit popup.
 *
 * Fires onSave(updatedProfile) with the same shape as the props it was
 * given, so the parent (Profile.jsx) can merge it straight back into
 * state.
 */
const SECTIONS = [
  { id: "personal", label: "Personal" },
  { id: "contact", label: "Contact" },
  { id: "address", label: "Address" },
  { id: "guardian", label: "Guardian" },
  { id: "academic", label: "Academic" },
];

export default function EditProfileModal({
  personal,
  contact,
  address,
  guardian,
  education,
  experience,
  onCancel,
  onSave,
}) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const [personalForm, setPersonalForm] = useState({ ...personal });
  const [contactForm, setContactForm] = useState({ ...contact });
  const [addressForm, setAddressForm] = useState({ ...address });
  const [guardianForm, setGuardianForm] = useState({ ...guardian });
  const [educationForm, setEducationForm] = useState({ ...education });
  const [experienceForm, setExperienceForm] = useState({ ...experience });

  const updateField = (setter) => (field) => (event) => {
    const { value } = event.target;
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.({
      personal: personalForm,
      contact: contactForm,
      address: addressForm,
      guardian: guardianForm,
      education: educationForm,
      experience: experienceForm,
    });
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Edit profile">
      <div className={styles.modal}>
        <h2 className={styles.title}>Edit Profile</h2>

        <div className={styles.sectionTabs}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`${styles.sectionTab} ${
                activeSection === section.id ? styles.sectionTabActive : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {activeSection === "personal" && (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={personalForm.name}
                    onChange={updateField(setPersonalForm)("name")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Gender</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={personalForm.gender}
                    onChange={updateField(setPersonalForm)("gender")}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Date of Birth</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="dd mmm yyyy"
                    value={personalForm.dob}
                    onChange={updateField(setPersonalForm)("dob")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Blood Group</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={personalForm.bloodGroup}
                    onChange={updateField(setPersonalForm)("bloodGroup")}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Highest Qualification</label>
                <input
                  type="text"
                  className={styles.input}
                  value={personalForm.highestQualification}
                  onChange={updateField(setPersonalForm)("highestQualification")}
                />
              </div>
            </>
          )}

          {activeSection === "contact" && (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Mobile Number</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={contactForm.mobileNumber}
                    onChange={updateField(setContactForm)("mobileNumber")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Emergency Contact Number</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={contactForm.emergencyContactNumber}
                    onChange={updateField(setContactForm)("emergencyContactNumber")}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email - ID</label>
                <input
                  type="email"
                  className={styles.input}
                  value={contactForm.emailId}
                  onChange={updateField(setContactForm)("emailId")}
                />
              </div>
            </>
          )}

          {activeSection === "address" && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Address Line</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={addressForm.line}
                  onChange={updateField(setAddressForm)("line")}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={addressForm.state}
                    onChange={updateField(setAddressForm)("state")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>District</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={addressForm.district}
                    onChange={updateField(setAddressForm)("district")}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Taluka</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={addressForm.taluka}
                    onChange={updateField(setAddressForm)("taluka")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Pin Code</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={addressForm.pinCode}
                    onChange={updateField(setAddressForm)("pinCode")}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === "guardian" && (
            <>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={guardianForm.name}
                    onChange={updateField(setGuardianForm)("name")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Relationship</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={guardianForm.relationship}
                    onChange={updateField(setGuardianForm)("relationship")}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Mobile Number</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={guardianForm.mobileNumber}
                    onChange={updateField(setGuardianForm)("mobileNumber")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Occupation</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={guardianForm.occupation}
                    onChange={updateField(setGuardianForm)("occupation")}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Address</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={guardianForm.address}
                  onChange={updateField(setGuardianForm)("address")}
                />
              </div>
            </>
          )}

          {activeSection === "academic" && (
            <>
              <h3 className={styles.subheading}>Education</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Highest Education</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.highestEducation}
                    onChange={updateField(setEducationForm)("highestEducation")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Specialization</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.specialization}
                    onChange={updateField(setEducationForm)("specialization")}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>University</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.university}
                    onChange={updateField(setEducationForm)("university")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Passing Year</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.passingYear}
                    onChange={updateField(setEducationForm)("passingYear")}
                  />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Additional Qualification</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.additionalQualification}
                    onChange={updateField(setEducationForm)("additionalQualification")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Certifications</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={educationForm.certifications}
                    onChange={updateField(setEducationForm)("certifications")}
                  />
                </div>
              </div>

              <h3 className={styles.subheading}>Experience</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Total Experience</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={experienceForm.totalExperience}
                    onChange={updateField(setExperienceForm)("totalExperience")}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Previous Organization</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={experienceForm.previousOrganization}
                    onChange={updateField(setExperienceForm)("previousOrganization")}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <input
                  type="text"
                  className={styles.input}
                  value={experienceForm.role}
                  onChange={updateField(setExperienceForm)("role")}
                />
              </div>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
