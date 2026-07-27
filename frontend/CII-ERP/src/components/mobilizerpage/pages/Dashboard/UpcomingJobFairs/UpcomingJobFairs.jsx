import React from "react";
import { SectionCard, ListRow } from "../../../shared";
import { upcomingJobFairs } from "../../../data";
import "./UpcomingJobFairs.css";

/**
 * UpcomingJobFairs
 *
 * Dashboard list of the mobilizer's upcoming (and today's) job fairs,
 * each with a date/venue line and a status pill ("Upcoming" / "Today").
 * Composed with the reusable <SectionCard> (with its "View all" action)
 * and <ListRow> from /shared — no avatar for this list, just title/meta.
 */
const UpcomingJobFairs = () => {
  return (
    <SectionCard
      title="Upcoming Job Fairs"
      actionLabel="View all"
      className="upcoming-job-fairs"
    >
      <ul className="upcoming-job-fairs__list">
        {upcomingJobFairs.map((fair) => (
          <ListRow
            key={fair.id}
            title={fair.name}
            meta={fair.meta}
            status={fair.status}
          />
        ))}
      </ul>
    </SectionCard>
  );
};

export default UpcomingJobFairs;
