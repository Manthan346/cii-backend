import React from 'react';
import { Pencil } from 'lucide-react';
import Avatar from '../../shared/Avatar/Avatar';
import Button from '../../shared/Button/Button';
import './ProfileHeaderCard.css';

/**
 * ProfileHeaderCard
 *
 * Blue banner at the top of Profile: avatar, name/role, employee ID,
 * Active status, profile completion %, and the "Edit Profile" button
 * that opens EditProfileModal.
 *
 * The "Active" chip is a page-specific dark-navy-on-blue-banner style,
 * not one of StatusPill's semantic tones, so it's a plain styled span
 * here rather than reusing StatusPill for a look that doesn't map to
 * any of its meanings (success/pending/danger/info/neutral).
 *
 * Props:
 *  - header: { name, role, employeeId, status, profileCompletion, avatarUrl }
 *            see data/profileData.js -> profileData.header for the shape.
 *  - onEditProfile: function -> opens the edit modal
 */
const ProfileHeaderCard = ({ header, onEditProfile }) => {
  return (
    <div className="admin-profile-header">
      <Avatar src={header.avatarUrl} alt={header.name} size={84} />

      <div className="admin-profile-header__info">
        <h1 className="admin-profile-header__name">{header.name}</h1>
        <p className="admin-profile-header__role">{header.role}</p>
        <p className="admin-profile-header__id">ID : {header.employeeId}</p>
        <span className="admin-profile-header__status">{header.status}</span>
      </div>

      <div className="admin-profile-header__meta">
        <Button variant="accent" shape="pill" size="sm" icon={Pencil} onClick={onEditProfile}>
          Edit Profile
        </Button>
        <span className="admin-profile-header__completion">
          {header.profileCompletion} % Profile
          <br />
          Completed
        </span>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
