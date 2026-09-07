import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../../shared/SectionCard/SectionCard";
import StatusPill from "../../shared/StatusPill/StatusPill";
import { fetchJobEvents } from "../../../../../api/mobilizer/placementEventsService";
import "./UpcomingJobFairs.css";

export default function UpcomingJobFairs() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchJobEvents({ limit: 2, event_status: "UPCOMING", sort_order: "desc" })
      .then(({ events: jobEvents }) => {
        if (isMounted) setEvents(jobEvents);
      })
      .catch(() => {
        if (isMounted) setError("Unable to load upcoming job fairs");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionCard
      title="Upcoming Jobfair-Jobdrive"
      headerAction={
        <button
          type="button"
          className="md-view-all"
          onClick={() => navigate("/mobilizer/placement/event")}
        >
          View all
        </button>
      }
    >
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <ul className="md-list">
          {events.map((fair) => (
            <li className="md-list__row" key={fair.id}>
              <div className="md-list__main">
                <p className="md-list__title">{fair.title}</p>
                <p className="md-list__subtitle">
                  {fair.date} · {fair.venue}
                </p>
              </div>
              <StatusPill
                status={fair.status}
                tone={fair.status === "Today" ? "amber" : "blue"}
              />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
