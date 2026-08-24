import React from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Pencil, Trash2 } from 'lucide-react';
import StatusBadge from '../../shared/StatusBadge/StatusBadge';
import RowActionsMenu from '../../shared/RowActionsMenu/RowActionsMenu';
import { eventTypeStyles, eventStatusStyles } from '../../data';
import './EventTable.css';

/**
 * EventTable
 *
 * Renders the placement events list as a table: Event, Type,
 * Date & Time, Venue, Candidates, Status, plus a row action menu.
 *
 * Per the request, the row menu only has three items: View (opens
 * EventApplicationsView, showing that event's candidates), Edit, and Delete.
 */
const EventTable = ({ events, onViewEvent, onEditEvent, onDeleteEvent }) => {
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
                <StatusBadge label={event.status} {...(eventStatusStyles[event.status] ?? {})} />
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
