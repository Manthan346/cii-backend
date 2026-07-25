import { Users } from "lucide-react";
import { Avatar, StatusBadge, ActionButtons } from "../../../shared";
import styles from "./EventTable.module.css";

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
    <div className={styles.tableWrap}>
      <table className={styles.table}>
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
                <div className={styles.nameCell}>
                  <span className={styles.name}>{record.title}</span>
                  <span className={styles.subtitle}>{record.type}</span>
                </div>
              </td>
              <td className={styles.nowrap}>{record.mode}</td>
              <td>
                <div className={styles.nameCell}>
                  <span className={styles.name}>{record.date}</span>
                  <span className={styles.subtitle}>{record.time}</span>
                </div>
              </td>
              <td className={styles.venueCell}>{record.venue}</td>
              <td className={styles.nowrap}>{record.batch}</td>
              <td>
                <div className={styles.organizerCell}>
                  <Avatar name={record.organizer} tone="teal" size={28} />
                  <span>{record.organizer}</span>
                </div>
              </td>
              <td className={styles.nowrap}>
                <div className={styles.participantsCell}>
                  <Users size={14} className={styles.participantsIcon} />
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
