import React from 'react';
import { User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import './ProfileInfoCard.css';

/**
 * ProfileInfoCard
 * Props:
 *  - profile: profile data object
 *  - onEdit: () => void — "Edit profile" button
 */
export default function ProfileInfoCard({ profile, onEdit }) {
  return (
    <div className="pi-card">
      <h2 className="pi-card__heading">Personal Info:</h2>

      <div className="pi-identity">
        <span className="pi-avatar">{profile.initials}</span>
        <div>
          <p className="pi-identity__name">{profile.name}</p>
          {/* <p className="pi-identity__role">{profile.roleLine}</p> */}
        </div>
      </div>

      <div className="pi-grid">
        <div className="pi-field">
          <User size={17} className="pi-field__icon" />
          <div>
            <span className="pi-field__label">Employee ID</span>
            <p className="pi-field__value">{profile.employeeId}</p>
          </div>
        </div>

        <div className="pi-field">
          <Phone size={17} className="pi-field__icon" />
          <div>
            <span className="pi-field__label">Mobile</span>
            <p className="pi-field__value">{profile.mobile}</p>
          </div>
        </div>

        <div className="pi-field">
          <Mail size={17} className="pi-field__icon" />
          <div>
            <span className="pi-field__label">Email</span>
            <p className="pi-field__value">{profile.email}</p>
          </div>
        </div>

        <div className="pi-field">
          <MapPin size={17} className="pi-field__icon" />
          <div>
            <span className="pi-field__label">Assigned centre</span>
            <p className="pi-field__value">{profile.assignedCentre}</p>
          </div>
        </div>

        <div className="pi-field">
          <Briefcase size={17} className="pi-field__icon" />
          <div>
            <span className="pi-field__label">Designation</span>
            <p className="pi-field__value">{profile.designation}</p>
          </div>
        </div>
      </div>

      <button type="button" className="pi-edit-btn" onClick={onEdit}>
        Edit profile
      </button>
    </div>
  );
}
