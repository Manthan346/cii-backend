import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import Button from "../../shared/Button/Button";
import {
  fetchAdminProfile,
  updateAdminProfile,
} from "../../../../../api/admin/profileService";
import "./Profile.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function formatDob(dob) {
  if (!dob) return "—";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return dob;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const buildForm = (profile) => ({
  admin_first_name: profile.admin_first_name || "",
  admin_last_name: profile.admin_last_name || "",
  date_of_birth: profile.date_of_birth || "",
  blood_group: profile.blood_group || "",
  phone_no: profile.phone_no || "",
});

/**
 * Profile (Admin)
 *
 * Single card, no modal. "Edit Profile" flips the card's read-only
 * boxes into editable inputs in place (matching the Recruiter Profile
 * reference design) with Cancel/Save Changes at the bottom of the
 * same card. Email is always read-only since GET /admin/profile
 * doesn't allow changing it here.
 */
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchAdminProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const startEditing = () => {
    setForm(buildForm(profile));
    setFormError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormError("");
  };

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setFormError("");

    if (!form.admin_first_name.trim() || !form.admin_last_name.trim()) {
      setFormError("First and last name are required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateAdminProfile(form);
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setFormError(err?.message || "Unable to save changes right now.");
    } finally {
      setSaving(false);
    }
  };

  const fullName = profile
    ? `${profile.admin_first_name} ${profile.admin_last_name}`.trim()
    : "";

  const initials =
    (profile &&
      `${profile.admin_first_name?.[0] ?? ""}${profile.admin_last_name?.[0] ?? ""}`.toUpperCase()) ||
    "A";

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-page__header">
        <div>
          <h1 className="admin-profile-page__title">Admin Profile</h1>
          <p className="admin-profile-page__subtitle">
            Manage your personal account details
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="accent"
            shape="pill"
            size="sm"
            icon={Pencil}
            onClick={startEditing}
            disabled={loading || !!error}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="admin-profile-card">
        {loading ? (
          <p className="admin-profile-card__state">Loading profile…</p>
        ) : error ? (
          <p className="admin-profile-card__state admin-profile-card__state--error">
            {error}
          </p>
        ) : (
          <>
            <div className="admin-profile-card__identity">
              <span className="admin-profile-card__initials">{initials}</span>
              <div>
                <h2 className="admin-profile-card__name">{fullName}</h2>
                <p className="admin-profile-card__role">Administrator</p>
              </div>
            </div>

            {!isEditing ? (
              <div className="admin-profile-card__grid">
                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">First Name</span>
                  <div className="admin-profile-card__value">
                    {profile.admin_first_name || "—"}
                  </div>
                </div>

                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">Last Name</span>
                  <div className="admin-profile-card__value">
                    {profile.admin_last_name || "—"}
                  </div>
                </div>

                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">
                    Date of Birth
                  </span>
                  <div className="admin-profile-card__value">
                    {formatDob(profile.date_of_birth)}
                  </div>
                </div>

                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">Blood Group</span>
                  <div className="admin-profile-card__value">
                    {profile.blood_group || "—"}
                  </div>
                </div>

                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">Email</span>
                  <div className="admin-profile-card__value">
                    {profile.email || "—"}
                  </div>
                </div>

                <div className="admin-profile-card__field">
                  <span className="admin-profile-card__label">Phone</span>
                  <div className="admin-profile-card__value">
                    {profile.phone_no || "—"}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-profile-card__grid">
                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">
                      First Name
                    </span>
                    <input
                      className="admin-profile-card__input"
                      value={form.admin_first_name}
                      onChange={updateField("admin_first_name")}
                    />
                  </div>

                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">Last Name</span>
                    <input
                      className="admin-profile-card__input"
                      value={form.admin_last_name}
                      onChange={updateField("admin_last_name")}
                    />
                  </div>

                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">
                      Date of Birth
                    </span>
                    <input
                      type="date"
                      className="admin-profile-card__input"
                      value={form.date_of_birth || ""}
                      onChange={updateField("date_of_birth")}
                    />
                  </div>

                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">
                      Blood Group
                    </span>
                    <select
                      className="admin-profile-card__input"
                      value={form.blood_group}
                      onChange={updateField("blood_group")}
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">Email</span>
                    <div className="admin-profile-card__value admin-profile-card__value--muted">
                      {profile.email || "—"}
                    </div>
                  </div>

                  <div className="admin-profile-card__field">
                    <span className="admin-profile-card__label">Phone</span>
                    <input
                      className="admin-profile-card__input"
                      value={form.phone_no}
                      onChange={updateField("phone_no")}
                    />
                  </div>
                </div>

                {formError && (
                  <p className="admin-profile-card__error">{formError}</p>
                )}

                <div className="admin-profile-card__actions">
                  <Button
                    variant="secondary"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
