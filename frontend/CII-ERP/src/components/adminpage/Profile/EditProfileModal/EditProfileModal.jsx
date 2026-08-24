import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import Modal from '../../shared/Modal/Modal';
import Tabs from '../../shared/Tabs/Tabs';
import Avatar from '../../shared/Avatar/Avatar';
import Button from '../../shared/Button/Button';
import FormField from '../../shared/FormField/FormField';
import './EditProfileModal.css';

const TABS = [
  { id: 'personal', label: 'Personal' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'academic', label: 'Academic' },
];

const buildInitialForm = (profile) => ({
  personal: { ...profile.personal },
  contact: { ...profile.contact },
  currentAddress: { ...profile.currentAddress },
  permanentAddress: { ...profile.permanentAddress },
  guardians: {
    father: { ...profile.guardians.father },
    mother: { ...profile.guardians.mother },
    guardian: { ...profile.guardians.guardian },
  },
  education: { ...profile.education },
  experience: { ...profile.experience },
});

/**
 * EditProfileModal
 *
 * "Edit Profile" popup opened from ProfileHeaderCard: 5 pill tabs
 * (Personal / Contact / Address / Guardian / Academic) sharing one
 * form state and one Cancel/Save Changes footer, so switching tabs
 * never loses unsaved edits in another tab. Wraps the shared Modal.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: function
 *  - profile: the full profileData object (data/profileData.js) - used
 *             to seed the form each time the modal opens
 *  - onSave: function(formValues) -> called with the full edited shape
 *            (same nested structure as buildInitialForm below) when
 *            "Save Changes" is clicked
 */
const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState(() => buildInitialForm(profile));

  // Re-seed the form from the latest profile data every time the modal opens,
  // and always start back on the Personal tab.
  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(profile));
      setActiveTab('personal');
    }
  }, [isOpen, profile]);

  const updateField = (section, field) => (value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateGuardianField = (person, field) => (value) => {
    setForm((prev) => ({
      ...prev,
      guardians: {
        ...prev.guardians,
        [person]: { ...prev.guardians[person], [field]: value },
      },
    }));
  };

  const handleUploadPicture = () => {
    // TODO: open a file picker and upload to
    // POST /api/admin/me/profile/picture, then update profile.header.avatarUrl
    console.log('upload new picture');
  };

  const handleDeletePicture = () => {
    // TODO: DELETE /api/admin/me/profile/picture
    console.log('delete picture');
  };

  const handleSave = () => {
    // TODO: PATCH /api/admin/me/profile with `form`
    onSave?.(form);
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="760px">
      <div className="admin-edit-profile">
        <h2 className="admin-edit-profile__title">Edit Profile</h2>

        <Tabs variant="pills" tabs={TABS} activeId={activeTab} onChange={setActiveTab} />

        <div className="admin-edit-profile__body">
          {activeTab === 'personal' && (
            <div className="admin-edit-profile__section">
              <div className="admin-edit-profile__avatar-row">
                <Avatar src={profile.header.avatarUrl} alt={profile.personal.name} size={64} />
                <Button variant="accent" shape="pill" size="sm" onClick={handleUploadPicture}>
                  Upload New Picture
                </Button>
                <Button variant="danger" shape="pill" size="sm" onClick={handleDeletePicture}>
                  Delete Picture
                </Button>
              </div>

              <div className="admin-edit-profile__grid">
                <FormField label="Name" name="name" value={form.personal.name} onChange={updateField('personal', 'name')} />
                <FormField label="Gender" name="gender" value={form.personal.gender} onChange={updateField('personal', 'gender')} />
                <FormField label="Date of Birth" name="dob" placeholder="dd mmm yyyy" value={form.personal.dob} onChange={updateField('personal', 'dob')} />
                <FormField label="Blood Group" name="bloodGroup" value={form.personal.bloodGroup} onChange={updateField('personal', 'bloodGroup')} />
                <FormField label="Designation" name="designation" placeholder="e.g. Software Engineer, Trainer, etc." value={form.personal.designation} onChange={updateField('personal', 'designation')} />
                <FormField label="Company Name" name="companyName" placeholder="e.g. ABC Pvt Ltd, XYZ Institute, etc." value={form.personal.companyName} onChange={updateField('personal', 'companyName')} />
              </div>
              <FormField
                label="Highest Qualification"
                name="highestQualification"
                value={form.personal.highestQualification}
                onChange={updateField('personal', 'highestQualification')}
              />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="admin-edit-profile__section">
              <div className="admin-edit-profile__grid">
                <FormField label="Mobile Number" name="mobile" value={form.contact.mobile} onChange={updateField('contact', 'mobile')} />
                <FormField label="Emergency Contact Number" name="emergencyContact" value={form.contact.emergencyContact} onChange={updateField('contact', 'emergencyContact')} />
              </div>
              <FormField
                label="Email - ID"
                name="email"
                value={form.contact.email}
                onChange={updateField('contact', 'email')}
                suffix={
                  <button type="button" className="admin-edit-profile__send-btn" aria-label="Verify email">
                    <Send size={14} strokeWidth={2} />
                  </button>
                }
              />
            </div>
          )}

          {activeTab === 'address' && (
            <div className="admin-edit-profile__section">
              <h3 className="admin-edit-profile__section-heading">Current Address</h3>
              <FormField label="Address Line" name="currentAddressLine" type="textarea" value={form.currentAddress.line} onChange={updateField('currentAddress', 'line')} />
              <div className="admin-edit-profile__grid">
                <FormField label="State" name="currentState" value={form.currentAddress.state} onChange={updateField('currentAddress', 'state')} />
                <FormField label="City" name="currentCity" value={form.currentAddress.city} onChange={updateField('currentAddress', 'city')} />
                <FormField label="District" name="currentDistrict" value={form.currentAddress.district} onChange={updateField('currentAddress', 'district')} />
                <FormField label="Pin Code" name="currentPinCode" value={form.currentAddress.pinCode} onChange={updateField('currentAddress', 'pinCode')} />
              </div>

              <h3 className="admin-edit-profile__section-heading">Permanent Address</h3>
              <FormField label="Address Line" name="permanentAddressLine" type="textarea" value={form.permanentAddress.line} onChange={updateField('permanentAddress', 'line')} />
              <div className="admin-edit-profile__grid">
                <FormField label="State" name="permanentState" value={form.permanentAddress.state} onChange={updateField('permanentAddress', 'state')} />
                <FormField label="City" name="permanentCity" value={form.permanentAddress.city} onChange={updateField('permanentAddress', 'city')} />
                <FormField label="District" name="permanentDistrict" value={form.permanentAddress.district} onChange={updateField('permanentAddress', 'district')} />
                <FormField label="Pin Code" name="permanentPinCode" value={form.permanentAddress.pinCode} onChange={updateField('permanentAddress', 'pinCode')} />
              </div>
            </div>
          )}

          {activeTab === 'guardian' && (
            <div className="admin-edit-profile__section">
              {[
                { key: 'father', label: 'Father' },
                { key: 'mother', label: 'Mother' },
                { key: 'guardian', label: 'Guardian' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <h3 className="admin-edit-profile__section-heading">{label}</h3>
                  <div className="admin-edit-profile__grid">
                    <FormField label="Name" name={`${key}Name`} value={form.guardians[key].name} onChange={updateGuardianField(key, 'name')} />
                    <FormField label="Mobile Number" name={`${key}Mobile`} value={form.guardians[key].mobile} onChange={updateGuardianField(key, 'mobile')} />
                    <FormField label="Occupation" name={`${key}Occupation`} value={form.guardians[key].occupation} onChange={updateGuardianField(key, 'occupation')} />
                    <FormField label="Blood Group" name={`${key}BloodGroup`} value={form.guardians[key].bloodGroup} onChange={updateGuardianField(key, 'bloodGroup')} />
                  </div>
                  <FormField label="Address" name={`${key}Address`} type="textarea" rows={2} value={form.guardians[key].address} onChange={updateGuardianField(key, 'address')} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="admin-edit-profile__section">
              <h3 className="admin-edit-profile__section-heading">Education</h3>
              <div className="admin-edit-profile__grid">
                <FormField label="Highest Education" name="highestEducation" value={form.education.highestEducation} onChange={updateField('education', 'highestEducation')} />
                <FormField label="Specialization" name="specialization" value={form.education.specialization} onChange={updateField('education', 'specialization')} />
                <FormField label="University" name="university" value={form.education.university} onChange={updateField('education', 'university')} />
                <FormField label="Passing Year" name="passingYear" value={form.education.passingYear} onChange={updateField('education', 'passingYear')} />
                <FormField label="Additional Qualification" name="additionalQualification" value={form.education.additionalQualification} onChange={updateField('education', 'additionalQualification')} />
                <FormField label="Certifications" name="certifications" value={form.education.certifications} onChange={updateField('education', 'certifications')} />
              </div>

              <h3 className="admin-edit-profile__section-heading">Experience</h3>
              <div className="admin-edit-profile__grid">
                <FormField label="Total Experience" name="totalExperience" value={form.experience.totalExperience} onChange={updateField('experience', 'totalExperience')} />
                <FormField label="Previous Organization" name="previousOrganization" value={form.experience.previousOrganization} onChange={updateField('experience', 'previousOrganization')} />
              </div>
              <FormField label="Role" name="role" value={form.experience.role} onChange={updateField('experience', 'role')} />
            </div>
          )}
        </div>

        <div className="admin-edit-profile__footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
