import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Mail,
  MapPin,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserProfile } from "../../../../../api/admin/adminUsersService";
import "./UserRecordView.css";

const getFirstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const formatRole = (role = "") => {
  if (!role) return "Unknown";
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/[_-]/g, " ");
};

const safeText = (value, fallback = "—") =>
  value === null || value === undefined || value === "" ? fallback : value;

const isUuidLike = (text) => {
  if (typeof text !== "string") return false;
  const cleaned = text.trim();
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
    cleaned,
  );
};

const hasMeaningfulDisplayText = (value) => {
  if (value === null || value === undefined || value === "") return false;

  if (Array.isArray(value)) {
    return value.some((item) => hasMeaningfulDisplayText(item));
  }

  if (typeof value === "object") {
    return Object.values(value).some((item) => hasMeaningfulDisplayText(item));
  }

  const text = String(value).trim();
  return Boolean(text) && text !== "[object Object]" && !isUuidLike(text);
};

const getDisplayableText = (value) => {
  if (value === null || value === undefined || value === "") return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => getDisplayableText(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "string") {
    const text = value.trim();
    return text && text !== "[object Object]" && !isUuidLike(text) ? text : "";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    return getReadableObjectText(value);
  }

  return String(value);
};

const getReadableObjectText = (item) => {
  if (item === null || item === undefined) return "";
  if (typeof item === "string") return getDisplayableText(item);
  if (typeof item === "number" || typeof item === "boolean")
    return String(item);
  if (typeof item !== "object") return String(item);

  const preferredKeyPatterns = [
    /course/i,
    /title/i,
    /subject/i,
    /name/i,
    /label/i,
    /email/i,
    /address/i,
    /contact/i,
    /role/i,
  ];

  const preferredKeys = Object.keys(item).filter((key) => {
    const lower = String(key).toLowerCase();
    return preferredKeyPatterns.some((pattern) => pattern.test(lower));
  });

  for (const key of preferredKeys) {
    const value = item[key];
    const text = getDisplayableText(value);
    if (text) return text;
  }

  const values = [];
  Object.entries(item).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    const lower = String(key).toLowerCase();
    const isMeta =
      /id|uuid|date|time|status|created|updated|start|end|timestamp/i.test(
        lower,
      );

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      const text = getDisplayableText(value);
      if (
        text &&
        (!isMeta ||
          /course|title|subject|name|label|email|address|contact|role/i.test(
            lower,
          ))
      ) {
        values.push(text);
      }
      return;
    }

    if (typeof value === "object") {
      const nestedText = getReadableObjectText(value);
      if (nestedText && nestedText !== "[object Object]") {
        values.push(nestedText);
      }
    }
  });

  return values.filter(Boolean).slice(0, 3).join(" / ");
};

const formatDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  if (Array.isArray(value)) {
    const items = value.map((item) => getDisplayableText(item)).filter(Boolean);

    return items.length ? items.join(", ") : "—";
  }

  if (typeof value === "object") {
    const text = getReadableObjectText(value);
    return text && text !== "[object Object]" ? text : "—";
  }

  return getDisplayableText(value) || "—";
};

const formatDisplayDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const findNestedValue = (source, keys = []) => {
  if (!source || typeof source !== "object") return undefined;

  const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));

  const walk = (node) => {
    if (!node || typeof node !== "object") return undefined;

    if (Array.isArray(node)) {
      for (const item of node) {
        const found = walk(item);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    for (const [key, value] of Object.entries(node)) {
      if (normalizedKeys.has(String(key).toLowerCase())) {
        return value;
      }

      if (value && typeof value === "object") {
        const found = walk(value);
        if (found !== undefined) return found;
      }
    }

    return undefined;
  };

  return walk(source);
};

const findPreferredValue = (entries, matchers) => {
  if (!Array.isArray(entries) || !entries.length) return undefined;

  for (const matcher of matchers) {
    const match = entries.find(([key]) => matcher.test(String(key)));
    if (
      match &&
      match[1] !== undefined &&
      match[1] !== null &&
      match[1] !== ""
    ) {
      return match[1];
    }
  }

  return undefined;
};

const collectDetailObject = (profile = {}) => {
  const role = getFirstDefined(
    profile.user_role,
    profile.role,
    profile.type,
    profile.role_name,
    profile.user?.user_role,
    profile.user?.role,
  );

  const roleKeyCandidates = [
    role ? `${role}_details` : null,
    role ? `${role}` : null,
    role ? `${role}s_details` : null,
    role ? `${role}s` : null,
    "admin_details",
    "admin",
    "candidates_details",
    "candidates",
    "candidate_details",
    "candidate",
    "hr_details",
    "hr",
    "instructor_details",
    "instructor",
    "mobilizer_details",
    "mobilizer",
  ];

  for (const key of roleKeyCandidates) {
    if (!key) continue;
    const value = profile[key] ?? profile?.user?.[key];
    if (value && typeof value === "object") {
      return value;
    }
  }

  const detailKeys = Object.keys(profile).filter(
    (key) =>
      (key.endsWith("_details") ||
        key.endsWith("_detail") ||
        /^(admin|candidate|candidates|hr|instructor|mobilizer)$/i.test(key)) &&
      typeof profile[key] === "object" &&
      profile[key] !== null,
  );

  for (const key of detailKeys) {
    const value = profile[key];
    if (value && Object.keys(value).length) {
      return value;
    }
  }

  return {};
};

const flattenProfileFields = (profile = {}) => {
  const entries = [];

  const addEntries = (obj, prefix = "") => {
    if (!obj || typeof obj !== "object") return;

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedKey = key.replace(/_/g, " ");
      const fullKey = prefix ? `${prefix} ${cleanedKey}` : cleanedKey;

      if (value === null || value === undefined || value === "") return;

      if (typeof value === "object") {
        if (Array.isArray(value)) {
          entries.push([
            fullKey,
            value
              .map((item) => getReadableObjectText(item))
              .filter(Boolean)
              .join(", "),
          ]);
        } else {
          addEntries(value, fullKey);
        }
        return;
      }

      entries.push([fullKey, String(value)]);
    });
  };

  addEntries(profile);

  return entries.filter(([key]) => {
    const lower = key.toLowerCase();
    return !(
      lower.includes("password") ||
      lower.includes("token") ||
      lower.includes("secret") ||
      lower.includes("image url")
    );
  });
};

const deriveName = (profile = {}) => {
  const detailObject = collectDetailObject(profile);
  const flattenedEntries = flattenProfileFields(profile);

  const firstName = getFirstDefined(
    profile?.profile_first_name,
    profile?.profileFirstName,
    profile?.first_name,
    profile?.user?.profile_first_name,
    profile?.user?.profileFirstName,
    profile?.user?.first_name,
    detailObject?.profile_first_name,
    detailObject?.profileFirstName,
    detailObject?.first_name,
    detailObject?.admin_first_name,
    detailObject?.candidate_first_name,
    detailObject?.candidates_first_name,
    detailObject?.hr_first_name,
    detailObject?.instructor_first_name,
    detailObject?.mobilizer_first_name,
    findPreferredValue(flattenedEntries, [
      /^profile first name$/i,
      /^profile.*first name$/i,
      /^first name$/i,
      /^candidate first name$/i,
      /profile_first_name/i,
      /profilefirstName/i,
      /first_name/i,
    ]),
    profile?.full_name?.split(" ")?.[0],
  );

  const lastName = getFirstDefined(
    profile?.profile_last_name,
    profile?.profileLastName,
    profile?.last_name,
    profile?.user?.profile_last_name,
    profile?.user?.profileLastName,
    profile?.user?.last_name,
    detailObject?.profile_last_name,
    detailObject?.profileLastName,
    detailObject?.last_name,
    detailObject?.admin_last_name,
    detailObject?.candidate_last_name,
    detailObject?.candidates_last_name,
    detailObject?.hr_last_name,
    detailObject?.instructor_last_name,
    detailObject?.mobilizer_last_name,
    findPreferredValue(flattenedEntries, [
      /^profile last name$/i,
      /^profile.*last name$/i,
      /^last name$/i,
      /^candidate last name$/i,
      /profile_last_name/i,
      /profileLastName/i,
      /last_name/i,
    ]),
    profile?.full_name?.split(" ").slice(1).join(" "),
  );

  const directFullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (directFullName) {
    return directFullName;
  }

  const otherNameParts = [
    detailObject?.candidate_name,
    detailObject?.full_name,
    detailObject?.fullName,
    detailObject?.name,
    profile?.candidate_name,
    profile?.user_name,
    profile?.username,
    profile?.full_name,
    profile?.fullName,
    profile?.name,
    profile?.user?.candidate_name,
    profile?.user?.user_name,
    profile?.user?.name,
    profile?.user?.full_name,
    profile?.user?.fullName,
    findPreferredValue(flattenedEntries, [
      /^candidate name$/i,
      /^full name$/i,
      /^user name$/i,
      /^name$/i,
      /candidate_name/i,
      /full_name/i,
      /user_name/i,
    ]),
  ].filter(Boolean);

  if (otherNameParts.length) {
    return otherNameParts.join(" ");
  }

  const email = getFirstDefined(
    profile?.user_email,
    profile?.email,
    profile?.user?.user_email,
    profile?.user?.email,
  );

  return safeText(email, "User profile");
};

const UserRecordView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      if (!userId) {
        if (isMounted) {
          setError("User id is missing.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const profile = await fetchUserProfile(userId);
        if (isMounted) {
          setUser(profile);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        if (isMounted) {
          setError("Unable to load user details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const detailObject = useMemo(() => collectDetailObject(user ?? {}), [user]);
  const flattenedProfile = useMemo(
    () => flattenProfileFields(user ?? {}),
    [user],
  );

  const role = getFirstDefined(
    user?.user_role,
    user?.role,
    user?.type,
    user?.role_name,
    user?.user?.user_role,
    user?.user?.role,
    Object.keys(user ?? {})
      .find((key) => key.endsWith("_details") || key.endsWith("_detail"))
      ?.replace(/_details$/, "")
      ?.replace(/_detail$/, ""),
  );

  const name = deriveName(user ?? {});
  const email = getFirstDefined(
    user?.user_email,
    user?.email,
    user?.user?.user_email,
  );
  const fallbackProfileRole = getFirstDefined(
    findPreferredValue(Object.entries(detailObject), [
      /role_name/i,
      /user.*role/i,
      /role/i,
      /userdetails role/i,
    ]),
    findPreferredValue(flattenedProfile, [
      /role_name/i,
      /user.*role/i,
      /role/i,
      /userdetails role/i,
    ]),
  );
  const fallbackProfileName = getFirstDefined(
    findPreferredValue(Object.entries(detailObject), [
      /full name/i,
      /first name/i,
      /last name/i,
      /candidate name/i,
      /user name/i,
      /name/i,
    ]),
    findPreferredValue(flattenedProfile, [
      /full name/i,
      /first name/i,
      /last name/i,
      /candidate name/i,
      /user name/i,
      /name/i,
    ]),
    findNestedValue(user, [
      "full_name",
      "fullName",
      "first_name",
      "last_name",
      "candidate_name",
      "user_name",
      "username",
      "name",
    ]),
  );
  const fallbackProfileEmail = getFirstDefined(
    findPreferredValue(Object.entries(detailObject), [/email/i, /mail/i]),
    findPreferredValue(flattenedProfile, [/email/i, /mail/i]),
    findNestedValue(user, ["user_email", "email"]),
  );
  const resolvedRole = getFirstDefined(role, fallbackProfileRole);
  const resolvedName = getFirstDefined(
    name,
    fallbackProfileName,
    "User profile",
  );
  const resolvedEmail = getFirstDefined(email, fallbackProfileEmail, "—");
  const status = getFirstDefined(
    user?.is_active,
    user?.status,
    user?.user?.is_active,
  );
  const centerId = getFirstDefined(
    user?.center_id,
    user?.centerId,
    user?.center_details?.center_id,
  );
  const createdAt = getFirstDefined(
    user?.created_at,
    user?.createdAt,
    user?.user?.created_at,
  );
  const updatedAt = getFirstDefined(
    user?.updated_at,
    user?.updatedAt,
    user?.user?.updated_at,
  );
  const centerDetails = user?.center_details || {};
  const profileImage = getFirstDefined(
    user?.profile_photo,
    user?.profilePhoto,
    user?.profile_picture,
    user?.profilePic,
    user?.avatar,
    user?.photo,
    user?.image_url,
    user?.user?.profile_photo,
    user?.user?.profilePhoto,
    user?.user?.avatar,
    findNestedValue(user, [
      "profile_photo",
      "profilePhoto",
      "profile_picture",
      "profilePic",
      "avatar",
      "photo",
      "image_url",
    ]),
    flattenedProfile.find(([key]) => /profile photo/i.test(key))?.[1],
    Object.entries(detailObject).find(([key]) =>
      /profile photo/i.test(key),
    )?.[1],
  );
  const centerName = getFirstDefined(
    centerDetails?.center_name,
    centerDetails?.name,
    centerDetails?.centerName,
  );
  const centerAddress = getFirstDefined(
    centerDetails?.center_address,
    centerDetails?.address,
    centerDetails?.centerAddress,
  );
  const centerEmail = getFirstDefined(
    centerDetails?.center_email,
    centerDetails?.email,
    centerDetails?.centerEmail,
  );
  const centerContact = getFirstDefined(
    centerDetails?.center_contact,
    centerDetails?.contact,
    centerDetails?.phone,
  );
  const dateOfBirth = getFirstDefined(
    user?.date_of_birth,
    user?.dob,
    user?.dateOfBirth,
    user?.profile_details?.date_of_birth,
    user?.profile_details?.dob,
    user?.profile_details?.dateOfBirth,
    detailObject?.date_of_birth,
    detailObject?.dob,
    detailObject?.dateOfBirth,
    user?.user?.date_of_birth,
    user?.user?.dob,
  );

  if (loading) {
    return (
      <div className="admin-user-record-screen">
        <div className="admin-user-record-panel admin-user-record-panel--loading">
          Loading user profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-user-record-screen">
        <div className="admin-user-record-panel admin-user-record-panel--error">
          <h2>User details unavailable</h2>
          <p>{error}</p>
          <button
            type="button"
            className="admin-user-record__back-btn"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-user-record-screen">
      <div className="admin-user-record-header">
        <button
          type="button"
          className="admin-user-record__back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="admin-user-record-panel">
        <div className="admin-user-record-top">
          <div className="admin-user-record-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name || "User avatar"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <UserCircle2 size={28} />
            )}
          </div>

          <div className="admin-user-record-meta">
            <span className="admin-user-record-role">
              {formatRole(resolvedRole)}
            </span>
            <h1>{resolvedName}</h1>
            <p>{safeText(resolvedEmail)}</p>
          </div>

          <div
            className={`admin-user-record-status ${status === true || status === "active" ? "is-active" : "is-inactive"}`}
          >
            {status === true || status === "active" ? "Active" : "Inactive"}
          </div>
        </div>

        <div className="admin-user-record-grid">
          <div className="admin-user-record-card">
            <div className="admin-user-record-card__label">
              <Mail size={14} />
              Email
            </div>
            <div className="admin-user-record-card__value">
              {safeText(resolvedEmail)}
            </div>
          </div>

          <div className="admin-user-record-card">
            <div className="admin-user-record-card__label">
              <ShieldCheck size={14} />
              Role
            </div>
            <div className="admin-user-record-card__value">
              {formatRole(resolvedRole)}
            </div>
          </div>

          <div className="admin-user-record-card">
            <div className="admin-user-record-card__label">
              <MapPin size={14} />
              Center ID
            </div>
            <div className="admin-user-record-card__value">
              {safeText(centerId)}
            </div>
          </div>

          <div className="admin-user-record-card">
            <div className="admin-user-record-card__label">Created At</div>
            <div className="admin-user-record-card__value">
              {createdAt ? new Date(createdAt).toLocaleString() : "—"}
            </div>
          </div>

          <div className="admin-user-record-card">
            <div className="admin-user-record-card__label">Updated At</div>
            <div className="admin-user-record-card__value">
              {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
            </div>
          </div>
        </div>

        {Object.keys(centerDetails).length > 0 && (
          <div className="admin-user-record-section">
            <h2>Center details</h2>

            <div className="admin-user-record-list">
              {[
                ["center name", centerName],
                ["center address", centerAddress],
                ["center email", centerEmail],
                ["center contact", centerContact],
              ]
                .filter(
                  ([, value]) =>
                    value !== null && value !== undefined && value !== "",
                )
                .map(([label, value]) => (
                  <div className="admin-user-record-item" key={label}>
                    <span>{label}</span>
                    <strong>{formatDisplayValue(value)}</strong>
                  </div>
                ))}
            </div>
          </div>
        )}

        {(Object.keys(detailObject).length > 0 ||
          flattenedProfile.length > 0) && (
          <div className="admin-user-record-section">
            <h2>
              {Object.keys(detailObject).length > 0
                ? "Role-specific details"
                : "Profile details"}
            </h2>

            <div className="admin-user-record-list">
              {(Object.keys(detailObject).length > 0
                ? Object.entries(detailObject)
                : flattenedProfile
              )
                .filter(([key]) => {
                  const compactLabel = String(key)
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");

                  return !(
                    compactLabel.includes("isactive") ||
                    compactLabel.includes("userdetailsuserid") ||
                    compactLabel.includes("candidateid") ||
                    compactLabel.includes("firstname") ||
                    compactLabel.includes("lastname") ||
                    compactLabel.includes("profilephoto")
                  );
                })
                .map(([key, value]) => {
                  if (value === null || value === undefined || value === "")
                    return null;

                  const normalizedKey = String(key)
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                  const isDobField =
                    normalizedKey.includes("dateofbirth") ||
                    normalizedKey.includes("dob") ||
                    normalizedKey.includes("birthdate");
                  const isCourseLikeKey =
                    /course|enrollment|batch|curriculum/i.test(String(key));
                  const formattedValue = isDobField
                    ? formatDisplayDate(value)
                    : formatDisplayValue(value);

                  if (isCourseLikeKey && !hasMeaningfulDisplayText(value)) {
                    return null;
                  }

                  return (
                    <div
                      className="admin-user-record-item"
                      key={`${key}-${String(value)}`}
                    >
                      <span>{String(key).replace(/_/g, " ")}</span>
                      <strong>{formattedValue}</strong>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecordView;
