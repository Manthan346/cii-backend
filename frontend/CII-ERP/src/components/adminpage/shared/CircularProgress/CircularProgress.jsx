import React from 'react';
import './CircularProgress.css';

/**
 * CircularProgress
 *
 * SVG ring showing a percentage, with the number in the center - used
 * for Profile's "Profile completion" ring today, reusable anywhere
 * else a completion/score ring is needed.
 *
 * Props:
 *  - value: number       -> 0-100
 *  - size: number         -> ring diameter in px. Defaults to 120.
 *  - strokeWidth: number  -> Defaults to 10.
 *  - color: string        -> CSS color for the filled arc. Defaults to admin blue.
 *  - trackColor: string   -> CSS color for the unfilled track. Defaults to a light gray.
 */
const CircularProgress = ({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color = '#3e5feb',
  trackColor = '#e7eaf1',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <div
      className="admin-circular-progress"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <span className="admin-circular-progress__label">{clamped}%</span>
    </div>
  );
};

export default CircularProgress;
