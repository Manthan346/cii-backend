import React, { useEffect, useState } from "react";
import { fetchRecruiterProfile } from "../../../../api/recruiter/profileservice";
import "./Profile.css";

const emptyProfile = {
  name: "",
  designation: "",
  organization: "",
  organizationShort: "",
  email: "",
  phone: "",
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Profile = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [draftProfile, setDraftProfile] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const loadedProfile = await fetchRecruiterProfile();
        if (!cancelled) {
          setProfile(loadedProfile);
          setDraftProfile(loadedProfile);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your profile.",
          );
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

  const updateDraft = (field, value) => {
    setDraftProfile((current) => ({ ...current, [field]: value }));
  };

  const handleEdit = () => {
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setIsEditing(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setProfile((current) => ({
      ...current,
      name: draftProfile.name.trim(),
      phone: draftProfile.phone.trim(),
    }));
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <div>
          <h1 className="profile-page__title">Recruiter Profile</h1>
          <p className="profile-page__subtitle">
            Manage your personal and organization details
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="profile-page__edit-btn"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
      </header>

      {loading && <p className="profile-page__status">Loading profile...</p>}
      {error && (
        <p
          className="profile-page__status profile-page__status--error"
          role="alert"
        >
          {error}
        </p>
      )}

      <form
        className="profile-page__card"
        aria-busy={loading}
        onSubmit={handleSave}
      >
        <div className="profile-page__identity">
          <span className="profile-page__avatar">
            {getInitials(profile.name)}
          </span>
          <div>
            <p className="profile-page__name">{profile.name || "—"}</p>
            <p className="profile-page__role">
              {[profile.designation, profile.organizationShort]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        </div>

        <div className="profile-page__grid">
          <label className="profile-page__field">
            <span className="profile-page__label">Name</span>
            <input
              type="text"
              value={isEditing ? draftProfile.name : profile.name}
              disabled={!isEditing}
              onChange={(event) => updateDraft("name", event.target.value)}
              className={`profile-page__input${isEditing ? " profile-page__input--editable" : ""}`}
            />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Designation</span>
            <input
              type="text"
              value={profile.designation}
              disabled
              className="profile-page__input"
            />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Organization</span>
            <input
              type="text"
              value={profile.organization}
              disabled
              className="profile-page__input"
            />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Email</span>
            <input
              type="email"
              value={profile.email}
              disabled
              className="profile-page__input"
            />
          </label>

          <label className="profile-page__field">
            <span className="profile-page__label">Phone</span>
            <input
              type="tel"
              value={isEditing ? draftProfile.phone : profile.phone}
              disabled={!isEditing}
              onChange={(event) => updateDraft("phone", event.target.value)}
              className={`profile-page__input${isEditing ? " profile-page__input--editable" : ""}`}
            />
          </label>
        </div>
        {isEditing && (
          <div className="profile-page__actions">
            <button
              type="button"
              className="profile-page__cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="profile-page__edit-btn">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
