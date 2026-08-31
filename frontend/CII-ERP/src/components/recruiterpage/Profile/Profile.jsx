import React, { useEffect, useState } from 'react';
import { fetchRecruiterProfile } from '../../../../api/recruiter/profileservice';
import './Profile.css';

const emptyProfile = {
  name: '',
  designation: '',
  organization: '',
  organizationShort: '',
  email: '',
  phone: '',
};

const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Profile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const loadedProfile = await fetchRecruiterProfile();
        if (!cancelled) setProfile(loadedProfile);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || 'Unable to load your profile.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <div>
          <h1 className="profile-page__title">Recruiter Profile</h1>
          <p className="profile-page__subtitle">Manage your personal and organization details</p>
        </div>

        <button
          type="button"
          className="profile-page__edit-btn"
          disabled
          title="Profile editing is not available yet."
        >
          Edit Profile
        </button>
      </header>

      {loading && <p className="profile-page__status">Loading profile...</p>}
      {error && <p className="profile-page__status profile-page__status--error" role="alert">{error}</p>}

      <div className="profile-page__card" aria-busy={loading}>
        <div className="profile-page__identity">
          <span className="profile-page__avatar">{getInitials(profile.name)}</span>
          <div>
            <p className="profile-page__name">{profile.name || '—'}</p>
            <p className="profile-page__role">
              {[profile.designation, profile.organizationShort].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
        </div>

        <div className="profile-page__grid">
          <label className="profile-page__field">
            <span className="profile-page__label">Name</span>
            <input type="text" value={profile.name} disabled className="profile-page__input" />
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
            <input type="text" value={profile.phone} disabled className="profile-page__input" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Profile;
