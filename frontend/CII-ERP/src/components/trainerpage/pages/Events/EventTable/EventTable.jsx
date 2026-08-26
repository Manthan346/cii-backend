// import { Users } from "lucide-react";
import { /*Avatar,*/ StatusBadge, ActionButtons } from "../../../shared";
import "./EventTable.css";

// Formats a raw ISO date string (e.g. from event_date) to "15 Sep 2026"
function formatEventDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Formats a raw ISO time string (e.g. from event_time) to "08:30 AM"
function formatEventTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // 👈 add this
  });
}

export default function EventTable({ records = [], onView, onEdit, onDelete }) {
  return (
    <div className={"events-event-table-table-wrap"}>
      <table className={"events-event-table-table"}>
        <thead>
          <tr>
            <th>Event</th>
            <th>Mode</th>
            <th>Date &amp; time</th>
            <th>Venue</th>
            <th>Batch</th>
            {/* <th>Organizer</th>
            <th>Participants</th> */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <div className={"events-event-table-name-cell"}>
                  <span className={"events-event-table-name"}>
                    {record.title}
                  </span>
                  <span className={"events-event-table-subtitle"}>
                    {record.type}
                  </span>
                </div>
              </td>
              <td className={"events-event-table-nowrap"}>{record.mode}</td>
              <td>
                <div className={"events-event-table-name-cell"}>
                  <span className={"events-event-table-name"}>
                    {formatEventDate(record.date)}
                  </span>
                  <span className={"events-event-table-subtitle"}>
                    {formatEventTime(record.time)}
                  </span>
                </div>
              </td>
              <td className={"events-event-table-venue-cell"}>
                {record.venue}
              </td>
              <td className={"events-event-table-nowrap"}>{record.batch}</td>
              {/* <td>
                <div className={"events-event-table-organizer-cell"}>
                  <Avatar name={record.organizer} tone="teal" size={28} />
                  <span>{record.organizer}</span>
                </div>
              </td>
              <td className={"events-event-table-nowrap"}>
                <div className={"events-event-table-participants-cell"}>
                  <Users
                    size={14}
                    className={"events-event-table-participants-icon"}
                  />
                  <span>
                    {record.participants}/{record.maxParticipants}
                  </span>
                </div>
              </td> */}
              <td>
                <StatusBadge status={record.status} />
              </td>
              <td>
                <ActionButtons
                  showLock={false}
                  onView={() => onView?.(record)}
                  onEdit={() => onEdit?.(record)}
                  onDelete={() => onDelete?.(record)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
