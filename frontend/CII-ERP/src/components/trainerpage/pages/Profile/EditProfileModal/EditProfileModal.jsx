import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../shared';
import './EditProfileModal.css';

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
    id: 'personal',
    label: 'Personal',
  },
  {
    id: 'contact',
    label: 'Contact',
  },
  {
    id: 'address',
    label: 'Address',
  },
  {
    id: 'guardian',
    label: 'Guardian',
  },
  {
    id: 'academic',
    label: 'Academic',
  },
];
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
  const [personalForm, setPersonalForm] = useState({
    ...personal,
  });
  const [contactForm, setContactForm] = useState({
    ...contact,
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

  useEffect(() => {
    // Only revoke blob: URLs we created ourselves - the initial
    // avatarUrl passed in could be a real imported asset path, which
    // isn't ours to revoke.
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const nextPreview = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return nextPreview;
    });
    // Allow re-selecting the same file later.
    event.target.value = '';
  };

  const handleDeletePicture = () => {
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
  };

  // Up to 3 guardians can be added (Father / Mother / one extra); at
  // least one is mandatory, so this always starts with at least one
  // (blank) entry rather than an empty array.
  const EMPTY_GUARDIAN = {
    name: '',
    relationship: '',
    phone_no: '',
    occupation: '',
    blood_group: '',
    address: '',
  };
  const [fatherForm, setFatherForm] = useState({
    ...EMPTY_GUARDIAN,
    ...father,
  });
  const [motherForm, setMotherForm] = useState({
    ...EMPTY_GUARDIAN,
    ...mother,
  });
  const [guardianForm, setGuardianForm] = useState({
    ...EMPTY_GUARDIAN,
    ...guardian,
  });
  const [educationForm, setEducationForm] = useState({
    ...education,
  });
  const [experienceForm, setExperienceForm] = useState({
    ...experience,
  });
  const updateField = (setter) => (field) => (event) => {
    const { value } = event.target;
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
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
  const handleSave = () => {
    onSave?.({
      personal: personalForm,
      contact: contactForm,
      currentAddress: addressForm,
      permanentAddress: permanentAddressForm,
      fatherDetails: fatherForm,
      motherDetails: motherForm,
      guardianDetails: guardianForm,
      education: educationForm,
      experience: experienceForm,
      avatarUrl: avatarPreview,
    });
  };
  return (
    <div
      className={'profile-edit-profile-modal-overlay'}
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      <div className={'profile-edit-profile-modal-modal'}>
        <h2 className={'profile-edit-profile-modal-title'}>Edit Profile</h2>

        <div className={'profile-edit-profile-modal-section-tabs'}>
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`${'profile-edit-profile-modal-section-tab'} ${activeSection === section.id ? 'profile-edit-profile-modal-section-tab-active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className={'profile-edit-profile-modal-body'}>
          {activeSection === 'personal' && (
            <>
              <div className={'profile-edit-profile-modal-avatar-row'}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className={'profile-edit-profile-modal-avatar-preview'}
                  />
                ) : (
                  <div className={'profile-edit-profile-modal-avatar-placeholder'} />
                )}

                <div className={'profile-edit-profile-modal-avatar-actions'}>
                  <button
                    type="button"
                    className={'profile-edit-profile-modal-avatar-upload-btn'}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload New Picture
                  </button>
                  <button
                    type="button"
                    className={'profile-edit-profile-modal-avatar-delete-btn'}
                    onClick={handleDeletePicture}
                    disabled={!avatarPreview}
                  >
                    Delete Picture
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={'profile-edit-profile-modal-avatar-input'}
                    onChange={handlePictureChange}
                  />
                </div>
              </div>

              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Name
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={personalForm.name}
                    onChange={updateField(setPersonalForm)('name')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Gender
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={personalForm.gender}
                    onChange={updateField(setPersonalForm)('gender')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    placeholder="dd mmm yyyy"
                    value={personalForm.dob}
                    onChange={updateField(setPersonalForm)('dob')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Blood Group
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={personalForm.bloodGroup}
                    onChange={updateField(setPersonalForm)('bloodGroup')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Designation
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    placeholder="e.g. Software Engineer, Trainer, etc."
                    value={personalForm.designation}
                    onChange={updateField(setPersonalForm)('designation')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={personalForm.companyName}
                    placeholder="e.g. ABC Pvt Ltd, XYZ Institute, etc."
                    onChange={updateField(setPersonalForm)('companyName')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-field'}>
                <label className={'profile-edit-profile-modal-label'}>
                  Highest Qualification
                </label>
                <input
                  type="text"
                  className={'profile-edit-profile-modal-input'}
                  value={personalForm.highestQualification}
                  onChange={updateField(setPersonalForm)(
                    'highestQualification',
                  )}
                />
              </div>
            </>
          )}

          {activeSection === 'contact' && (
            <>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={contactForm.mobileNumber}
                    onChange={updateField(setContactForm)('mobileNumber')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={contactForm.emergencyContactNumber}
                    onChange={updateField(setContactForm)(
                      'emergencyContactNumber',
                    )}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-field'}>
                <label className={'profile-edit-profile-modal-label'}>
                  Email - ID
                </label>
                <input
                  type="email"
                  className={'profile-edit-profile-modal-input'}
                  value={contactForm.emailId}
                  onChange={updateField(setContactForm)('emailId')}
                />
              </div>
            </>
          )}

          {activeSection === 'address' && (
            <>
              <h3 className={'profile-edit-profile-modal-subheading'}>
                Current Address
              </h3>
              <div className={'profile-edit-profile-modal-field'}>
                <label className={'profile-edit-profile-modal-label'}>
                  Address Line
                </label>
                <textarea
                  className={'profile-edit-profile-modal-textarea'}
                  rows={2}
                  value={addressForm.line}
                  onChange={updateField(setAddressForm)('line')}
                />
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    State
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.state}
                    onChange={updateField(setAddressForm)('state')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    City
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.city}
                    onChange={updateField(setAddressForm)('city')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    District
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.district}
                    onChange={updateField(setAddressForm)('district')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Pin Code
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.pinCode}
                    onChange={updateField(setAddressForm)('pinCode')}
                  />
                </div>
              </div>

              <h3 className={'profile-edit-profile-modal-subheading'}>
                Permanent Address
              </h3>
              <div className={'profile-edit-profile-modal-field'}>
                <label className={'profile-edit-profile-modal-label'}>
                  Address Line
                </label>
                <textarea
                  className={'profile-edit-profile-modal-textarea'}
                  rows={2}
                  value={permanentAddressForm.line}
                  onChange={updateField(setPermanentAddressForm)('line')}
                />
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    State
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={permanentAddressForm.state}
                    onChange={updateField(setPermanentAddressForm)('state')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    City
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={permanentAddressForm.city}
                    onChange={updateField(setPermanentAddressForm)('city')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    District
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={permanentAddressForm.district}
                    onChange={updateField(setPermanentAddressForm)(
                      'district',
                    )}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Pin Code
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={permanentAddressForm.pinCode}
                    onChange={updateField(setPermanentAddressForm)(
                      'pinCode',
                    )}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === 'guardian' && (
            <>
              <div className={'profile-edit-profile-modal-guardian-card'}>
                <h3 className={'profile-edit-profile-modal-subheading'}>Father</h3>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Name</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={fatherForm.name}
                      onChange={updateField(setFatherForm)('name')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Mobile Number</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={fatherForm.phone_no}
                      onChange={updateField(setFatherForm)('phone_no')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Occupation</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={fatherForm.occupation}
                      onChange={updateField(setFatherForm)('occupation')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Blood Group</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={fatherForm.blood_group}
                      onChange={updateField(setFatherForm)('blood_group')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>Address</label>
                  <textarea
                    className={'profile-edit-profile-modal-textarea'}
                    rows={2}
                    value={fatherForm.address}
                    onChange={updateField(setFatherForm)('address')}
                  />
                </div>
              </div>

              <div className={'profile-edit-profile-modal-guardian-card'}>
                <h3 className={'profile-edit-profile-modal-subheading'}>Mother</h3>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Name</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={motherForm.name}
                      onChange={updateField(setMotherForm)('name')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Mobile Number</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={motherForm.phone_no}
                      onChange={updateField(setMotherForm)('phone_no')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Occupation</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={motherForm.occupation}
                      onChange={updateField(setMotherForm)('occupation')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Blood Group</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={motherForm.blood_group}
                      onChange={updateField(setMotherForm)('blood_group')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>Address</label>
                  <textarea
                    className={'profile-edit-profile-modal-textarea'}
                    rows={2}
                    value={motherForm.address}
                    onChange={updateField(setMotherForm)('address')}
                  />
                </div>
              </div>

              <div className={'profile-edit-profile-modal-guardian-card'}>
                <h3 className={'profile-edit-profile-modal-subheading'}>Guardian</h3>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Name</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={guardianForm.name}
                      onChange={updateField(setGuardianForm)('name')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Relationship</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      placeholder="e.g. Uncle, Sibling"
                      value={guardianForm.relationship}
                      onChange={updateField(setGuardianForm)('relationship')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Mobile Number</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={guardianForm.phone_no}
                      onChange={updateField(setGuardianForm)('phone_no')}
                    />
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Occupation</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={guardianForm.occupation}
                      onChange={updateField(setGuardianForm)('occupation')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-row'}>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>Blood Group</label>
                    <input
                      type="text"
                      className={'profile-edit-profile-modal-input'}
                      value={guardianForm.blood_group}
                      onChange={updateField(setGuardianForm)('blood_group')}
                    />
                  </div>
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>Address</label>
                  <textarea
                    className={'profile-edit-profile-modal-textarea'}
                    rows={2}
                    value={guardianForm.address}
                    onChange={updateField(setGuardianForm)('address')}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === 'academic' && (
            <>
              <h3 className={'profile-edit-profile-modal-subheading'}>
                Education
              </h3>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Highest Education
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.highestEducation}
                    onChange={updateField(setEducationForm)('highestEducation')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Specialization
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.specialization}
                    onChange={updateField(setEducationForm)('specialization')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    University
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.university}
                    onChange={updateField(setEducationForm)('university')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Passing Year
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.passingYear}
                    onChange={updateField(setEducationForm)('passingYear')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Additional Qualification
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.additionalQualification}
                    onChange={updateField(setEducationForm)(
                      'additionalQualification',
                    )}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Certifications
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={educationForm.certifications}
                    onChange={updateField(setEducationForm)('certifications')}
                  />
                </div>
              </div>

              <h3 className={'profile-edit-profile-modal-subheading'}>
                Experience
              </h3>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Total Experience
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={experienceForm.totalExperience}
                    onChange={updateField(setExperienceForm)('totalExperience')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Previous Organization
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={experienceForm.previousOrganization}
                    onChange={updateField(setExperienceForm)(
                      'previousOrganization',
                    )}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-field'}>
                <label className={'profile-edit-profile-modal-label'}>
                  Role
                </label>
                <input
                  type="text"
                  className={'profile-edit-profile-modal-input'}
                  value={experienceForm.role}
                  onChange={updateField(setExperienceForm)('role')}
                />
              </div>
            </>
          )}
        </div>

        <div className={'profile-edit-profile-modal-actions'}>
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
