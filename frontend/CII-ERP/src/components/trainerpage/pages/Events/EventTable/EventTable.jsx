import { Users } from 'lucide-react';
import { Avatar, StatusBadge, ActionButtons } from '../../../shared';
import './EventTable.css';

/**
 * EventTable (Events)
 *
 * "All Events" table for the Events page. Column shape (Event / Mode /
 * Date & time / Venue / Batch / Participants / Status / Action) is
 * specific to events, so it lives inside pages/Events rather than
 * /shared - only the generic bits (Avatar, StatusBadge, ActionButtons)
 * come from /shared.
 *
 * Row actions show view + edit + delete (no lock), so ActionButtons is
 * called with showLock={false}.
 */
export default function EventTable({ records = [], onView, onEdit, onDelete }) {
  return (
    <div className={'events-event-table-table-wrap'}>
      <table className={'events-event-table-table'}>
        <thead>
          <tr>
            <th>Event</th>
            <th>Mode</th>
            <th>Date &amp; time</th>
            <th>Venue</th>
            <th>Batch</th>
            <th>Organizer</th>
            <th>Participants</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <div className={'events-event-table-name-cell'}>
                  <span className={'events-event-table-name'}>
                    {record.title}
                  </span>
                  <span className={'events-event-table-subtitle'}>
                    {record.type}
                  </span>
                </div>
              </td>
              <td className={'events-event-table-nowrap'}>{record.mode}</td>
              <td>
                <div className={'events-event-table-name-cell'}>
                  <span className={'events-event-table-name'}>
                    {record.date}
                  </span>
                  <span className={'events-event-table-subtitle'}>
                    {record.time}
                  </span>
                </div>
              </td>
              <td className={'events-event-table-venue-cell'}>
                {record.venue}
              </td>
              <td className={'events-event-table-nowrap'}>{record.batch}</td>
              <td>
                <div className={'events-event-table-organizer-cell'}>
                  <Avatar name={record.organizer} tone="teal" size={28} />
                  <span>{record.organizer}</span>
                </div>
              </td>
              <td className={'events-event-table-nowrap'}>
                <div className={'events-event-table-participants-cell'}>
                  <Users
                    size={14}
                    className={'events-event-table-participants-icon'}
                  />
                  <span>
                    {record.participants}/{record.maxParticipants}
                  </span>
                </div>
              </td>
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
