import React from 'react';
import { UserRound } from 'lucide-react';
import mansi from '../../assets/mansi.png'
import './Avatar.css';

/**
 * Avatar
 *
 * Circular avatar - an image when `src` is given, otherwise a plain
 * user-icon fallback. Formalizes the small avatar already used inline
 * in tables (Total Users, Candidates, ...) into a shared component so
 * Profile's larger header avatar and the Edit Profile modal's avatar
 * can reuse the same fallback logic instead of duplicating it.
 *
 * Props:
 *  - src: string   -> image URL. Falls back to an icon when absent.
 *  - alt: string   -> alt text for the image.
 *  - size: number  -> diameter in px. Defaults to 28 (table-row size).
 */
const Avatar = ({ src, alt = '', size = 28 }) => {
  const style = { width: size, height: size };

  if (src) {
    return (
      <span className="admin-avatar" style={style}>
        <img src={src} alt={alt} className="admin-avatar__image" />
      </span>
    );
  }

  return (
    <span className="admin-avatar admin-avatar--fallback" style={style}>
      <UserRound size={Math.round(size * 0.55)} strokeWidth={2} />
    </span>
  );
};

export default Avatar;
