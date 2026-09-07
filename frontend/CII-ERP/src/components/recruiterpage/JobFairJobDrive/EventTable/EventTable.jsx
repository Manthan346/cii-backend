import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import StatusBadge from "../../shared/StatusBadge/StatusBadge";
import StatusSelect from "../../shared/StatusSelect/StatusSelect";
import RowActionsMenu from "../../shared/RowActionsMenu/RowActionsMenu";
import {
  eventTypeStyles,
  eventStatusStyles,
  eventStatusOptions,
} from "../../../../../api/recruiter/jobEventService";
import "./EventTable.css";

const EventTable = ({
  events,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onImportEvent,
  onStatusChange,
}) => {
  return (
    <div className="event-table">
      <table className="event-table__table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Type</th>
            <th>Date &amp; Time</th>
            <th>Venue</th>
            <th>Status</th>
            <th aria-hidden="true" />
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="event-table__name">{event.name}</td>
              <td>
                <StatusBadge
                  label={event.type}
                  {...(eventTypeStyles[event.type] ?? {})}
                />
              </td>
              <td>
                <div className="event-table__datetime">
                  <span className="event-table__meta-line">
                    <Calendar size={14} className="event-table__meta-icon" />
                    {event.date}
                  </span>
                  <span className="event-table__meta-line">
                    <Clock size={14} className="event-table__meta-icon" />
                    {event.endTime ? `${event.time} - ${event.endTime}` : event.time}
                  </span>
                </div>
              </td>
              <td>
                <span className="event-table__meta-line">
                  <MapPin size={14} className="event-table__meta-icon" />
                  {event.venue}
                </span>
              </td>
              <td>
                <StatusSelect
                  value={event.status}
                  options={eventStatusOptions}
                  stylesMap={eventStatusStyles}
                  onChange={(nextStatus) =>
                    onStatusChange(event.id, nextStatus)
                  }
                />
              </td>
              <td>
                <button
                  type="button"
                  className="event-table__import-btn"
                  onClick={() => onImportEvent(event.id)}
                >
                  Import
                  <Download size={14} />
                </button>
              </td>
              <td className="event-table__actions">
                <RowActionsMenu
                  items={[
                    {
                      id: "view",
                      label: "View",
                      icon: Eye,
                      onClick: () => onViewEvent(event),
                    },
                    {
                      id: "edit",
                      label: "Edit",
                      icon: Pencil,
                      onClick: () => onEditEvent(event), // was onEditEvent(event.id)
                    },
                    {
                      id: "delete",
                      label: "Delete",
                      icon: Trash2,
                      danger: true,
                      onClick: () => onDeleteEvent(event.id),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}

          {events.length === 0 && (
            <tr>
              <td colSpan={7} className="event-table__empty">
                No events match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
