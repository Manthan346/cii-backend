import React, { useState } from 'react';
import { profile as initialProfile } from '../data';
import './Profile.css';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Profile (Recruiter)
 *
 * "Recruiter Profile" page: header with the Edit/Save action button
 * (top-right, same convention as Job Management's "Create Job" and
 * Placement Management's "+ Add Events"), then a full-width card with
 * an identity row (avatar + name + designation/org) and a form: Name,
 * Designation, Organization, Email, Phone. Per request, the Help and
 * Support field from the reference design is dropped entirely, and
 * only Name + Phone are ever editable - Designation, Organization,
 * and Email stay permanently disabled/read-only.
 *
 * "Edit Profile" flips Name/Phone into editable inputs (backed by a
 * separate `draft` so typing doesn't mutate `profile` until Save is
 * pressed) and gives them a distinct "editable" look (white
 * background + visible border) versus the grayed-out disabled
 * fields, so it reads as an actual edit form rather than a static
 * page with a button. "Save Changes" commits the draft; "Cancel"
 * (bottom of the card, edit mode only) discards it.
 */
const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ name: initialProfile.name, phone: initialProfile.phone });

  const handleDraftChange = (field) => (event) => {
    setDraft((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEditClick = () => {
    if (isEditing) {
      setProfile((prev) => ({ ...prev, name: draft.name, phone: draft.phone }));
      setIsEditing(false);
    } else {
      setDraft({ name: profile.name, phone: profile.phone });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setDraft({ name: profile.name, phone: profile.phone });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <div>
          <h1 className="profile-page__title">Recruiter Profile</h1>
          <p className="profile-page__subtitle">Manage your personal and organization details</p>
        </div>

        <button type="button" className="profile-page__edit-btn" onClick={handleEditClick}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </header>

      <div className="profile-page__card">
        <div className="profile-page__identity">
          <span className="profile-page__avatar">{getInitials(profile.name)}</span>
          <div>
            <p className="profile-page__name">{profile.name}</p>
            <p className="profile-page__role">
              {profile.designation} · {profile.organizationShort}
            </p>
          </div>
        </div>

        <div className="profile-page__grid">
          <label className="profile-page__field">
            <span className="profile-page__label">Name</span>
            <input
              type="text"
              value={isEditing ? draft.name : profile.name}
              onChange={handleDraftChange('name')}
              disabled={!isEditing}
              className={`profile-page__input ${isEditing ? 'profile-page__input--editable' : ''}`}
            />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Designation</span>
            <input type="text" value={profile.designation} disabled className="profile-page__input" />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Organization</span>
            <input type="text" value={profile.organization} disabled className="profile-page__input" />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Email</span>
            <input type="email" value={profile.email} disabled className="profile-page__input" />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Phone</span>
            <input
              type="text"
              value={isEditing ? draft.phone : profile.phone}
              onChange={handleDraftChange('phone')}
              disabled={!isEditing}
              className={`profile-page__input ${isEditing ? 'profile-page__input--editable' : ''}`}
            />
          </label>
        </div>

        {isEditing && (
          <div className="profile-page__actions">
            <button type="button" className="profile-page__cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
