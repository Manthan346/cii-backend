import React from 'react';
import './InitialsAvatar.css';

/**
 * InitialsAvatar
 * Circular avatar showing the first letter of each of the first two words
 * in `name` (so "Sneha More" -> "SM"). Pass `tone` to control the
 * background color explicitly — safer than auto-hashing when you need to
 * match a specific design.
 *
 * Props:
 *  - name: string
 *  - tone: 'purple' | 'pink' | 'orange' | 'blue' | 'green' (default 'blue')
 *  - size: number (px, default 38)
 */
export default function InitialsAvatar({ name = '', tone = 'blue', size = 38 }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <span
      className={`md-avatar md-avatar--${tone}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
