import React from "react";
import { SectionCard, ListRow } from "../../../shared";
import { todaysFollowups } from "../../../data";
import "./TodaysFollowups.css";

const AVATAR_TONES = ["purple", "blue", "teal", "navy"];

/**
 * TodaysFollowups
 *
 * Dashboard list of candidates the mobilizer needs to follow up with
 * today, each with initials avatar, course/category line, and a status
 * pill (New / Office Visit Scheduled / Follow-up Required). Composed
 * with the reusable <SectionCard> (with its "View all" action) and
 * <ListRow> from /shared.
 */
const TodaysFollowups = () => {
  return (
    <SectionCard
      title="Today's Follow-ups"
      actionLabel="View all"
      className="todays-followups"
    >
      <ul className="todays-followups__list">
        {todaysFollowups.map((person, i) => (
          <ListRow
            key={person.id}
            title={person.name}
            meta={person.meta}
            status={person.status}
            showAvatar
            avatarTone={AVATAR_TONES[i % AVATAR_TONES.length]}
          />
        ))}
      </ul>
    </SectionCard>
  );
};

export default TodaysFollowups;
