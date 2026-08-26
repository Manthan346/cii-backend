import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Pencil, Trash2, Download } from 'lucide-react';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import StatusSelect from '../../shared/StatusSelect/StatusSelect';
import RowActionsMenu from '../../shared/RowActionsMenu/RowActionsMenu';
import { eventTypeStyles, eventStatusStyles, eventStatusOptions } from '../../data';
import './EventTable.css';

/**
 * EventTable
 *
 * Renders the events list as a table: Event, Type, Date & Time,
 * Venue, Candidates, Status, a per-row "Import" button, and a row
 * action menu.
 *
 * Status is editable, not just displayed: the recruiter picks
 * Upcoming / Ongoing / Completed directly from the pill via
 * StatusSelect (onChange calls onStatusChange(eventId, nextStatus)).
 * Type stays a plain read-only StatusBadge - only the event's status
 * is meant to be settable.
 *
 * Per request, "Import" lives on each row (opens ImportModal scoped
 * to that specific event) instead of a single button in the page
 * header - see JobFairJobDrive.jsx / JobFairJobDriveList.jsx for
 * where the modal itself is owned.
 *
 * The row menu only has three items: View (opens EventApplicationsView,
 * showing that event's candidates), Edit, and Delete.
 */
const EventTable = ({ events, onViewEvent, onEditEvent, onDeleteEvent, onImportEvent, onStatusChange }) => {
  return (
    <div className="event-table">
      <table className="event-table__table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Type</th>
            <th>Date &amp; Time</th>
            <th>Venue</th>
            <th>Candidates</th>
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
                <StatusBadge label={event.type} {...(eventTypeStyles[event.type] ?? {})} />
              </td>
              <td>
                <div className="event-table__datetime">
                  <span className="event-table__meta-line">
                    <Calendar size={14} className="event-table__meta-icon" />
                    {event.date}
                  </span>
                  <span className="event-table__meta-line">
                    <Clock size={14} className="event-table__meta-icon" />
                    {event.time}
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
                <span className="event-table__meta-line">
                  <Users size={14} className="event-table__meta-icon" />
                  {event.candidates}
                </span>
              </td>
              <td>
                <StatusSelect
                  value={event.status}
                  options={eventStatusOptions}
                  stylesMap={eventStatusStyles}
                  onChange={(nextStatus) => onStatusChange(event.id, nextStatus)}
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
                    { id: 'view', label: 'View', icon: Eye, onClick: () => onViewEvent(event.id) },
                    { id: 'edit', label: 'Edit', icon: Pencil, onClick: () => onEditEvent(event.id) },
                    { id: 'delete', label: 'Delete', icon: Trash2, danger: true, onClick: () => onDeleteEvent(event.id) },
                  ]}
                />
              </td>
            </tr>
          ))}

          {events.length === 0 && (
            <tr>
              <td colSpan={8} className="event-table__empty">
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
