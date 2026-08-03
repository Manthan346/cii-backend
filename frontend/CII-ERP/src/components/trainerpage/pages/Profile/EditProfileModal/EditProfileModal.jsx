import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
  guardians,
  activeGuardianIndex,
  education,
  experience,
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
  // Up to 3 guardians can be added (Father / Mother / one extra); at
  // least one is mandatory, so this always starts with at least one
  // (blank) entry rather than an empty array.
  const EMPTY_GUARDIAN = {
    name: '',
    relationship: '',
    mobileNumber: '',
    occupation: '',
    bloodGroup: '',
    address: '',
  };
  const [guardianForms, setGuardianForms] = useState(() =>
    guardians && guardians.length > 0
      ? guardians.slice(0, 3).map((g) => ({ ...EMPTY_GUARDIAN, ...g }))
      : [{ ...EMPTY_GUARDIAN, relationship: 'Father' }],
  );
  const [guardianError, setGuardianError] = useState('');
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
  const updateGuardianField = (index, field) => (event) => {
    const { value } = event.target;
    setGuardianForms((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g)),
    );
    if (guardianError) setGuardianError('');
  };
  const handleAddGuardian = () => {
    if (guardianForms.length >= 3) return;
    setGuardianForms((prev) => [...prev, { ...EMPTY_GUARDIAN }]);
  };
  const handleRemoveGuardian = (index) => {
    // At least one guardian is mandatory, so the last remaining entry
    // can't be removed.
    setGuardianForms((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };
  const handleSave = () => {
    const filledGuardians = guardianForms.filter((g) => g.name?.trim());
    if (filledGuardians.length === 0) {
      setGuardianError('Please add at least one guardian’s name.');
      setActiveSection('guardian');
      return;
    }
    onSave?.({
      personal: personalForm,
      contact: contactForm,
      currentAddress: addressForm,
      permanentAddress: permanentAddressForm,
      guardians: filledGuardians,
      education: educationForm,
      experience: experienceForm,
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
              <p className={'profile-edit-profile-modal-guardian-hint'}>
                Add up to 3 guardians (e.g. Father, Mother, and one more) -
                at least one is required.
              </p>

              {guardianError && (
                <p className={'profile-edit-profile-modal-error'}>
                  {guardianError}
                </p>
              )}

              {guardianForms.map((guardianForm, index) => (
                <div
                  className={'profile-edit-profile-modal-guardian-card'}
                  key={index}
                >
                  <div className={'profile-edit-profile-modal-guardian-card-header'}>
                    <h3 className={'profile-edit-profile-modal-subheading'}>
                      Guardian {index + 1}
                    </h3>
                    {guardianForms.length > 1 && (
                      <button
                        type="button"
                        className={
                          'profile-edit-profile-modal-guardian-remove-btn'
                        }
                        onClick={() => handleRemoveGuardian(index)}
                        aria-label={`Remove guardian ${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className={'profile-edit-profile-modal-row'}>
                    <div className={'profile-edit-profile-modal-field'}>
                      <label className={'profile-edit-profile-modal-label'}>
                        Name
                      </label>
                      <input
                        type="text"
                        className={'profile-edit-profile-modal-input'}
                        value={guardianForm.name}
                        onChange={updateGuardianField(index, 'name')}
                      />
                    </div>
                    <div className={'profile-edit-profile-modal-field'}>
                      <label className={'profile-edit-profile-modal-label'}>
                        Relationship
                      </label>
                      <input
                        type="text"
                        className={'profile-edit-profile-modal-input'}
                        placeholder="Father / Mother / Guardian"
                        value={guardianForm.relationship}
                        onChange={updateGuardianField(index, 'relationship')}
                      />
                    </div>
                  </div>
                  <div className={'profile-edit-profile-modal-row'}>
                    <div className={'profile-edit-profile-modal-field'}>
                      <label className={'profile-edit-profile-modal-label'}>
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        className={'profile-edit-profile-modal-input'}
                        value={guardianForm.mobileNumber}
                        onChange={updateGuardianField(index, 'mobileNumber')}
                      />
                    </div>
                    <div className={'profile-edit-profile-modal-field'}>
                      <label className={'profile-edit-profile-modal-label'}>
                        Occupation
                      </label>
                      <input
                        type="text"
                        className={'profile-edit-profile-modal-input'}
                        value={guardianForm.occupation}
                        onChange={updateGuardianField(index, 'occupation')}
                      />
                    </div>
                  </div>
                  <div className={'profile-edit-profile-modal-row'}>
                    <div className={'profile-edit-profile-modal-field'}>
                      <label className={'profile-edit-profile-modal-label'}>
                        Blood Group
                      </label>
                      <input
                        type="text"
                        className={'profile-edit-profile-modal-input'}
                        value={guardianForm.bloodGroup}
                        onChange={updateGuardianField(index, 'bloodGroup')}
                      />
                    </div>
                  </div>
                  <div className={'profile-edit-profile-modal-field'}>
                    <label className={'profile-edit-profile-modal-label'}>
                      Address
                    </label>
                    <textarea
                      className={'profile-edit-profile-modal-textarea'}
                      rows={2}
                      value={guardianForm.address}
                      onChange={updateGuardianField(index, 'address')}
                    />
                  </div>
                </div>
              ))}

              {guardianForms.length < 3 && (
                <button
                  type="button"
                  className={'profile-edit-profile-modal-guardian-add-btn'}
                  onClick={handleAddGuardian}
                >
                  <Plus size={14} />
                  Add another guardian
                </button>
              )}
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
