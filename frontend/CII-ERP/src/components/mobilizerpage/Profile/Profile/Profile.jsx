import React, { useState } from 'react';
import ProfileInfoCard from '../ProfileInfoCard/ProfileInfoCard';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import { profileData } from '../../data/profileData';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(profileData);
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = ({ name, mobile }) => {
    setProfile((p) => ({ ...p, name, mobile }));
    setEditOpen(false);
  };

  return (
    <div className="profile-page">
      <div className="pf-header">
        <h1 className="pf-header__title">Profile</h1>
        <p className="pf-header__subtitle">Your Mobilizer account details and performance summary</p>
      </div>

      <ProfileInfoCard profile={profile} onEdit={() => setEditOpen(true)} />

      <EditProfileModal
        isOpen={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
