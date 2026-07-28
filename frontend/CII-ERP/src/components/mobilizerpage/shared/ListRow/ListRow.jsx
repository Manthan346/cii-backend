import React from "react";
import Avatar from "../Avatar/Avatar";
import StatusBadge from "../StatusBadge/StatusBadge";
import "./ListRow.css";

/**
 * ListRow
 *
 * Generic row used by any "list of items with a status pill on the
 * right" panel — Upcoming Job Fairs, Today's Follow-ups, and any
 * future page that needs the same shape. Avatar is optional: pass
 * `showAvatar` to render initials next to the title (Follow-ups),
 * omit it for a plain title/meta row (Job Fairs).
 *
 * Props:
 *  - title: string        -> primary line (name / job fair title)
 *  - meta: string         -> secondary line (course / date · venue)
 *  - status: string       -> label rendered via <StatusBadge>
 *  - showAvatar: boolean  -> renders an <Avatar> with initials from `title`
 *  - avatarTone: string   -> tone passed through to <Avatar>
 */
const ListRow = ({ title, meta, status, showAvatar = false, avatarTone = "purple" }) => {
  return (
    <li className="m-list-row">
      {showAvatar && (
        <Avatar name={title} tone={avatarTone} size={34} />
      )}
      <div className="m-list-row__content">
        <p className="m-list-row__title">{title}</p>
        {meta && <p className="m-list-row__meta">{meta}</p>}
      </div>
      {status && (
        <div className="m-list-row__status">
          <StatusBadge status={status} />
        </div>
      )}
    </li>
  );
};

export default ListRow;
