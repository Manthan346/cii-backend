import React, { useEffect, useState } from 'react';
import ProfileInfoCard from '../ProfileInfoCard/ProfileInfoCard';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import {
  fetchMobilizerProfile,
  updateMobilizerProfile,
} from '../../../../../api/mobilizer/profileService';
import './Profile.css';

const emptyProfile = {
  initials: '',
  firstName: '',
  lastName: '',
  name: '',
  roleLine: '',
  employeeId: '',
  mobile: '',
  email: '',
  assignedCentre: '',
  designation: '',
};

export default function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetchMobilizerProfile();
        const data = response.data.data.profile;
        const [fallbackFirstName = '', ...fallbackLastName] = (data.name || '').split(' ');
        const firstName = data.first_name ?? fallbackFirstName;
        const lastName = data.last_name ?? fallbackLastName.join(' ');

        if (!cancelled) {
          setProfile((current) => ({
            ...current,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`.trim(),
            initials: `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'NA',
            employeeId: data.mobilizer_unique_id ?? current.employeeId,
            mobile: data.mobile_number ?? current.mobile,
            email: data.email ?? current.email,
            assignedCentre: data.center_name ?? current.assignedCentre,
            designation: data.designation ?? current.designation,
            roleLine: `${data.designation ?? current.designation}, ${data.center_name ?? current.assignedCentre}`,
          }));
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Unable to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async ({ first_name, last_name, mobile_number }) => {
    setSaving(true);
    setError('');

    try {
      await updateMobilizerProfile({ first_name, last_name, mobile_number });
      setProfile((current) => ({
        ...current,
        firstName: first_name,
        lastName: last_name,
        name: `${first_name} ${last_name}`.trim(),
        initials: `${first_name[0] || ''}${last_name[0] || ''}`.toUpperCase() || 'NA',
        mobile: mobile_number,
      }));
      setEditOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="pf-header">
        <h1 className="pf-header__title">Profile</h1>
        <p className="pf-header__subtitle">Your Mobilizer account details and performance summary</p>
      </div>

      {loading && <p>Loading profile...</p>}
      {error && <p role="alert">{error}</p>}

      <ProfileInfoCard profile={profile} onEdit={() => setEditOpen(true)} />

      <EditProfileModal
        isOpen={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
