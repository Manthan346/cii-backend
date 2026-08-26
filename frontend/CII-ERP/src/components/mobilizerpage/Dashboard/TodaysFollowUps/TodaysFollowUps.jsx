import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../../shared/SectionCard/SectionCard";
import StatusPill from "../../shared/StatusPill/StatusPill";
import InitialsAvatar from "../../shared/InitialsAvatar/InitialsAvatar";
import { fetchEnquiries } from "../../../../../api/mobilizer/enquiryService";
import "./TodaysFollowUps.css";

export default function TodaysFollowUps() {
  const navigate = useNavigate();
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchEnquiries({ limit: 6 })
      .then(({ enquiries }) => {
        if (isMounted) setRecentEnquiries(enquiries);
      })
      .catch(() => {
        if (isMounted) setError("Unable to load recent enquiries");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SectionCard
      title="Recent Enquiries"
      headerAction={
        <button
          type="button"
          className="md-view-all"
          onClick={() => navigate("/mobilizer/enquiries")}
        >
          View all
        </button>
      }
    >
      {error ? (
        <p role="alert">{error}</p>
      ) : (
        <ul className="md-followup-list">
          {recentEnquiries.map((person) => (
            <li className="md-followup-row" key={person.id}>
              <InitialsAvatar
                name={`${person.firstName} ${person.lastName}`}
                tone={person.avatarTone}
              />
              <div className="md-followup-row__main">
                <p className="md-followup-row__name">
                  {person.firstName} {person.lastName}
                </p>
                <p className="md-followup-row__course">
                  {person.enquirySource} · {person.enquiryDate}
                </p>
              </div>
              <StatusPill status={person.status} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
