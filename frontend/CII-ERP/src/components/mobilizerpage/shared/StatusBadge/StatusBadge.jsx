import React from "react";
import "./StatusBadge.css";

/**
 * StatusBadge
 *
 * Small colored pill for a status word (Upcoming, Today, New, Office
 * Visit Scheduled, Follow-up Required...). Status -> color mapping
 * lives here so any page listing job fairs, candidates, or follow-ups
 * can reuse the exact same look, which is why this sits in /shared
 * instead of inside a single page's folder.
 *
 * Props:
 *  - status: string -> the label to display; also used to pick a color
 */
const STATUS_TONE = {
  upcoming: "blue",
  today: "orange",
  new: "blue",
  "office visit scheduled": "orange",
  "follow-up required": "orange",
  interested: "green",
  "not interested": "red",
  called: "purple",
  "follow up": "lightblue",
};

const StatusBadge = ({ status }) => {
  const tone = STATUS_TONE[status?.toLowerCase()] || "grey";

  return (
    <span className={`m-status-badge m-status-badge--${tone}`}>{status}</span>
  );
};

export default StatusBadge;
