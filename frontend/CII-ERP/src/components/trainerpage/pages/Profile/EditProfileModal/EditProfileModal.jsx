import { useState } from 'react';
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
  address,
  guardian,
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
    ...address,
  });
  const [guardianForm, setGuardianForm] = useState({
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
                    District
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.district}
                    onChange={updateField(setAddressForm)('district')}
                  />
                </div>
              </div>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Taluka
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={addressForm.taluka}
                    onChange={updateField(setAddressForm)('taluka')}
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
            </>
          )}

          {activeSection === 'guardian' && (
            <>
              <div className={'profile-edit-profile-modal-row'}>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Name
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={guardianForm.name}
                    onChange={updateField(setGuardianForm)('name')}
                  />
                </div>
                <div className={'profile-edit-profile-modal-field'}>
                  <label className={'profile-edit-profile-modal-label'}>
                    Relationship
                  </label>
                  <input
                    type="text"
                    className={'profile-edit-profile-modal-input'}
                    value={guardianForm.relationship}
                    onChange={updateField(setGuardianForm)('relationship')}
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
                    onChange={updateField(setGuardianForm)('mobileNumber')}
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
                    onChange={updateField(setGuardianForm)('occupation')}
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
                  onChange={updateField(setGuardianForm)('address')}
                />
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
