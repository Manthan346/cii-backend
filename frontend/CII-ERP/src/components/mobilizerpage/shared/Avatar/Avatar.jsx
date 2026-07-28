import React from "react";
import "./Avatar.css";

/**
 * Avatar
 *
 * Circular avatar that shows a photo when `src` is provided, otherwise
 * falls back to initials derived from `name`. Used next to names in
 * Today's Follow-ups, and reusable anywhere else a candidate/staff
 * photo needs to be shown, so it lives in /shared.
 *
 * Props:
 *  - name: string   -> full name, used to derive initials when no image
 *  - src: string    -> optional image URL
 *  - size: number   -> diameter in px (default 36)
 *  - tone: string   -> background tone when showing initials:
 *                       "navy" | "purple" | "blue" | "teal" | "grey"
 */
const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Avatar = ({ name = "", src, size = 36, tone = "purple" }) => {
  return (
    <span
      className={`m-avatar m-avatar--${tone}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="m-avatar__image" />
      ) : (
        <span className="m-avatar__initials">{getInitials(name)}</span>
      )}
    </span>
  );
};

export default Avatar;
