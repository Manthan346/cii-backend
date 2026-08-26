import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import SectionCard from '../../shared/SectionCard/SectionCard';
import InfoField from '../../shared/InfoField/InfoField';
import CircularProgress from '../../shared/CircularProgress/CircularProgress';
import './BasicInformationPanel.css';

/**
 * BasicInformationPanel
 *
 * Content shown under Profile's "Basic Information" tab: Personal
 * Information + Contact side by side, a Profile completion ring with
 * a checklist, and Current/Permanent Address cards below.
 *
 * Props:
 *  - personal: { name, gender, dob, bloodGroup, highestQualification }
 *  - contact: { mobile, emergencyContact, email }
 *  - completionChecklist: array of { id, label, status: 'done' | 'warning' }
 *  - profileCompletion: number (0-100)
 *  - currentAddress / permanentAddress: { line, state, district, city, pinCode }
 *  see data/profileData.js -> profileData for the shape of all of the above.
 */
const BasicInformationPanel = ({
  personal,
  contact,
  completionChecklist = [],
  profileCompletion,
  currentAddress,
  permanentAddress,
}) => {
  return (
    <>
      <div className="admin-basic-info__top">
        <SectionCard title="Personal Information">
          <div className="admin-basic-info__fields">
            <InfoField label="Name" value={personal.name} />
            <InfoField label="Gender" value={personal.gender} />
            <InfoField label="Date of Birth" value={personal.dob} />
            <InfoField label="Blood Group" value={personal.bloodGroup} />
            <InfoField label="Highest Qualification" value={personal.highestQualification} />
          </div>
        </SectionCard>

        <SectionCard title="Contact">
          <div className="admin-basic-info__fields">
            <InfoField label="Mobile Number" value={contact.mobile} />
            <InfoField label="Emergency Contact Number" value={contact.emergencyContact} />
            <InfoField label="Email - ID" value={contact.email} />
          </div>
        </SectionCard>

        <SectionCard>
          <div className="admin-completion-card">
            <span className="admin-completion-card__pill">Profile completion</span>
            <h3 className="admin-completion-card__heading">All Set!</h3>
            <CircularProgress value={profileCompletion} />
            <ul className="admin-completion-card__checklist">
              {completionChecklist.map((item) => (
                <li key={item.id}>
                  {item.status === 'done' ? (
                    <CheckCircle2 size={15} className="admin-completion-card__icon admin-completion-card__icon--done" />
                  ) : (
                    <AlertCircle size={15} className="admin-completion-card__icon admin-completion-card__icon--warning" />
                  )}
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>

      <div className="admin-basic-info__addresses">
        <SectionCard title="Current Address">
          <AddressBlock address={currentAddress} />
        </SectionCard>
        <SectionCard title="Permanent Address">
          <AddressBlock address={permanentAddress} />
        </SectionCard>
      </div>
    </>
  );
};

const AddressBlock = ({ address }) => (
  <div className="admin-address-block">
    <p className="admin-address-block__line">{address.line}</p>
    <div className="admin-address-block__chips">
      <ChipField label="State" value={address.state} />
      <ChipField label="District" value={address.district} />
      <ChipField label="City" value={address.city} />
      <ChipField label="Pin Code" value={address.pinCode} />
    </div>
  </div>
);

const ChipField = ({ label, value }) => (
  <div className="admin-address-block__chip-field">
    <span className="admin-address-block__chip-label">{label}</span>
    <span className="admin-address-block__chip">{value}</span>
  </div>
);

export default BasicInformationPanel;
