import React from 'react';
import './Avatar.css';

/**
 * Avatar
 *
 * Circular avatar that shows a photo when `src` is provided, otherwise
 * falls back to initials derived from `name`. Not tied to the topbar
 * user specifically — this is the same building block a Candidate
 * Management / Student list would use to show a picture next to each
 * name, so it lives in /shared for reuse across pages.
 *
 * Props:
 *  - name: string   -> full name, used to derive initials when no image
 *  - src: string    -> optional image URL
 *  - size: number   -> diameter in px (default 38)
 *  - tone: string   -> background tone when showing initials: "teal" | "orange" | "blue" | "grey"
 */
const getInitials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const Avatar = ({ name = '', src, size = 38, tone = 'teal' }) => {
  return (
    <span
      className={`avatar avatar--${tone}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="avatar__image" />
      ) : (
        <span className="avatar__initials">{getInitials(name)}</span>
      )}
    </span>
  );
};

export default Avatar;
